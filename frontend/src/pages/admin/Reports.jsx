import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/admin/Layout'
import DonutChart from '../../components/admin/Report/DonutChart'
import LineChart from '../../components/admin/Report/LineChart'
import OrdersTable from '../../components/admin/Report/OrdersTable'
import '../../styles/pages/admin/Reports.css'

const fetchReportData = () => {
  return {
    chartData: {
      confirmed: 80,
      cancelled: 20
    },
    trendData: {
      confirmed: [
        { month: 'JAN', value: 3000 },
        { month: 'FEB', value: 3500 },
        { month: 'MAR', value: 4000 },
        { month: 'APR', value: 4500 },
        { month: 'MAY', value: 5000 },
        { month: 'JUN', value: 5200 },
        { month: 'JUL', value: 5400 },
        { month: 'AUG', value: 5600 },
        { month: 'SEP', value: 5800 },
        { month: 'OCT', value: 6000 },
        { month: 'NOV', value: 6200 },
        { month: 'DEC', value: 6500 }
      ],
      cancelled: [
        { month: 'JAN', value: 1500 },
        { month: 'FEB', value: 1600 },
        { month: 'MAR', value: 1400 },
        { month: 'APR', value: 1700 },
        { month: 'MAY', value: 1800 },
        { month: 'JUN', value: 1900 },
        { month: 'JUL', value: 2000 },
        { month: 'AUG', value: 1950 },
        { month: 'SEP', value: 2100 },
        { month: 'OCT', value: 2200 },
        { month: 'NOV', value: 2300 },
        { month: 'DEC', value: 2400 }
      ]
    },
    orders: [
      {
        id: '#12354564',
        customerName: 'Watson Joyce',
        phone: '+1 (123) 123 4654',
        orderDate: '28. 03. 2024',
        total: '$250.00'
      },
      {
        id: '#12354565',
        customerName: 'Sarah Johnson',
        phone: '+1 (123) 456 7890',
        orderDate: '29. 03. 2024',
        total: '$180.00'
      },
      {
        id: '#12354566',
        customerName: 'Michael Brown',
        phone: '+1 (123) 987 6543',
        orderDate: '30. 03. 2024',
        total: '$320.00'
      },
      {
        id: '#12354567',
        customerName: 'Emily Davis',
        phone: '+1 (123) 111 2222',
        orderDate: '31. 03. 2024',
        total: '$275.00'
      },
      {
        id: '#12354568',
        customerName: 'David Wilson',
        phone: '+1 (123) 333 4444',
        orderDate: '01. 04. 2024',
        total: '$195.00'
      }
    ]
  };
};

const Reports = () => {
  // UI State
  const [activeTab, setActiveTab] = useState('Confirmed')
  const [startDate, setStartDate] = useState('2024-04-01')
  const [endDate, setEndDate] = useState('2024-04-08')
  
  // Data State
  const [chartData, setChartData] = useState(null)
  const [trendData, setTrendData] = useState(null)
  const [orders, setOrders] = useState([])
  
  // Loading and Error State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch initial data on component mount
  useEffect(() => {
    loadReportData()
  }, []) // Empty array = runs once on mount

  // Function to load all report data
  const loadReportData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch data from API (or use dummy data for now)
      const data = await fetchReportData();
      
      // Update all states with fetched data
      setChartData(data.chartData)
      setTrendData(data.trendData)
      setOrders(data.orders)
      
    } catch (err) {
      setError(err.message)
      console.error('Error loading report data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle generate report button click
  const handleGenerateReport = () => {
    loadReportData()
  }

  // Handle tab change for trend chart
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  if (loading) {
    return (
      <AdminLayout title="Reports">
        <div className="reports-loading">
          <p>Loading reports...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Reports">
        <div className="reports-error">
          <p>Error loading reports: {error}</p>
          <button onClick={loadReportData}>Retry</button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Reports">
      <div className="reports-page">
        {/* Controls Section */}
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
            <button 
              className="generate-report-btn"
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Donut Chart */}
          <DonutChart data={chartData} />
          
          {/* Line Chart */}
          <LineChart 
            data={trendData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Orders Table */}
        <OrdersTable orders={orders} />
      </div>
    </AdminLayout>
  )
}

export default Reports