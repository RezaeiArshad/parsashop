import { Link } from 'react-router-dom';
import ThemeButton from './themebutton';
import { useContext, useState } from 'react';
import { Store } from '../../store';
import HeaderMenuButton from './headermenubutton';
import HeaderMenu from './headermenu';
import SearchBox from '../../components/searchbox';

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [showMenu, setShowMenu] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <>
      <div className="flex justify-evenly h-[8vh] bg-fg2 relative">
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
        <Link className="flex-center bg-blue-400" to="/">
          parsashop
        </Link>
        <div className="flex-center">
          <Link to="/cart" className="nav-link flex-center gap-1.5">
            Cart
            {cart.cartItems.length > 0 && (
              <div className="bg-red-500 p-1 rounded-full text-fg text-center">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </div>
            )}
          </Link>
        </div>
        <HeaderMenu />
      </div>
    </>
  );
}
