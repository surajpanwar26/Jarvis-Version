import { useState } from 'react'
import './App.css'
import Chat from './pages/Chat'
import LandingPage from './pages/LandingPage'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  return (
    <div className="app">
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={setCurrentPage} />
      ) : (
        <Chat onNavigate={setCurrentPage} />
      )}
    </div>
  )
}

export default App
