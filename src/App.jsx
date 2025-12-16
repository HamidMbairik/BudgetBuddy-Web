import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import { SidebarProvider } from './contexts/SidebarContext'
import { PreferencesProvider } from './contexts/PreferencesContext'

const App = () => {
  return (
    <PreferencesProvider>
      <SidebarProvider>
        <div>
          <AppRoutes />
        </div>
      </SidebarProvider>
    </PreferencesProvider>
  )
}

export default App