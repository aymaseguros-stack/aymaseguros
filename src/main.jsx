import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Performance monitoring with Web Vitals
if (typeof window !== 'undefined' && 'performance' in window) {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const sendToAnalytics = (metric) => {
      console.log(metric)
      // Send to your analytics endpoint
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
    }
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  }).catch(() => {
    // web-vitals not available, continue without it
  })
}

// Lazy load pages for code splitting
const App = lazy(() => import('./App'))
const Admin = lazy(() => import('./pages/Admin'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      <p className="text-white mt-4 text-lg">Cargando...</p>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
