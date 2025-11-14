import { useContext, useEffect, useState } from 'react';
import { usePageTitle } from '../../hooks/usepagetitle';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import CheckoutSteps from '../../components/checkoutsteps';

export default function ShippingAddressScreen() {
  usePageTitle('Shipping Address');
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <div className="xl:w-[40%] xl:ms-[30%] md:w-[50%] md:ms-[25%]">
        <h1 className="text-4xl my-3">Shipping Address</h1>
        <form
          onSubmit={submitHandler}
          className="mt-7 border border-0.5 border-fg2 rounded-xl p-4"
        >
          <div className="email-div">
            <label className="text-2xl">Full Name</label>
            <input
              className="h-8 w-[100%] border border-fg2 rounded-xl p-2 mt-1"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="password-div mt-3">
            <label className="text-2xl">City</label>
            <input
              className="h-8 w-[100%] border border-fg2 rounded-xl p-2 mt-1"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="password-div mt-3">
            <label className="text-2xl">Address</label>
            <input
              className="h-8 w-[100%] border border-fg2 rounded-xl p-2 mt-1"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="password-div mt-3">
            <label className="text-2xl">Postal code</label>
            <input
              className="h-8 w-[100%] border border-fg2 rounded-xl p-2 mt-1"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="password-div mt-3">
            <label className="text-2xl">Country</label>
            <input
              className="h-8 w-[100%] border border-fg2 rounded-xl p-2 mt-1"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <button
            className="mt-3 bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </>
  );
}
