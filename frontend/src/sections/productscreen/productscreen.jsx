import { Link, useNavigate, useParams } from 'react-router-dom';
import { useReducer, useEffect, useContext, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../../components/rating';
import { usePageTitle } from '../../hooks/usepagetitle';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';
import { motion } from 'motion/react';
import { getError } from '../../utils';
import { Store } from '../../store';
import PriceComma from '../../hooks/pricecomma';
import { MessageToastContext } from '../../contexts/messageScreenContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const { setMessageToastDetails } = useContext(MessageToastContext);
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });

  usePageTitle(
    loading
      ? 'Loading...'
      : error
      ? 'Product Not Found'
      : `${product.name} - Parsa Shop`
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // keep selected image in sync when product loads
  useEffect(() => {
    if (product && product.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry . Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      setMessageToastDetails([true, false, 'لطفا یک نظر و امتیاز وارد کنید']);
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('نظر با موفقیت ثبت شد');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
      setComment('');
      setRating(0);
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  // thumbnails derived safely
  const thumbnails = product
    ? [product.image, ...(product.images || [])].filter(Boolean)
    : [];

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <>
          <div className="w-[90%] ms-[5%] mt-[2vh] md:flex md:gap-6 lg:w-[80%]">
            <div className="flex-1">
              <img
                className="w-full max-h-[540px] object-contain rounded bg-gray-50"
                src={selectedImage || product.image}
                alt={product.name}
              />
              <div className="mt-3 flex gap-2 overflow-auto">
                {thumbnails.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={`border rounded p-1 bg-white ${
                      selectedImage === x ? 'ring-2 ring-high' : ''
                    }`}
                    onClick={() => setSelectedImage(x)}
                  >
                    <img
                      src={x}
                      alt="thumb"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 mt-4 md:mt-0">
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <div className="mt-2">
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </div>

              <div className="mt-4 text-gray-600">
                <div className="mb-2">
                  <span className="font-medium">برند: </span>
                  <span>{product.brand}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">وضعیت: </span>
                  <span>
                    {product.countInStock > 0 ? (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        موجود
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        ناموجود
                      </span>
                    )}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">قیمت: </span>
                  <span className="text-xl font-bold">
                    <PriceComma value={product.price} /> تومان
                  </span>
                </div>
              </div>

              <div className="mt-4 text-gray-700">{product.description}</div>

              {/* desktop actions */}
              <div className="hidden md:block mt-6 p-4 border rounded bg-white w-full max-w-[320px]">
                {product.countInStock ? (
                  <>
                    <div className="mb-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={addToCartHandler}
                        className="w-full p-3 rounded bg-high text-bg font-medium disabled:opacity-60"
                      >
                        افزودن به سبد خرید
                      </motion.button>
                    </div>
                    <div className="text-sm text-gray-600">
                      تعداد در انبار: {product.countInStock}
                    </div>
                  </>
                ) : (
                  <div className="text-red-600 font-medium">
                    در حال حاضر موجود نیست
                  </div>
                )}
              </div>
            </div>

            {/* mobile fixed bar */}
            <div className="md:hidden fixed left-0 right-0 bottom-0 border-t bg-white p-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">قیمت</div>
                <div className="text-lg font-bold">
                  <PriceComma value={product.price} /> تومان
                </div>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`px-4 py-2 rounded text-white ${
                    product.countInStock ? 'bg-high' : 'bg-gray-400'
                  }`}
                >
                  {product.countInStock ? 'افزودن به سبد' : 'ناموجود'}
                </motion.button>
              </div>
            </div>
          </div>

          <div className="w-[90%] ms-[5%] mt-6">
            <h2 ref={reviewsRef} className="text-xl font-semibold mb-3">
              نظرات
            </h2>
            <div className="mb-3">
              {product.reviews.length === 0 && (
                <MessageBox>هنوز نظری ثبت نشده است</MessageBox>
              )}
            </div>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="p-3 border rounded bg-white">
                  <div className="flex items-center justify-between">
                    <strong>{review.name}</strong>
                    <span className="text-xs text-gray-500">
                      {review.createdAt.substring(0, 10)}
                    </span>
                  </div>
                  <Rating rating={review.rating} caption=" " />
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-3">
                  <h3 className="text-lg font-medium">ثبت نظر</h3>
                  <div>
                    <label className="block mb-1">امتیاز</label>
                    <select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="p-2 border rounded"
                    >
                      <option value={0}>انتخاب...</option>
                      <option value={1}>1 - ضعیف</option>
                      <option value={2}>2 - متوسط</option>
                      <option value={3}>3 - خوب</option>
                      <option value={4}>4 - بسیار خوب</option>
                      <option value={5}>5 - عالی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">نظر</label>
                    <textarea
                      rows="4"
                      placeholder="نظر خود را بنویسید"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <button
                      disabled={loadingCreateReview}
                      type="submit"
                      className="px-4 py-2 rounded bg-high text-bg"
                    >
                      ارسال
                    </button>
                    {loadingCreateReview && <LoadingBox />}
                  </div>
                </form>
              ) : (
                <MessageBox>
                  لطفا{' '}
                  <Link to={`/signin?redirect=/product/${product.slug}`}>
                    وارد شوید
                  </Link>{' '}
                  تا بتوانید نظر ثبت کنید
                </MessageBox>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductScreen;
