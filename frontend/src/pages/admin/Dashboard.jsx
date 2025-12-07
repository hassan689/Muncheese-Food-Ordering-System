import { useMemo } from "react";
import AdminLayout from "../../layouts/admin/Layout";
import AdminStatCard from "../../components/admin/Dashboard/AdminStatCard";
import AdminOverviewChart from "../../components/admin/Dashboard/AdminOverviewChart";
import CashIcon from "../../assets/images/admin/Dashboard/cash.svg";
import RevenueIcon from "../../assets/images/admin/Dashboard/revenue.svg";
import "../../styles/pages/admin/Dashboard.css";

// importing data from generate file
import {
  generateYearDailyData,
  aggregateMonthly,
  aggregateWeekly,
} from "../../utils/generateData";

/*
format of data: (in increasing order of dates)
[
  {
      data: "2025-12-15",
      sales: 3000
  },
  {
      data: "2025-12-16",
      sales: 4000
  },
  {
      data: "2025-12-17",
      sales: 5000
  }
]
*/
function normalize(data) {
  const max = Math.max(...data);
  return data.map((v) => Math.round((v / max) * 100));
}

const AdminDashboard = () => {
  const initialDailyData = useMemo(
    () => generateYearDailyData({ year: 2025 }),
    []
  );

  const sortedDailyData = useMemo(() => {
    return [...initialDailyData].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }, [initialDailyData]);

  const dailyData = useMemo(() => {
    return sortedDailyData.slice(-30).map((d) => ({
      label: d.date,
      sales: d.sales,
    }));
  }, [sortedDailyData]);

  const weeklyData = useMemo(() => {
    return aggregateWeekly(sortedDailyData)
      .slice(-12)
      .map((w) => ({
        label: w.label,
        sales: w.sales,
      }));
  }, [sortedDailyData]);

  const monthlyData = useMemo(() => {
    return aggregateMonthly(sortedDailyData)
      .slice(-12)
      .map((m) => ({
        label: m.label,
        sales: m.sales,
      }));
  }, [sortedDailyData]);

  // last 12 days and last 12 weeks sales (raw numbers)
  const last12DaysSales = useMemo(
    () => sortedDailyData.slice(-12).map((d) => d.sales),
    [sortedDailyData]
  );

  const last12Weeks = useMemo(
    () =>
      aggregateWeekly(sortedDailyData)
        .slice(-12)
        .map((w) => w.sales),
    [sortedDailyData]
  );

  // today's sales and last week's revenue (raw numbers)
  const todaySales = useMemo(
    () => sortedDailyData[sortedDailyData.length - 1]?.sales || 0,
    [sortedDailyData]
  );

  const lastWeekRevenue = useMemo(
    () => last12Weeks[last12Weeks.length - 1] || 0,
    [last12Weeks]
  );

  // Normalized arrays for mini-charts (0..100)
  const normalizedLast12Days = useMemo(
    () => normalize(last12DaysSales),
    [last12DaysSales]
  );
  const normalizedLast12Weeks = useMemo(
    () => normalize(last12Weeks),
    [last12Weeks]
  );

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <div className="stats-grid">
          <AdminStatCard
            title="Daily Sales"
            value={todaySales}
            icon={CashIcon}
            chart={normalizedLast12Days}
          />
          <AdminStatCard
            title="Weekly Revenue"
            value={lastWeekRevenue}
            icon={RevenueIcon}
            chart={normalizedLast12Weeks}
          />
        </div>

        <AdminOverviewChart
          dailyData={dailyData}
          weeklyData={weeklyData}
          monthlyData={monthlyData}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
