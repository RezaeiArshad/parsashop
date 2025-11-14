import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Lobby from './sections/lobby/lobby';
import Header from './sections/header/header';
import ProductScreen from './sections/productscreen/productscreen';
import CartScreen from './sections/cartscreen/cartscreen';
import SigninScreen from './sections/signinscreen/signinscreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ShippingAddressScreen from './sections/shippingaddressscreen/shippingaddressscreen';
import SignupScreen from './sections/signupscreen/signupscreen';
import PaymentMethodScreen from './sections/paymentmethodscreen/paymentmethodscreen';
import PlaceOrderScreen from './sections/placeorderscreen/placeorderscreen';
import OrderScreen from './sections/orderscreen/orderscreen';
import OrderHistoryScreen from './sections/orderhistory/orderhistory';
import ProfileScreen from './sections/profilescreen/profilescreen';


function App() {
  return (
    <div className=''>
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
              <Route path='/signup' element={<SignupScreen />} />
              <Route path='/payment' element={<PaymentMethodScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/order/:id' element={<OrderScreen />} />
              <Route path='/orderhistory' element={<OrderHistoryScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
            </Routes>
          </div>
          <footer className="py-3 absolute bottom-0 right-0 left-0">
            <p className="text-center">all rights reserved</p>
          </footer>
        </BrowserRouter>
      </div>      
    </div>
  );
}

export default App;
