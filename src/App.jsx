import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import './App.css'

import {
  MdLocalFlorist,
  MdChat,
  MdAgriculture,
  MdWaterDrop,
  MdDashboard,
  MdDarkMode,
  MdLightMode,
  MdMenu,
  MdClose
} from 'react-icons/md'

import Diagnosis from './pages/Diagnosis'
import Chat from './pages/Chat'
import Management from './pages/Management'
import Irrigation from './pages/Irrigation'
import Dashboard from './pages/Dashboard'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  const user = {
    name: 'مدير النظام',
    isAdmin: true
  }

  const menuItems = [
    { path: '/', icon: <MdLocalFlorist />, label: 'تشخيص الأمراض', show: true },
    { path: '/chat', icon: <MdChat />, label: 'الخبير الزراعي', show: true },
    { path: '/management', icon: <MdAgriculture />, label: 'إدارة الدفعات', show: user.isAdmin },
    { path: '/irrigation', icon: <MdWaterDrop />, label: 'جدولة الري', show: true },
    { path: '/dashboard', icon: <MdDashboard />, label: 'لوحة التحكم', show: user.isAdmin },
  ]

  return (
    <BrowserRouter>
      <div className="app">
        <Toaster position="top-center" />

        {/* Desktop Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
        >
          {isDark ? <MdLightMode /> : <MdDarkMode />}
        </button>

        {/* Mobile Header Bar */}
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MdMenu />
          </button>

          <span className="mobile-title">Green Mind</span>

          <button className="mobile-theme-btn" onClick={toggleTheme}>
            {isDark ? <MdLightMode /> : <MdDarkMode />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Close button inside sidebar - always clickable */}
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdClose />
          </button>

          <div className="sidebar-logo">
            <img
              src={isDark ? '/logo-white.svg' : '/logo-dark.svg'}
              alt="Green Mind Logo"
            />
            <h2>Green Mind</h2>
            <p>نظام العناية الذكية بالنباتات</p>
          </div>

          <nav className="sidebar-nav" onClick={() => setMobileMenuOpen(false)}>
            {menuItems.filter(item => item.show).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <small>
              {user.isAdmin ? '👑 مدير' : '👤 مستخدم'}: {user.name}
            </small>
          </div>
        </aside>

        {/* Sidebar Overlay */}
        <div
          className={`sidebar-overlay ${mobileMenuOpen ? 'show' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Diagnosis />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/management" element={<Management />} />
              <Route path="/irrigation" element={<Irrigation />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App