import { useState } from 'react'
import './Header.css'

function Header({ onNavigate }) {
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    document.body.style.background = isDarkTheme ? '#ffffff' : '#0a0a0a'
    document.body.style.color = isDarkTheme ? '#000000' : '#ffffff'
  }

  return (
    <div className="header">
      <div className="header-left">
        <button className="back-button" onClick={() => onNavigate('landing')}>
          ← Back
        </button>
        <h1 className="title">JARVIS 2.0</h1>
      </div>

      <div className="header-right">
        <div className="status-indicator">
          <div className="status-dot active"></div>
          <span className="status-text">Online</span>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          <div className="lamp-container">
            <span className="lamp-icon">
              {isDarkTheme ? '☀️' : '🌙'}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Header
