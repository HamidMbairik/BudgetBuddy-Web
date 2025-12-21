import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { SidebarProvider } from './contexts/SidebarContext'
import { PreferencesProvider } from './contexts/PreferencesContext'

const App = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <SidebarProvider>
          <div>
            <AppRoutes />
          </div>
        </SidebarProvider>
      </PreferencesProvider>
    </AuthProvider>
  )
}

export default App