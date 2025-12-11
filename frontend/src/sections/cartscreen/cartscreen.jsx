import { useContext } from 'react';
import { Store } from '../../store';
import { usePageTitle } from '../../hooks/usepagetitle';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../../components/messagebox';
import { motion } from 'motion/react';
import PriceComma from '../../hooks/pricecomma';
import axios from 'axios';

export default function CartScreen() {
      const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  usePageTitle('Parsa Shop');

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry . Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <>
      <h1 className="text-4xl ps-[10%] py-4">سبد خرید</h1>
      {cartItems.length === 0 ? (
        <MessageBox>
          سبد خرید خالی است. <Link to="/">خرید کنید</Link>
        </MessageBox>
      ) : (
        <div className="flex">
          <div className="border border-fg2 rounded-md md:w-[60%] h-fit lg:w-[50%] ms-[10%] px-4 pb-4">
            {cartItems.map((item) => (
              <div
                className="flex-center mt-3 rounded-md bg-fg2 py-2 px-3"
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
                  <button
                    className="bg-fg2 fill-fg w-5 rounded-full hover:fill-high transition-colors duration-300 cursor-pointer"
                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      id="minus"
                    >
                      <path d="M19,13H5a1,1,0,0,1,0-2H19a1,1,0,0,1,0,2Z"></path>
                    </svg>
                  </button>
                  <h1>{item.quantity}</h1>
                  <button
                    className="bg-fg2 fill-fg w-5 rounded-full hover:fill-high transition-colors duration-300 cursor-pointer"
                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                    disabled={item.quantity === item.countInStock}
                  >
                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" />
                      <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" />
                    </svg>
                  </button>
                </div>
                <h1 className="ms-6">
                  <PriceComma value={item.price} /> Toman
                </h1>
                <button onClick={() => removeItemHandler(item)} className="bg-fg2 w-5 rounded-xl ms-auto hover:fill-red-500 transition-colors duration-300 cursor-pointer">
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 41.336 41.336"
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M36.335,5.668h-8.167V1.5c0-0.828-0.672-1.5-1.5-1.5h-12c-0.828,0-1.5,0.672-1.5,1.5v4.168H5.001c-1.104,0-2,0.896-2,2
		s0.896,2,2,2h2.001v29.168c0,1.381,1.119,2.5,2.5,2.5h22.332c1.381,0,2.5-1.119,2.5-2.5V9.668h2.001c1.104,0,2-0.896,2-2
		S37.438,5.668,36.335,5.668z M14.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21c0-0.828,0.672-1.5,1.5-1.5
		s1.5,0.672,1.5,1.5V35.67z M22.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21c0-0.828,0.672-1.5,1.5-1.5
		s1.5,0.672,1.5,1.5V35.67z M25.168,5.668h-9V3h9V5.668z M30.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21
		c0-0.828,0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5V35.67z"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="md:w-[30%] ms-6 border border-fg2 rounded-md p-4">
            <h1 className="text-2xl">
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items) :
              Toman{' '}
              <PriceComma
                value={cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              />
            </h1>
            <span className="h-0.5 w-[100%] bg-fg2 block my-2"></span>
              <button className="bg-high p-2 rounded-md text-bg ms-auto hover:bg-yellow-500 transition-colors duration-300 cursor-pointer"
              onClick={checkoutHandler}
              >
              Procced to Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
