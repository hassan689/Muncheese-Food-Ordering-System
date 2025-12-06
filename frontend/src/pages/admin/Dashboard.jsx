import AdminLayout from "../../layouts/admin/Layout"
import AdminStatCard from "../../components/admin/Dashboard/StatCard"
import AdminOverviewChart from "../../components/admin/Dashboard/OverviewChart"

// importing svgs 
import CashIcon from "../../assets/images/admin/Dashboard/cash.svg";
import RevenueIcon from "../../assets/images/admin/Dashboard/revenue.svg";
import TableIcon from "../../assets/images/admin/Dashboard/table.svg";

import "../../styles/pages/admin/Dashboard.css"

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <div className="stats-grid">
          <AdminStatCard
            title="Daily Sales"
            value="$2k"
            icon={CashIcon}
            trend="up"
            trendValue="+12.5%"
            chart={[45, 65, 55, 70, 60, 75, 85, 70, 80, 75, 90, 85]}
          />
          <AdminStatCard
            title="Monthly Revenue"
            value="$55k"
            icon={RevenueIcon}
            trend="up"
            trendValue="+8.2%"
            chart={[60, 75, 70, 85, 80, 90, 85, 95, 88, 92, 85, 90]}
          />
          <AdminStatCard
            title="Table Occupancy"
            value="25 Tables"
            icon={TableIcon}
            trend="up"
            trendValue="+5.4%"
            chart={[70, 80, 75, 85, 78, 90, 85, 92, 88, 95, 90, 94]}
          />
        </div>

        <AdminOverviewChart />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard