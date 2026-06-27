import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import './App.css'

// Icons
import {
  MdLocalFlorist,
  MdChat,
  MdAgriculture,
  MdWaterDrop,
  MdDashboard,
  MdDarkMode,
  MdLightMode
} from 'react-icons/md'

// Pages
import Diagnosis from './pages/Diagnosis'
import Chat from './pages/Chat'
import Management from './pages/Management'
import Irrigation from './pages/Irrigation'
import Dashboard from './pages/Dashboard'

function App() {
  // Dark mode state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark'
  })

  // Apply theme class to body
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

        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
        >
          {isDark ? <MdLightMode /> : <MdDarkMode />}
        </button>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h2>🌿 Green Mind</h2>
            <p>نظام العناية الذكية بالنباتات</p>
          </div>

          <nav className="sidebar-nav">
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

          <div style={{ padding: '15px', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
            <small style={{ opacity: 0.7 }}>
              {user.isAdmin ? '👑 مدير' : '👤 مستخدم'}: {user.name}
            </small>
          </div>
        </aside>

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