import { Link } from 'react-router-dom';
import ThemeButton from '../../components/themebutton';
import { useContext } from 'react';
import { Store } from '../../store';
import ShippingAddressScreen from '../shippingaddressscreen/shippingaddressscreen';


function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  }

  return (
    <>
      <div className="flex justify-evenly h-[8vh] bg-fg2">
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
        {userInfo ? (
          <div className="flex-center gap-4">
            <Link to="/profile">{userInfo.name}</Link>
            <Link to="/orderhistory">Order History</Link>
            <Link to="#signout" onClick={signoutHandler}>
              Sign Out
            </Link>
          </div>
        ) : (
          <Link className="flex-center" to="/signin">
            Sign In
          </Link>
        )}
        <ThemeButton />
      </div>
    </>
  );
}

export default Header;
