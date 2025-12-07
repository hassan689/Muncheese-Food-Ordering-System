import '../../../styles/components/admin/Layout/Header.css'

const AdminHeader = ({ title }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="back-btn">←</button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        <button className="notification-btn">🔔</button>

        <div className="profile-picture">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=fbbf24&color=000&bold=true"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader