import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Lobby from './sections/lobby/lobby';
import ProductScreen from './sections/productscreen/productscreen';
import CartScreen from './sections/cartscreen/cartscreen';
import SigninScreen from './sections/signinscreen/signinscreen';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './sections/shippingaddressscreen/shippingaddressscreen';
import SignupScreen from './sections/signupscreen/signupscreen';
import PaymentMethodScreen from './sections/paymentmethodscreen/paymentmethodscreen';
import PlaceOrderScreen from './sections/placeorderscreen/placeorderscreen';
import OrderScreen from './sections/orderscreen/orderscreen';
import OrderHistoryScreen from './sections/orderhistory/orderhistory';
import ProfileScreen from './sections/profilescreen/profilescreen';
import SearchScreen from './sections/searchscreen/searchscreen';
import ProtectedRoute from './components/protectedRoute';
import DashBoardScreen from './sections/adminscreens/dashBoardScreen';
import AdminRoute from './components/adminRoute';
import ProductListScreen from './sections/adminscreens/productListScreen';
import ProductEditScreen from './sections/adminscreens/productEditScreen';
import OrderListScreen from './sections/adminscreens/orderListScreen';
import UserListScreen from './sections/adminscreens/userListScreen';
import UserEditScreen from './sections/adminscreens/userEditScreen';
import { AnimatePresence, motion } from 'motion/react';

function AnimatedRoutes() {
  const location = useLocation();

  const hideFooter =
    location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/product/:slug"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductScreen />
              </motion.div>
            }
          />
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Lobby />
              </motion.div>
            }
          />
          <Route
            path="/cart"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CartScreen />
              </motion.div>
            }
          />
          <Route
            path="/signin"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SigninScreen />
              </motion.div>
            }
          />
          <Route
            path="/shipping"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ShippingAddressScreen />
              </motion.div>
            }
          />
          <Route
            path="/signup"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupScreen />
              </motion.div>
            }
          />
          <Route
            path="/payment"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentMethodScreen />
              </motion.div>
            }
          />
          <Route
            path="/placeorder"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PlaceOrderScreen />
              </motion.div>
            }
          />
          <Route
            path="/order/:id"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              </motion.div>
            }
          />
          <Route
            path="/orderhistory"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              </motion.div>
            }
          />
          <Route
            path="/profile"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              </motion.div>
            }
          />
          <Route
            path="/search"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SearchScreen />
              </motion.div>
            }
          />
          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRoute>
                  <DashBoardScreen />
                </AdminRoute>
              </motion.div>
            }
          />
          <Route
            path="/admin/product/:id"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              </motion.div>
            }
          />
          <Route
            path="/admin/products"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              </motion.div>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              </motion.div>
            }
          />
          <Route
            path="/admin/users"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              </motion.div>
            }
          />
          <Route
            path="/admin/user/:id"
            element={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      {!hideFooter && (
        <footer className="py-3 absolute bottom-0 right-0 left-0">
          <p className="text-center">all rights reserved</p>
        </footer>
      )}
    </>
  );
}

export default AnimatedRoutes;
