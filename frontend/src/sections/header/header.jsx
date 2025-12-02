import { Link } from 'react-router-dom';
import ThemeButton from './themebutton';
import { useContext, useState } from 'react';
import { Store } from '../../store';
import HeaderMenuButton from './headermenubutton';
import HeaderMenu from './headermenu';
import SearchBox from '../../components/searchbox';
import { cartSvg } from './headerSvg';
import { motion } from 'motion/react';

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [showMenu, setShowMenu] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [cartState, setCartState] = useState('inactive');

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <>
      <div
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
        className="flex justify-evenly h-[8vh] border border-b-1 border-b-high fixed w-[100%] top-0"
      >
        <HeaderMenuButton />
        <SearchBox />
        <ThemeButton />
        {userInfo ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex-center mt-4 gap-1 focus:outline-none"
            >
              {userInfo.name}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orderhistory"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  Order History
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    signoutHandler();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link className="flex-center" to="/signin">
            Sign In
          </Link>
        )}
        {userInfo && userInfo.isAdmin && (
          <div className="relative">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="flex-center mt-4 gap-1 focus:outline-none"
            >
              Admin
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showAdmin && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1 z-10">
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/users"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Users
                </Link>
              </div>
            )}
          </div>
        )}
        <Link
          id="spiky-tech-header"
          className="font-medium flex-center font-cursive text-fg text-2xl duration-300 hover:text-high hover:scale-105 transition-all h-fit my-auto"
          to="/"
        >
          SpikyTech
        </Link>
        <motion.div
          className="flex-center w-14"
          onMouseEnter={() => setCartState('hovered')}
          onMouseLeave={() => setCartState('inactive')}
        >
          <Link to="/cart" className="nav-link flex-center gap-1.5 ms-auto">
            {cart.cartItems.length > 0 && (
              <motion.div
                animate={cartState}
                variants={{
                  inactive: {
                    background: 'rgb(255, 0, 0)',
                  },
                  hovered: {
                    background: 'var(--high)',
                  },
                }}
                transition={{ duration: 0.3 }}
                className="p-1.5 rounded-full text-fg text-center"
              >
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </motion.div>
            )}
            <motion.h1
              animate={cartState}
              variants={{
                inactive: {
                  opacity: 1.03,
                  fill: 'var(--fg)',
                  color: 'var(--fg)',
                },
                hovered: {
                  opacity: 1.03,
                  fill: 'var(--high)',
                  color: 'var(--high)',
                },
              }}
              transition={{ duration: 0.3 }}
            >
              {cartSvg}
            </motion.h1>
          </Link>
        </motion.div>
        <HeaderMenu />
      </div>
    </>
  );
}
