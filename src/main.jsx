import React, { lazy, Suspense, memo } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Performance monitoring with Web Vitals
if (typeof window !== 'undefined' && 'performance' in window) {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, onINP }) => {
    const sendToAnalytics = (metric) => {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(metric)
      }

      // Send to Google Analytics in production
      if (window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Send to custom analytics endpoint if needed
      if (process.env.NODE_ENV === 'production') {
        navigator.sendBeacon?.('/api/analytics', JSON.stringify(metric))
      }
    }

    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
    onINP(sendToAnalytics) // Interaction to Next Paint
  }).catch(() => {
    // web-vitals not available, continue without it
  })
}

// Lazy load pages for code splitting with prefetching
const App = lazy(() => import(/* webpackChunkName: "app" */ './App'))
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ './pages/Admin'))

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      <p className="text-white mt-4 text-lg">Cargando...</p>
    </div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

// Preload admin route on hover
const prefetchAdmin = () => {
  import(/* webpackChunkName: "admin" */ './pages/Admin')
}

// Add global event listener for admin link hover
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const adminLinks = document.querySelectorAll('a[href*="/admin"]')
    adminLinks.forEach((link) => {
      link.addEventListener('mouseenter', prefetchAdmin, { once: true })
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
