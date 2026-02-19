import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuraWater from './AuraWater.tsx'
// import LandingPage from './LandingPage.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuraWater />
  </StrictMode>,
)
