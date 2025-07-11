import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fanta.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  // 11
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
    
  </StrictMode>,
)
