import { usePageTitle } from '../../hooks/usepagetitle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { Store } from '../../store';
import { useEffect } from 'react';
import {toast} from 'react-toastify'
import { getError } from '../../utils';


export default function SigninScreen() {
  const navigate = useNavigate()
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
       toast.error(getError(err))
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo])

  usePageTitle('Sing In');
  return (
    <>
      <div className="flex h-[92vh]">
        <div className="md:w-[50%] md:ms-[25%] lg:w-[40%] lg:ms-[30%]">
          <h1 className="w-fit ms-auto me-auto my-5 text-5xl">
            Sing In
          </h1>
          <form onSubmit={submitHandler} className="mt-3 border border-0.5 border-fg2 rounded-xl p-4">
            <div className="email-div">
              <label className="text-2xl">Email</label>
              <input
                className="h-8 w-[100%] border border-fg2 rounded-xl p-2"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password-div mt-3">
              <label className="text-2xl">Password</label>
              <input
                className="h-8 w-[100%] border border-fg2 rounded-xl p-2"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="mt-3 bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer" type="submit">
              Sign in
            </button>
            <div className='mt-2'>
              New Customer?{' '}
              <Link
                className='text-high hover:text-blue-800 transition-colors duration-300'
                to={`/signup?redirect=${redirect}`}>
                {' '}
                Create your account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
