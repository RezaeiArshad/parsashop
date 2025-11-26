import { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../../store';
import { getError } from '../../utils';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';
import { usePageTitle } from '../../hooks/usepagetitle';

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
          dispatch({ type: 'FETCH_SUCCESS', payload: data})        
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  usePageTitle('Dashboard');
  
  return (
    <>
      <div>
        <h1>داشبورد</h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <>
            <div>
              <h1>تعداد کاربرها</h1>
              {summary.users && summary.users[0]
                ? summary.users[0].numUsers
                : 0}
            </div>
            <div>
              <h1>تعداد سفارش ها</h1>
              {summary.orders && summary.orders[0]
                ? summary.orders[0].numOrders
                : 0}
            </div>
            <div>
              <h1>حجم درآمد</h1>
              {summary.orders && summary.users[0]
                ? summary.orders[0].totalSales.toFixed(2)
                : 0}
            </div>
            <div>
            <h1>فروش ها</h1>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>موردی یافت نشد</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="80rem"
                chartType="AreaChart"
                loader={<div>در حال بارگذاری...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
            </div>
            <div>
              <h2>دسته بندی ها</h2>
              {summary.productCategories.length === 0 ? (
                <MessageBox>موردی یافت نشد</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="80rem"
                  chartType="PieChart"
                  loader={<div>در حال بارگذاری...</div>}
                  data={[
                    ['Category', 'Products'],
                    ...summary.productCategories.map((x) => [x._id, x.count]),
                  ]}
                ></Chart>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
