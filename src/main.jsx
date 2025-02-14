import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './landing/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage/>
  </StrictMode>,
)
