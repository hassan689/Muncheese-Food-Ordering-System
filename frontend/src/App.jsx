import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
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
import AdminDashboard from './pages/admin/AdminDashboard'
import Customers from './pages/admin/Customers'
import Reports from './pages/admin/Reports'
import ProtectedRoute from './components/common/ProtectedRoute'
import './styles/App.css'
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-confirmation-popup" element={<OrderConfirmationPopup />} />
          <Route path="/location-entry" element={<LocationEntry />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App