import { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../../store';
import { getError } from '../../utils';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, summary: action.payload, loading: false };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default function DashBoardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <div>
        <h1>داشبورد</h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
