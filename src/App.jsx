import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'

const App = () => {
  return (
    <div>
      {/* Render AppRoutes here to display pages based on URL */}
      <AppRoutes />
    </div>
  )
}

export default App