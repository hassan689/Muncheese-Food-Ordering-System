import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/admin/Layout'
import DonutChart from '../../components/admin/Report/DonutChart'
import LineChart from '../../components/admin/Report/LineChart'
import OrdersTable from '../../components/admin/Report/OrdersTable'
import { orderService } from '../../services/orderService'
import '../../styles/pages/admin/Reports.css'

const Reports = () => {
  // UI State - Set default date range to last 12 months
  const getDefaultStartDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 12)
    return date.toISOString().split('T')[0]
  }
  
  const getDefaultEndDate = () => {
    return new Date().toISOString().split('T')[0]
  }
  
  const [activeTab, setActiveTab] = useState('Accepted')
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [endDate, setEndDate] = useState(getDefaultEndDate())
  
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
      
      // Fetch data from API
      const data = await orderService.getReportsData(startDate, endDate);
      
      // Update all states with fetched data
      setChartData(data.chartData || { accepted: 0, rejected: 0 })
      setTrendData(data.trendData || { accepted: [], rejected: [] })
      setOrders(data.orders || [])
      
    } catch (err) {
      setError(err.message || 'Failed to load report data')
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