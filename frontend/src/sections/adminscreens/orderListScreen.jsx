import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';
import { Store } from '../../store';
import { getError } from '../../utils';
import { usePageTitle } from '../../hooks/usepagetitle';
import { motion } from 'motion/react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const formatDate = (iso) => (iso ? iso.substring(0, 10) : '—');
  const shortId = (id) => (id ? `${id.substring(0, 8)}...` : '—');
  const formatCurrency = (num) =>
    typeof num === 'number' ? num.toLocaleString() : num ?? '—';

  usePageTitle('Orders');
  return (
    <>
      <div className="w-[90%] ms-[5%] mt-[2vh]">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">سفارش‌ها</h1>
          <span className="text-sm text-gray-600">
            {orders?.length ?? 0} سفارش
          </span>
        </div>

        {loadingDelete && <LoadingBox></LoadingBox>}

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="mt-4 overflow-x-hidden">
            <table className="min-w-full bg-white rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-right text-sm">جزئیات</th>
                  <th className="px-4 py-2 text-right text-sm">کاربر</th>
                  <th className="px-4 py-2 text-right text-sm">تاریخ</th>
                  <th className="px-4 py-2 text-right text-sm">مجموع</th>
                  <th className="px-4 py-2 text-right text-sm">پرداخت شده</th>
                  <th className="px-4 py-2 text-right text-sm">
                    تحویل داده شده
                  </th>
                  <th className="px-4 py-2 text-right text-sm">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="border-b last:border-none"
                  >
                    <td className="px-4 py-3 text-sm">{shortId(order._id)}{}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.user ? order.user.name : 'DELETED USER'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatCurrency(order.totalPrice)} تومان
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.isPaid ? (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Paid {formatDate(order.paidAt)}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.isDelivered ? (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Delivered {formatDate(order.deliveredAt)}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          در انتظار تحویل
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded"
                        >
                          مشاهده
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteHandler(order)}
                          className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
