import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedInventory } from './seedFirebase.ts'

// Seed Firebase on first load (only run once manually)
if (window.location.search.includes('seed=true')) {
  seedInventory();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
