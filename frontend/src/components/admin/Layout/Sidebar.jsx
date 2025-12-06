import { useNavigate, useLocation } from "react-router-dom";
import '../../../styles/components/admin/Layout/Sidebar.css'
import CompanyIcon from "../../../assets/images/admin/Sidebar/company.svg"

const AdminSidebar = ({ menuItems, onLogout, logo }) => {
  const { pathname } = useLocation();  // actual current route
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="logo-img"><img src={CompanyIcon} alt="M"/></div>
        <span className="logo-text">Muncheese</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.path;
          
          return (
            <a
              key={item.path}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <div className="sidebar-card">
                <span className="nav-icon sidebar-card-element">
                  <img width="50px" height="50px"src={Icon} alt=""/>
                </span>
                <span className="sidebar-card-element">{item.label}</span>
              </div>
            </a>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <span className="logout-icon">→</span>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar