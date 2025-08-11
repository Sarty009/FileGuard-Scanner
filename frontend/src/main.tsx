import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import HashRouter instead of BrowserRouter
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // By removing React.StrictMode, we can avoid potential issues it might cause
  // in the specific context of an Electron application.
  <HashRouter>
    <App />
  </HashRouter>
)
