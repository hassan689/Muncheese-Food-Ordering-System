import AdminSidebar from "../../components/admin/Layout/Sidebar"
import AdminHeader from "../../components/admin/Layout/Header"
import DashboardIcon from "../../assets/images/admin/Sidebar/dashboard.svg"
import MenuIcon from "../../assets/images/admin/Sidebar/menu.svg"
import OrdersIcon from "../../assets/images/admin/Sidebar/orders.svg"
import ReportsIcon from "../../assets/images/admin/Sidebar/reports.svg"
import "../../styles/layouts/admin/Layout.css"

const AdminLayout = ({ children, title }) => {
  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: DashboardIcon },
    { path: "/admin/menu", label: "Menu", icon: MenuIcon },
    { path: "/admin/orders", label: "Orders", icon: OrdersIcon },
    { path: "/admin/reports", label: "Reports", icon: ReportsIcon }
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        menuItems={menuItems} 
        onLogout={handleLogout} 
        logo="weblogo" 
      />

      <div className="admin-main">
        <AdminHeader title={title} />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout