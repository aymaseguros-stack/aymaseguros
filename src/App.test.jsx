import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    global.window.dataLayer = []
    global.window.open = vi.fn()
  })

  describe('Rendering', () => {
    it('renders the main heading', () => {
      render(<App />)
      expect(screen.getByRole('heading', { name: /Seguros de Auto, Hogar y Vida en Rosario/i })).toBeInTheDocument()
    })

    it('renders the logo', () => {
      render(<App />)
      expect(screen.getByLabelText(/Ayma Advisors Logo/i)).toBeInTheDocument()
    })

    it('renders the benefits section', () => {
      render(<App />)
      expect(screen.getByText(/¿Por qué elegir Ayma Advisors?/i)).toBeInTheDocument()
      expect(screen.getByText(/Comparamos por vos/i)).toBeInTheDocument()
      expect(screen.getByText(/17 años de experiencia/i)).toBeInTheDocument()
      expect(screen.getByText(/Asesoramiento personalizado/i)).toBeInTheDocument()
    })

    it('renders all service cards', () => {
      render(<App />)
      expect(screen.getByRole('heading', { name: /^Vehículos$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Hogar$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Vida y Salud$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Empresas$/i })).toBeInTheDocument()
    })

    it('renders insurance companies section', () => {
      render(<App />)
      expect(screen.getByText(/Trabajamos con las mejores aseguradoras/i)).toBeInTheDocument()
      expect(screen.getByText(/San Cristóbal/i)).toBeInTheDocument()
      expect(screen.getByText(/Nación Seguros/i)).toBeInTheDocument()
      expect(screen.getByText(/Mapfre/i)).toBeInTheDocument()
      expect(screen.getByText(/SMG Seguros/i)).toBeInTheDocument()
    })

    it('renders footer with company information', () => {
      render(<App />)
      expect(screen.getByText(/Gestores de Riesgos desde 2008/i)).toBeInTheDocument()
      expect(screen.getByText(/PAS 68323/i)).toBeInTheDocument()
    })
  })

  describe('WhatsApp Functionality', () => {
    it('renders WhatsApp CTA buttons', () => {
      render(<App />)
      const whatsappButtons = screen.getAllByRole('button', { name: /Cotizar/i })
      expect(whatsappButtons.length).toBeGreaterThan(0)
    })

    it('opens WhatsApp with correct URL when hero button is clicked', () => {
      render(<App />)
      const heroButton = screen.getByRole('button', { name: /Cotizar Gratis Ahora/i })

      fireEvent.click(heroButton)

      expect(global.window.open).toHaveBeenCalled()
      expect(global.window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/5493416952259'),
        '_blank'
      )

      const callArgs = global.window.open.mock.calls[0][0]
      expect(callArgs).toContain('wa.me')
      expect(callArgs).toContain('5493416952259')
    })

    it('tracks GTM event when WhatsApp button is clicked', () => {
      render(<App />)
      const heroButton = screen.getByRole('button', { name: /Cotizar Gratis Ahora/i })

      fireEvent.click(heroButton)

      expect(global.window.dataLayer).toContainEqual({
        event: 'whatsapp_click',
        button_location: 'hero_cta'
      })
    })

    it('has correct data-gtm attributes on hero button', () => {
      render(<App />)
      const heroButton = screen.getByRole('button', { name: /Cotizar Gratis Ahora/i })

      expect(heroButton).toHaveAttribute('data-gtm-event', 'whatsapp_click')
      expect(heroButton).toHaveAttribute('data-gtm-location', 'hero')
    })

    it('has correct data-gtm attributes on CTA button', () => {
      render(<App />)
      const ctaButton = screen.getByRole('button', { name: /Cotizar Gratis por WhatsApp/i })

      expect(ctaButton).toHaveAttribute('data-gtm-event', 'whatsapp_click')
      expect(ctaButton).toHaveAttribute('data-gtm-location', 'cta')
    })
  })

  describe('Phone Links', () => {
    it('renders phone links with correct href', () => {
      render(<App />)
      const phoneLinks = screen.getAllByRole('link', { name: /341 695-2259/i })

      phoneLinks.forEach(link => {
        expect(link).toHaveAttribute('href', 'tel:+5493416952259')
      })
    })

    it('has correct data-gtm attributes on phone links', () => {
      render(<App />)
      const phoneLinks = screen.getAllByRole('link', { name: /341 695-2259/i })

      phoneLinks.forEach(link => {
        expect(link).toHaveAttribute('data-gtm-event', 'phone_click')
      })
    })

    it('renders at least 3 phone links (hero, cta, footer)', () => {
      render(<App />)
      const phoneLinks = screen.getAllByRole('link', { name: /341 695-2259/i })

      expect(phoneLinks.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for logo', () => {
      render(<App />)
      expect(screen.getByLabelText(/Ayma Advisors Logo/i)).toBeInTheDocument()
    })

    it('has proper role for header', () => {
      render(<App />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('has proper role for footer', () => {
      render(<App />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('has proper section headings with IDs', () => {
      render(<App />)
      expect(screen.getByRole('heading', { name: /¿Por qué elegir Ayma Advisors?/i })).toHaveAttribute('id', 'benefits-heading')
      expect(screen.getByRole('heading', { name: /Nuestros Servicios/i })).toHaveAttribute('id', 'services-heading')
      expect(screen.getByRole('heading', { name: /¿Listo para ahorrar en tu seguro?/i })).toHaveAttribute('id', 'cta-heading')
    })
  })

  describe('Content', () => {
    it('displays the correct company phone number', () => {
      render(<App />)
      expect(screen.getAllByText(/341 695-2259/i).length).toBeGreaterThan(0)
    })

    it('displays free quote message', () => {
      render(<App />)
      expect(screen.getByText(/Cotización GRATIS en 2 minutos/i)).toBeInTheDocument()
    })

    it('displays CTA section with call to action', () => {
      render(<App />)
      expect(screen.getByText(/¿Listo para ahorrar en tu seguro?/i)).toBeInTheDocument()
      expect(screen.getByText(/Recibí las mejores cotizaciones en minutos/i)).toBeInTheDocument()
    })
  })

  describe('UI Elements', () => {
    it('renders all icon components', () => {
      render(<App />)
      const container = screen.getByRole('banner')
      // Shield icon should be in the logo
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders benefit cards with proper structure', () => {
      render(<App />)
      const benefitCards = screen.getAllByRole('article')
      expect(benefitCards.length).toBeGreaterThanOrEqual(7) // 3 benefits + 4 services
    })
  })
})
