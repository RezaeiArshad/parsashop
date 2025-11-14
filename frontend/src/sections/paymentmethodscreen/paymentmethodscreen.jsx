import { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../../components/checkoutsteps';
import { usePageTitle } from '../../hooks/usepagetitle';
import { Store } from '../../store';
import { useNavigate } from 'react-router-dom';
import PriceComma from '../../hooks/pricecomma';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod, cartItems },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'ZarinPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  usePageTitle('Payment Method');

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="text-4xl mt-3 text-center">Payment Method</h1>
      <div className="mt-5 flex w-fit gap-5 mx-auto">
        <form
          className="flex-1 border-1 border-fg2 p-5 rounded-xl"
          onSubmit={submitHandler}
        >
          <h1 className="text-2xl">Choose your payment method</h1>
          <div className='mt-2'>
            <input
              type="radio"
              id="ZarinPal"
              name="ZarinPal"
              value="ZarinPal"
              checked={paymentMethodName === 'ZarinPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="ZarinPal"> ZarinPal</label>
          </div>
          <div>
            <input
              type="radio"
              id="Pal"
              name="Pal"
              value="Pal"
              checked={paymentMethodName === 'Pal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="Pal"> Pal</label>
          </div>
          <button
            className="mt-3 bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
            type="submit"
          >
            Continue
          </button>
        </form>
        <div className='text-2xl pt-5'>
          Total price :{' '}
          <PriceComma
            value={cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
          />{' '}Toman
        </div>
      </div>
    </>
  );
}
