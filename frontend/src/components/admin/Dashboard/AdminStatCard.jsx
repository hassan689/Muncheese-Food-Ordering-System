import Card from "../../ui/Card"
import {ADMIN_COLORS} from "../../../utils/constants"
import "../../../styles/components/admin/Dashboard/AdminStatCard.css"

const AdminStatCard = ({
  title,
  value,
  icon,
  chart,
  color = ADMIN_COLORS.Secondary,
}) => {
  return (
    <Card className="stat-card">
      <div className="stat-header">
        <div className="stat-info">
          <h3>{title}</h3>
          <div className="stat-value">Rs. {value}</div>
        </div>

        <div>
          <img src={icon} alt="" className={`stat-icon ${color}`} />
        </div>
      </div>

      {chart && (
        <div className="mini-chart">
          {chart.map((height, i) => (
            <div
              key={i}
              className="chart-bar"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

export default AdminStatCard
