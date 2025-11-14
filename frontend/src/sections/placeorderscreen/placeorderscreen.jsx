import { useContext, useEffect } from 'react';
import CheckoutSteps from '../../components/checkoutsteps';
import { usePageTitle } from '../../hooks/usepagetitle';
import { Store } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import PriceComma from '../../hooks/pricecomma';
import { useReducer } from 'react';
import { getError } from '../../utils';
import { toast } from 'react-toastify';
import  Axios  from 'axios';
import LoadingBox from '../../components/loadingbox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST': {
      return { ...state, loading: true };
    }
    case 'CREATE_SUCCESS': {
      return { ...state, loading: false };
    }
    case 'CREATE_FAIL': {
      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
        dispatch({ type: 'CREATE_SUCCESS' });
        localStorage.removeItem("cartItems");
        navigate(`/order/${data.order._id}`)

    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  usePageTitle('Preview Order');
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 className="text-4xl text-center mt-4">Preview order</h1>
      <div className="flex w-[80%] ms-[10%] mt-5 gap-3">
        <div className="w-[60%]">
          <div className="border-fg2 border-1 rounded-xl p-5">
            <h1 className="font-bold text-xl">Shipping</h1>
            <h1>
              <span className="font-medium">Name: </span>
              {cart.shippingAddress.fullName}
            </h1>
            <h1 className="mb-2">
              <span className="font-medium">Address: </span>{' '}
              {cart.shippingAddress.address},{cart.shippingAddress.city},
              {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
            </h1>
            <Link
              className="text-high hover:text-blue-800 transition-colors duration-300"
              to="/shipping"
            >
              Edit Address
            </Link>
          </div>
          <div className="border-fg2 border-1 rounded-xl p-5 mt-4">
            <h1 className="font-bold text-xl">Payment</h1>
            <h1 className="mb-2">
              <span className="font-medium">Method: </span>
              {cart.paymentMethod}
            </h1>
            <Link
              className="text-high hover:text-blue-800 transition-colors duration-300"
              to="/payment"
            >
              Edit Payment
            </Link>
          </div>
          <div className="border border-fg2 rounded-xl h-fit px-4 pt-4 pb-5 mt-5">
            <h1 className="font-bold text-xl mb-3">Items</h1>
            {cart.cartItems.map((item) => (
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
            <Link
              className="text-high hover:text-blue-800 transition-colors duration-300"
              to="/cart"
            >
              Edit Items
            </Link>
          </div>
        </div>
        <div className="w-[40%] h-fit border-fg2 border-1 rounded-xl p-5">
          <h1 className="text-xl">Order Summery</h1>
          <div className="flex">
            <h1 className="flex-1">Items: </h1>
            <h1 className="flex-1">{cart.itemsPrice.toFixed(2)}</h1>
          </div>
          <div className="flex">
            <h1 className="flex-1">Shipping: </h1>
            <h1 className="flex-1">{cart.shippingPrice.toFixed(2)}</h1>
          </div>
          <div className="flex">
            <h1 className="flex-1">Tax: </h1>
            <h1 className="flex-1">{cart.taxPrice.toFixed(2)}</h1>
          </div>
          <div className="w-full h-0.5 bg-fg2"></div>
          <div className="flex font-medium">
            <h1 className="flex-1">Order Total: </h1>
            <h1 className="flex-1">{cart.totalPrice.toFixed(2)} Toman</h1>
          </div>
          <button
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0}
            className="mt-3 bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
          >
            Place Order
                  </button>
                  {loading && <LoadingBox />}
        </div>
      </div>
    </>
  );
}
