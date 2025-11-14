import { useContext, useEffect, useReducer } from 'react';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../store';
import axios from 'axios';
import { getError } from '../../utils';
import { usePageTitle } from '../../hooks/usepagetitle';
import PriceComma from '../../hooks/pricecomma';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, loading: false, order: action.payload, error: '' };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    case 'PAY_REQUEST': {
      return { ...state, loadingPay: true };
    }
    case 'PAY_SUCCESS': {
      return { ...state, loadingPay: false, successPay: true };
    }
    case 'PAY_FAIL': {
      return { ...state, loadingPay: false, errorPay: action.payload };
    }
    case 'PAY_RESET': {
      return { ...state, loadingPay: false, successPay: false };
    }
    default: {
      return state;
    }
  }
}

export default function OrderScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const [
    { loading, error, order, successPay, loadingPay, isPending },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
    isPending: false,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    }
  }, [order, userInfo, orderId, navigate, successPay]);

  const orderSuccess = async (
    details = 'this has to be filled with payment info'
  ) => {
    dispatch({ type: 'PAY_REQUEST' });
    const { data } = await axios.put(`/api/orders/${order._id}/pay`, details, {
      headers: { authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: 'PAY_SUCCESS', payload: data });
    console.log('response', data)
    toast.success('Order is paid');
  };

  const orderFail = () => {
    dispatch({ type: 'PAY_FAIL', payload: 'You Clicked on the red button' });
    toast.error(getError('well you did'));
  };

  usePageTitle(`Order ${orderId}`);

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <>
          <MessageBox>{error}</MessageBox>
        </>
      ) : (
        <div className="w-[80%] mx-auto mt-4">
          {' '}
          <h1 className="text-4xl">Order {orderId}</h1>
          <div className="flex pt-4  gap-3">
            <div className="w-[60%]">
              <div className="border-fg2 border-1 rounded-xl p-5">
                <h1 className="font-bold text-xl">Shipping</h1>
                <h1 className="mb-2">
                  <span className="font-medium">Name: </span>
                  {order.shippingAddress.fullName}
                </h1>
                <h1>
                  Address:{' '}
                  <span>
                    {order.shippingAddress.fullName},{' '}
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode},
                    {order.shippingAddress.country}
                  </span>
                </h1>
                {order.isDelivered ? (
                  <MessageBox>Delivered at {order.deliveredAt}</MessageBox>
                ) : (
                  <MessageBox>Not Delivered</MessageBox>
                )}
              </div>
              <div className="border-fg2 border-1 rounded-xl p-5 mt-4">
                <h1 className="font-bold text-xl">Payment</h1>
                <h1>
                  <span className="font-medium">Method: </span>
                  {order.paymentMethod}
                </h1>
                {order.isPaid ? (
                  <MessageBox isSuccess={true}>
                    Paid At {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox>Not Paid</MessageBox>
                )}
              </div>
              <div className="border border-fg2 rounded-xl h-fit px-4 pt-4 pb-5 mt-5">
                <h1 className="font-bold text-xl mb-3">Items</h1>
                {order.orderItems.map((item) => (
                  <div
                    className="flex-center mb-3 rounded-md bg-fg2 py-2 px-3"
                    key={item._id}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-md h-[40px]"
                    />
                    <Link
                      className="text-blue-700 ms-3 hover:text-blue-900"
                      to={`/product/${item.slug}`}
                    >
                      {' '}
                      {item.name}
                    </Link>
                    <div className="flex-center gap-2 ms-auto">
                      <h1>{item.quantity}</h1>
                    </div>
                    <h1 className="ms-6">
                      <PriceComma value={item.price} /> Toman
                    </h1>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 h-fit border-fg2 border-1 rounded-xl p-5">
              <h1 className="text-xl">Order Summery</h1>
              <div className="flex">
                <h1 className="flex-1">Items: </h1>
                <h1 className="flex-1">{order.itemsPrice.toFixed(2)}</h1>
              </div>
              <div className="flex">
                <h1 className="flex-1">Shipping: </h1>
                <h1 className="flex-1">{order.shippingPrice.toFixed(2)}</h1>
              </div>
              <div className="flex">
                <h1 className="flex-1">Tax: </h1>
                <h1 className="flex-1">{order.taxPrice.toFixed(2)}</h1>
              </div>
              <div className="w-full h-0.5 bg-fg2"></div>
              <div className="flex font-medium">
                <h1 className="flex-1">Order Total: </h1>
                <h1 className="flex-1">{order.totalPrice.toFixed(2)} Toman</h1>
              </div>
              {!order.isPaid &&
                (isPending ? (
                  <LoadingBox />
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => orderSuccess()}
                        className="mt-3 bg-green-600 p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
                      >
                        Order Success
                      </button>
                      <button
                        onClick={() => orderFail()}
                        className="mt-3 bg-red-600 p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
                      >
                        Order Fail
                      </button>
                    </div>
                    {loadingPay && <LoadingBox />}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
