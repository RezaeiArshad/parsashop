import { useContext } from 'react';
import { usePageTitle } from '../../hooks/usepagetitle';
import MessageBox from '../../components/messagebox';
import { Store } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, orders: action.payload, loading: false };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (userInfo) {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };    
    fetchData();        
    }
    else {
        navigate('/signin')
    }

  }, [userInfo, navigate]);

  usePageTitle('Order History');
  return (
    <div className="w-[80%] mx-auto mt-4">
      <h1 className="text-5xl">Order History</h1>
      {loading ? (
        <div></div>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div id="the-tabel">
          <div className="border-b-1 flex font-medium text-xl">
            <h1 className="w-[30%]">Id</h1>
            <h1 className="w-[15%]">Date</h1>
            <h1 className="w-[15%]">Total</h1>
            <h1 className="w-[15%]">Paid</h1>
            <h1 className="w-[15%]">Delivered</h1>
            <h1 className="w-[10%]">Actions</h1>
          </div>
          <div>
            {orders.map((order) => (
              <div className="flex items-center h-fit pb-3 border-b-1 border-b-fg2 mt-3" key={order._id}>
                <h1 className="w-[30%]">{order._id}</h1>
                <h1 className="w-[15%]">{order.createdAt.substring(0, 10)}</h1>
                <h1 className="w-[15%]">{order.totalPrice.toFixed(2)}</h1>
                <h1 className="w-[15%]">
                  {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                </h1>
                <h1 className='w-[15%]'>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </h1>
                <button
                  className=" bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
                  onClick={() => {
                    navigate(`/order/${order._id}`);
                  }}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
