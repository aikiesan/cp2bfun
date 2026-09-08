import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { registerServiceWorker } from './registerServiceWorker'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

// Substitui o registerSW.js que o vite-plugin-pwa injetava sozinho: aquele só
// registrava o service worker e nunca recarregava a página.
registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
