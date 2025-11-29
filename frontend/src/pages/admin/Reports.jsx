import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/pages/admin/Reports.css'

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Confirmed')
  const [startDate, setStartDate] = useState('2024-04-01')
  const [endDate, setEndDate] = useState('2024-04-08')

  const reservations = [
    {
      id: '#12354564',
      customerName: 'Watson Joyce',
      phone: '+1 (123) 123 4654',
      reservationDate: '28. 03. 2024',
      checkIn: '03:18 PM',
      checkOut: '05:00 PM',
      total: '$250.00'
    },
    {
      id: '#12354564',
      customerName: 'Watson Joyce',
      phone: '+1 (123) 123 4654',
      reservationDate: '28. 03. 2024',
      checkIn: '03:18 PM',
      checkOut: '05:00 PM',
      total: '$250.00'
    },
    {
      id: '#12354564',
      customerName: 'Watson Joyce',
      phone: '+1 (123) 123 4654',
      reservationDate: '28. 03. 2024',
      checkIn: '03:18 PM',
      checkOut: '05:00 PM',
      total: '$250.00'
    },
    {
      id: '#12354564',
      customerName: 'Watson Joyce',
      phone: '+1 (123) 123 4654',
      reservationDate: '28. 03. 2024',
      checkIn: '03:18 PM',
      checkOut: '05:00 PM',
      total: '$250.00'
    },
    {
      id: '#12354564',
      customerName: 'Watson Joyce',
      phone: '+1 (123) 123 4654',
      reservationDate: '28. 03. 2024',
      checkIn: '03:18 PM',
      checkOut: '05:00 PM',
      total: '$250.00'
    }
  ]

  const chartData = {
    confirmed: 80,
    awaited: 50,
    cancelled: 30,
    failed: 32
  }

  const total = chartData.confirmed + chartData.awaited + chartData.cancelled + chartData.failed

  return (
    <AdminLayout title="Reports">
      <div className="reports-page">
        <div className="reports-controls">
          <button className="revenue-report-btn">Revenue Report</button>
          <div className="date-range-selector">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <span className="date-separator">—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
            <button className="generate-report-btn">Generate Report</button>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card reservation-chart">
            <h3 className="chart-title">Total Reservation</h3>
            <div className="donut-chart-container">
              <div className="donut-chart">
                <svg viewBox="0 0 120 120" className="donut-svg">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#f5f5dc"
                    strokeWidth="20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#d4a574"
                    strokeWidth="20"
                    strokeDasharray={`${(chartData.awaited / total) * 314} 314`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#ffb800"
                    strokeWidth="20"
                    strokeDasharray={`${(chartData.cancelled / total) * 314} 314`}
                    strokeDashoffset={`-${(chartData.awaited / total) * 314}`}
                    transform="rotate(-90 60 60)"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#ff9800"
                    strokeWidth="20"
                    strokeDasharray={`${(chartData.failed / total) * 314} 314`}
                    strokeDashoffset={`-${((chartData.awaited + chartData.cancelled) / total) * 314}`}
                    transform="rotate(-90 60 60)"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#333"
                    strokeWidth="20"
                    strokeDasharray={`${(chartData.confirmed / total) * 314} 314`}
                    strokeDashoffset={`-${((chartData.awaited + chartData.cancelled + chartData.failed) / total) * 314}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="donut-center">
                  <span className="donut-total">Total</span>
                  <span className="donut-value">{total}</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#f5f5dc' }}></span>
                  <span>Confirmed</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#d4a574' }}></span>
                  <span>Awaited</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#ffb800' }}></span>
                  <span>Cancelled</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#ff9800' }}></span>
                  <span>Failed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card trend-chart">
            <div className="chart-tabs">
              {['Confirmed', 'Awaited', 'Cancelled', 'Failed'].map((tab) => (
                <button
                  key={tab}
                  className={`chart-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="line-chart-container">
              <svg viewBox="0 0 400 200" className="line-chart-svg">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffb800" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ffb800" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className="chart-grid">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={160 - i * 30}
                      x2="380"
                      y2={160 - i * 30}
                      stroke="#e0e0e0"
                      strokeWidth="1"
                    />
                  ))}
                </g>
                <g className="chart-labels">
                  {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, i) => (
                    <text
                      key={month}
                      x={40 + i * 30}
                      y={190}
                      fontSize="10"
                      fill="#666"
                      textAnchor="middle"
                    >
                      {month}
                    </text>
                  ))}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <text
                      key={i}
                      x="20"
                      y={165 - i * 30}
                      fontSize="10"
                      fill="#666"
                      textAnchor="end"
                    >
                      {i}k
                    </text>
                  ))}
                </g>
                <path
                  d="M 40 130 L 70 120 L 100 110 L 130 100 L 160 90 L 190 85 L 220 80 L 250 75 L 280 70 L 310 65 L 340 60 L 370 55"
                  fill="none"
                  stroke="#ffb800"
                  strokeWidth="2"
                />
                <path
                  d="M 40 130 L 70 120 L 100 110 L 130 100 L 160 90 L 190 85 L 220 80 L 250 75 L 280 70 L 310 65 L 340 60 L 370 55 L 370 160 L 40 160 Z"
                  fill="url(#areaGradient)"
                />
                <circle cx="280" cy="70" r="4" fill="#ffb800" />
              </svg>
            </div>
          </div>
        </div>

        <div className="reservations-table-card">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Customer Name</th>
                <th>Phone number</th>
                <th>Reservation Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td>{reservation.id}</td>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.phone}</td>
                  <td>{reservation.reservationDate}</td>
                  <td>{reservation.checkIn}</td>
                  <td>{reservation.checkOut}</td>
                  <td>{reservation.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Reports

