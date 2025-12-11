import { Link } from 'react-router-dom';
import ThemeButton from './themeButton';
import { useContext, useRef, useState } from 'react';
import { Store } from '../../store';
import HeaderMenuButton from './headermenubutton';
import HeaderMenu from './headermenu';
import SearchBox from '../../components/searchbox';
import { cartSvg } from './headerSvg';
import { motion, AnimatePresence } from 'motion/react';
import useConfirm from '../../hooks/useConfirm';

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [showMenu, setShowMenu] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [cartState, setCartState] = useState('inactive');
  const timeoutRefUser = useRef(null);
  const timeoutRefAdmin = useRef(null);

  const confirm = useConfirm()

  const signoutHandler = async () => {
    const ok = await confirm('آیا می‌خواهیداز حساب کاربری خارج شوید؟');  
    if(!ok) return;
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const userMouseEnter = () => {
    if (timeoutRefUser.current) clearTimeout(timeoutRefUser.current);
    setShowMenu(true);
  };

  const userMouseLeave = () => {
    timeoutRefUser.current = setTimeout(() => {
      setShowMenu(false);
    }, 100);
  };

  const adminMouseEnter = () => {
    if (timeoutRefAdmin.current) clearTimeout(timeoutRefAdmin.current);
    setShowAdmin(true);
  };

  const adminMouseLeave = () => {
    timeoutRefAdmin.current = setTimeout(() => {
      setShowAdmin(false);
    }, 100);
  };

  return (
    <>
      <div
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
        }}
        className="flex h-[10vh] fixed w-[100%] top-0"
      >
        <div className="flex items-center w-[40%] ms-[3%] justify-evenly">
          <HeaderMenuButton />
          <SearchBox />
          <ThemeButton />
        </div>
        <div className="flex items-center justify-evenly w-[50%] ms-[9%]">
          {userInfo ? (
            <motion.div
              className="relative cursor-pointer"
              onMouseEnter={userMouseEnter}
              onMouseLeave={userMouseLeave}
            >
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex-center font-medium cursor-pointer focus:outline-none gap-0.5"
              >
                {userInfo.name}
                <motion.svg
                  className="w-3 h-3 fill-fg"
                  viewBox="0 0 18 18"
                  animate={showMenu ? { rotate: 180 } : { rotate: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={userMouseEnter}
                    onMouseLeave={userMouseLeave}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2 z-10"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 mb-1 text-sm hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      پروفایل
                    </Link>
                    <div className="h-[1px] w-[80%] mb-1 mx-auto bg-fg2"></div>
                    <Link
                      to="/orderhistory"
                      className="block px-4 py-2 mb-1 text-sm hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      سفارش‌ها
                    </Link>
                    <motion.button
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        setShowMenu(false);
                        signoutHandler();
                      }}
                      className="p-2 ms-[10%] rounded-md text-sm w-[80%] bg-danger text-bg cursor-pointer"
                    >
                      خروج از حساب
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <Link className="flex-center" to="/signin">
              ورود
            </Link>
          )}

          {userInfo && userInfo.isAdmin && (
            <motion.div
              className="relative cursor-pointer"
              onMouseEnter={adminMouseEnter}
              onMouseLeave={adminMouseLeave}
            >
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="flex-center cursor-pointer font-medium gap-0.5 focus:outline-none"
              >
                ادمین
                <motion.svg
                  className="w-3 h-3 fill-fg"
                  viewBox="0 0 18 18"
                  animate={showAdmin ? { rotate: 180 } : { rotate: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {showAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={adminMouseEnter}
                    onMouseLeave={adminMouseLeave}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2 z-10"
                  >
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 mb-1 text-sm hover:bg-gray-100"
                      onClick={() => setShowAdmin(false)}
                    >
                      داشبورد
                    </Link>
                    <div className="h-[2px] w-[80%] mb-1 mx-auto bg-fg2"></div>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 mb-1 text-sm hover:bg-gray-100"
                      onClick={() => setShowAdmin(false)}
                    >
                      محصولات
                    </Link>
                    <div className="h-[1.5px] w-[80%] mb-1 mx-auto bg-fg2"></div>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 mb-1 text-sm hover:bg-gray-100"
                      onClick={() => setShowAdmin(false)}
                    >
                      سفارش‌ها
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          <Link
            id="spiky-tech-header"
            className="font-medium flex-center font-cursive text-fg text-2xl duration-300 hover:text-high hover:scale-105 transition-all"
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
                      color: 'var(--fg)',
                    },
                    hovered: {
                      background: 'var(--high)',
                      color: 'var(--bg)',
                    },
                  }}
                  transition={{ duration: 0.2 }}
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
                transition={{ duration: 0.2 }}
              >
                {cartSvg}
              </motion.h1>
            </Link>
          </motion.div>
          <HeaderMenu />
        </div>
      </div>
    </>
  );
}
