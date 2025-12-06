import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import AdminLayout from './layouts/admin/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Menu from './pages/Menu'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderConfirmationPopup from './pages/OrderConfirmationPopup'
import LocationEntry from './pages/LocationEntry'
import OrderTracking from './pages/OrderTracking'
import Contact from './pages/Contact'
import Feedback from './pages/Feedback'
import TestPage from './pages/TestPage'
import AdminDashboard from './pages/admin/Dashboard'
import AdminMenu from './pages/admin/Menu'
import AdminOrders from './pages/admin/Orders'
import AdminReports from './pages/admin/Reports'
import ProtectedRoute from './components/common/ProtectedRoute'
import './styles/App.css'
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages with Main Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/location-entry" element={<LocationEntry />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>

        {/* Admin Pages with Admin Layout */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reports" element={<AdminReports />} />
      </Routes>
    </Router>
  )
}

export default App