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
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  usePageTitle('داشبورد');

  // helpers
  const fmtNum = (n) =>
    typeof n === 'number' ? n.toLocaleString() : n ? String(n) : '0';
  const fmtMoney = (n) =>
    typeof n === 'number'
      ? n.toLocaleString() + ' تومان'
      : n
      ? String(n)
      : '0 تومان';

  const usersCount = summary?.users?.[0]?.numUsers ?? 0;
  const ordersCount = summary?.orders?.[0]?.numOrders ?? 0;
  const totalSales = summary?.orders?.[0]?.totalSales ?? 0;
  const dailyOrders = summary?.dailyOrders ?? [];
  const categories = summary?.productCategories ?? [];

  return (
    <>
      <div className="w-[90%] ms-[5%] mt-[2vh]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">داشبورد</h1>
          <span className="text-sm text-gray-600">
            {fmtNum(usersCount)} کاربر
          </span>
        </div>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-white border rounded shadow-sm">
                <div className="text-sm text-gray-500">تعداد کاربران</div>
                <div className="text-2xl font-bold mt-2">
                  {fmtNum(usersCount)}
                </div>
              </div>
              <div className="p-4 bg-white border rounded shadow-sm">
                <div className="text-sm text-gray-500">تعداد سفارش‌ها</div>
                <div className="text-2xl font-bold mt-2">
                  {fmtNum(ordersCount)}
                </div>
              </div>
              <div className="p-4 bg-white border rounded shadow-sm">
                <div className="text-sm text-gray-500">حجم درآمد</div>
                <div className="text-2xl font-bold mt-2">
                  {fmtMoney(Number(totalSales) || 0)}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded p-4">
                <h2 className="text-lg font-medium mb-3">فروش روزانه</h2>
                {dailyOrders.length === 0 ? (
                  <MessageBox>موردی یافت نشد</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="300px"
                    chartType="AreaChart"
                    loader={<div>در حال بارگذاری...</div>}
                    data={[
                      ['تاریخ', 'فروش'],
                      ...dailyOrders.map((x) => [x._id, x.sales]),
                    ]}
                    options={{
                      hAxis: { title: 'روز' },
                      vAxis: { title: 'فروش (تومان)' },
                      legend: { position: 'none' },
                      areaOpacity: 0.2,
                    }}
                  />
                )}
              </div>

              <div className="bg-white border rounded p-4">
                <h2 className="text-lg font-medium mb-3">دسته‌بندی محصولات</h2>
                {categories.length === 0 ? (
                  <MessageBox>موردی یافت نشد</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="300px"
                    chartType="PieChart"
                    loader={<div>در حال بارگذاری...</div>}
                    data={[
                      ['دسته', 'تعداد'],
                      ...categories.map((x) => [x._id, x.count]),
                    ]}
                    options={{
                      legend: {
                        position: 'right',
                        textStyle: { fontSize: 12 },
                      },
                      pieHole: 0.3,
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
