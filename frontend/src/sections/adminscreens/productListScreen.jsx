import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';
import { getError } from '../../utils';
import { plusSignSvg } from './adminSvg';
import { motion } from 'motion/react';
import ConfirmBox from '../../components/confirmBox';
import useConfirm from '../../hooks/useConfirm';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCES':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.log(err);
      }
      if (successDelete) {
        dispatch({ type: 'DELETE_RESET' });
      } else {
        fetchData();
      }
    };
    fetchData();
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    const ok = await useConfirm()('Are you sure to create?');
    if (!ok) return;
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div className="w-[90%] ms-[5%] mt-[2vh]">
      <ConfirmBox />
      <h1 className="text-4xl">محصولات</h1>
      <motion.button
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-center font-medium gap-1 mt-2 cursor-pointer bg-high text-bg px-3 py-2 rounded-md"
        onClick={createHandler}
      >
        یک محصول اضافه کنید<span>{plusSignSvg}</span>
      </motion.button>
      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="overflow-x-hidden mt-4">
            <table className="table w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-right">تصویر</th>
                  <th className="px-3 py-2 text-right">نام و جزئیات</th>
                  <th className="px-3 py-2 text-right">قیمت</th>
                  <th className="px-3 py-2 text-right">دسته‌بندی</th>
                  <th className="px-3 py-2 text-right">برند</th>
                  <th className="px-3 py-2 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="border-b last:border-none"
                  >
                    <td className="px-3 py-3 align-middle">
                      <img
                        src={
                          product.image ||
                          product.images?.[0] ||
                          '/images/placeholder.png'
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm truncate max-w-[320px]">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[320px] mt-1">
                          {product.description || '—'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          id: <span className="text-muted">{product._id}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span className="font-medium">
                        {product.price?.toLocaleString?.() ?? product.price}{' '}
                        تومان
                      </span>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span className="text-sm text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span className="text-sm text-gray-600">
                        {product.brand}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                          onClick={() =>
                            navigate(`/admin/product/${product._id}`)
                          }
                        >
                          ویرایش
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-sm text-red-600"
                          onClick={() => deleteHandler(product)}
                        >
                          حذف
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2 items-center">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={
                  x + 1 === Number(page)
                    ? 'btn text-bold bg-high text-bg px-3 py-1 rounded'
                    : 'btn px-3 py-1 rounded border'
                }
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
