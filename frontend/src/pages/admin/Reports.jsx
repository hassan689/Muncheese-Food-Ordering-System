import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/admin/Layout'
import DonutChart from '../../components/admin/Report/DonutChart'
import LineChart from '../../components/admin/Report/LineChart'
import OrdersTable from '../../components/admin/Report/OrdersTable'
import { orderService } from '../../services/orderService'
import jsPDF from 'jspdf'
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
  const [dailySales, setDailySales] = useState(0)
  const [weeklyRevenue, setWeeklyRevenue] = useState(0)
  
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
      setDailySales(data.dailySales || 0)
      setWeeklyRevenue(data.weeklyRevenue || 0)
      
    } catch (err) {
      setError(err.message || 'Failed to load report data')
      console.error('Error loading report data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle generate report button click
  const handleGenerateReport = async () => {
    await loadReportData()
    // Generate PDF after data is loaded
    generatePDF()
  }

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF()
    
    const acceptedCount = chartData?.accepted || 0
    const rejectedCount = chartData?.rejected || 0
    
    // Format dates
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    
    // PDF Styling
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20
    
    // Header
    doc.setFontSize(24)
    doc.setTextColor(3, 8, 31) // #03081f
    doc.setFont('helvetica', 'bold')
    doc.text('Muncheese Restaurant Report', pageWidth / 2, yPos, { align: 'center' })
    yPos += 10
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(`Report Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15
    
    // Summary Section
    doc.setFontSize(18)
    doc.setTextColor(3, 8, 31)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary', margin, yPos)
    yPos += 10
    
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    
    // Daily Sales
    doc.setFont('helvetica', 'bold')
    doc.text('Daily Sales:', margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`Rs. ${Math.round(dailySales).toLocaleString()}`, margin + 50, yPos)
    yPos += 8
    
    // Weekly Revenue
    doc.setFont('helvetica', 'bold')
    doc.text('Weekly Revenue:', margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`Rs. ${Math.round(weeklyRevenue).toLocaleString()}`, margin + 50, yPos)
    yPos += 8
    
    // Accepted Orders
    doc.setFont('helvetica', 'bold')
    doc.text('Accepted Orders:', margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${Math.round(acceptedCount)}`, margin + 50, yPos)
    yPos += 8
    
    // Rejected Orders
    doc.setFont('helvetica', 'bold')
    doc.text('Rejected Orders:', margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${Math.round(rejectedCount)}`, margin + 50, yPos)
    yPos += 15
    
    // Order Details Section
    if (orders && orders.length > 0) {
      doc.setFontSize(18)
      doc.setTextColor(3, 8, 31)
      doc.setFont('helvetica', 'bold')
      doc.text('Recent Orders', margin, yPos)
      yPos += 8
      
      // Table Header
      doc.setFontSize(10)
      doc.setFillColor(255, 184, 0) // #ffb800
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F')
      doc.setTextColor(3, 8, 31)
      doc.setFont('helvetica', 'bold')
      
      const colWidths = [30, 50, 40, 40, 30]
      const headers = ['ID', 'Customer', 'Phone', 'Date', 'Total']
      let xPos = margin + 5
      
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos)
        xPos += colWidths[i]
      })
      
      yPos += 8
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      
      // Table Rows (limit to 5 most recent)
      const displayOrders = orders.slice(0, 5)
      displayOrders.forEach((order, index) => {
        if (yPos > 270) { // New page if needed
          doc.addPage()
          yPos = 20
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245)
          doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F')
        }
        
        xPos = margin + 5
        doc.setFontSize(9)
        doc.text(order.id || 'N/A', xPos, yPos)
        xPos += colWidths[0]
        
        doc.text(order.customerName || 'Unknown', xPos, yPos)
        xPos += colWidths[1]
        
        doc.text(order.phone || 'N/A', xPos, yPos)
        xPos += colWidths[2]
        
        doc.text(order.orderDate || 'N/A', xPos, yPos)
        xPos += colWidths[3]
        
        doc.text(order.total || 'Rs. 0.00', xPos, yPos)
        
        yPos += 8
      })
    }
    
    // Footer
    const totalPages = doc.internal.pages.length - 1
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${totalPages} | Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }
    
    // Save PDF
    const fileName = `Muncheese_Report_${startDate}_to_${endDate}.pdf`
    doc.save(fileName)
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