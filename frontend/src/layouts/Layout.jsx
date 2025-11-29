import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import '../styles/layouts/Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

