import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.dataLayer for GTM
global.window.dataLayer = []

// Mock window.open
global.window.open = () => {}
