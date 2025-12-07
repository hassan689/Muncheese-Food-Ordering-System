import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../layouts/admin/Layout";
import AdminStatCard from "../../components/admin/Dashboard/AdminStatCard";
import AdminOverviewChart from "../../components/admin/Dashboard/AdminOverviewChart";
import CashIcon from "../../assets/images/admin/Dashboard/cash.svg";
import RevenueIcon from "../../assets/images/admin/Dashboard/revenue.svg";
import { orderService } from "../../services/orderService";
import "../../styles/pages/admin/Dashboard.css";

function normalize(data) {
  if (!data || data.length === 0) return [];
  const max = Math.max(...data.filter(v => v > 0));
  if (max === 0) return data.map(() => 0);
  return data.map((v) => Math.round((v / max) * 100));
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await orderService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Process data for charts
  const dailyData = useMemo(() => {
    if (!stats?.daily_data) return [];
    return stats.daily_data.map((d) => ({
      label: d.date,
      sales: d.sales,
    }));
  }, [stats]);

  const weeklyData = useMemo(() => {
    if (!stats?.weekly_data) return [];
    return stats.weekly_data.map((w) => ({
      label: w.label,
      sales: w.sales,
    }));
  }, [stats]);

  const monthlyData = useMemo(() => {
    if (!stats?.monthly_data) return [];
    return stats.monthly_data.map((m) => ({
      label: m.label,
      sales: m.sales,
    }));
  }, [stats]);

  // Normalized arrays for mini-charts (0..100)
  const normalizedLast12Days = useMemo(
    () => normalize(stats?.last_12_days_sales || []),
    [stats]
  );
  const normalizedLast12Weeks = useMemo(
    () => normalize(stats?.last_12_weeks_sales || []),
    [stats]
  );

  const todaySales = stats?.today_sales || 0;
  const lastWeekRevenue = stats?.last_week_revenue || 0;

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="admin-dashboard">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="admin-dashboard">
          <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
            <p>Error loading dashboard: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
