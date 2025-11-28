import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Lobby from './sections/lobby/lobby';
import Header from './sections/header/header';
import ProductScreen from './sections/productscreen/productscreen';
import CartScreen from './sections/cartscreen/cartscreen';
import SigninScreen from './sections/signinscreen/signinscreen';
import { ToastContainer } from 'react-toastify';
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
import MessageToast from './components/messageToast';

function App() {
  return (
    <div id="theme-div" className="overflow-x-hidden" dir="rtl">
      <link
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="text-fg bg-bg dark:bg-bg-d dark:text-fg-d relative pb-15 transition-colors duration-300">
        <BrowserRouter>
          <ToastContainer position="bottom-center" limit={1} />
          <Header />
          <div>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<Lobby />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />
              {/* these are the admin routes */}

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashBoardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
          <MessageToast />
          <footer className="py-3 absolute bottom-0 right-0 left-0">
            <p className="text-center">all rights reserved</p>
          </footer>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
