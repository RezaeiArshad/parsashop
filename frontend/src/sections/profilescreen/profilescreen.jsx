import { usePageTitle } from '../../hooks/usepagetitle';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.payload) {
    case 'UPDATE_REQUEST': {
      return { ...state, loadignUpdate: true };
    }
    case 'UPDATE_SUCCESS': {
      return { ...state, loadignUpdate: false };
    }
    case 'UPDATE_FAIL': {
      return { ...state, loadingUpdate: false };
    }
    default: {
      return state;
    }
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN' , payload: data});
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL ' });
      toast.error(getError(err));
    }
  };

  usePageTitle('Profile Page');
  return (
    <>
      <div>
        <div className="flex h-[92vh]">
          <div className="md:w-[50%] md:ms-[25%] lg:w-[40%] lg:ms-[30%]">
            <h1 className="w-fit ms-auto me-auto my-5 text-5xl">
              User Profile
            </h1>
            <form
              onSubmit={submitHandler}
              className="mt-3 border border-0.5 border-fg2 rounded-xl p-4"
            >
              <div className="name-div">
                <label className="text-2xl">Name</label>
                <input
                  className="h-8 w-[100%] border border-fg2 rounded-xl p-2"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="email-div">
                <label className="text-2xl">Email</label>
                <input
                  className="h-8 w-[100%] border border-fg2 rounded-xl p-2"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="password-div mt-3">
                <label className="text-2xl">Password</label>
                <input
                  className="h-8 w-[100%] border border-fg2 rounded-xl p-2"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="password-div mt-3">
                <label className="text-2xl">Confirm Password</label>
                <input
                  className="h-8 w-[100%] border border-fg2 rounded-xl p-2"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                className="mt-3 bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
