#!/usr/bin/env python3
"""
Script para actualizar TrustpilotSection.jsx con widget oficial de Trustpilot
Ejecutar desde la carpeta aymaseguros-landing:
    python3 update_trustpilot.py
"""

import os

TRUSTPILOT_SECTION_JSX = '''import { useState, useEffect } from 'react';

// ============================================================================
// DATOS DE TESTIMONIOS
// ============================================================================
const TESTIMONIOS = [
  {
    id: 1,
    nombre: 'Valentina Kirschbaum',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Encontrar AYMA fue un cambio total. Me explicaron cada detalle y optimizaron mi cobertura.',
    producto: 'Auto + Hogar',
  },
  {
    id: 2,
    nombre: 'Martín Ostrowski',
    ubicacion: 'Funes',
    rating: 5,
    texto: 'Tuve un accidente y AYMA se encargó de todo. En menos de una semana tenía todo resuelto.',
    producto: 'Seguro Auto',
  },
  {
    id: 3,
    nombre: 'Luciano Bettanin',
    ubicacion: 'Pérez',
    rating: 5,
    texto: 'Contraté ART y RC para mi taller. El asesoramiento fue muy completo.',
    producto: 'ART + RC',
  },
  {
    id: 4,
    nombre: 'Agustina Wernicke',
    ubicacion: 'Fisherton',
    rating: 5,
    texto: 'Excelente atención. Me ayudaron a encontrar el mejor seguro para mi comercio.',
    producto: 'Integral Comercio',
  },
  {
    id: 5,
    nombre: 'Federico Stransky',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Llevamos 5 años con AYMA para toda la flota. Siempre responden rápido.',
    producto: 'Flota + ART',
  },
  {
    id: 6,
    nombre: 'Carolina Zuberbühler',
    ubicacion: 'Roldán',
    rating: 5,
    texto: 'Me ahorraron un 35% en el seguro del auto sin perder cobertura.',
    producto: 'Seguro Auto',
  },
  {
    id: 7,
    nombre: 'Gonzalo Leibovich',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Cuando tuve el siniestro en casa, me acompañaron en todo el proceso.',
    producto: 'Hogar',
  },
  {
    id: 8,
    nombre: 'Sofía Kratochvil',
    ubicacion: 'Funes',
    rating: 5,
    texto: 'Profesionales de verdad. Te asesoran para que elijas lo mejor para vos.',
    producto: 'Vida + Hogar',
  },
  {
    id: 9,
    nombre: 'Nicolás Echeverría',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Rápidos, eficientes y siempre disponibles. La mejor experiencia.',
    producto: 'Auto',
  }
];

// ============================================================================
// WIDGET OFICIAL TRUSTPILOT
// ============================================================================
function TrustpilotWidget() {
  useEffect(() => {
    // Recargar widget de Trustpilot cuando el componente se monta
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(document.getElementById('trustpilot-widget-container'));
    }
  }, []);

  return (
    <div id="trustpilot-widget-container" className="w-full">
      {/* TrustBox widget - Review Collector */}
      <div 
        className="trustpilot-widget" 
        data-locale="es-ES" 
        data-template-id="56278e9abfbbba0bdcd568bc" 
        data-businessunit-id="6938d1b8f444175f88992788" 
        data-style-height="52px" 
        data-style-width="100%"
        data-token="fea534d3-2d2d-40cc-b15c-3451518b50c3"
      >
        <a 
          href="https://es.trustpilot.com/review/aymaseguros.com.ar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-[#00B67A] transition-colors"
        >
          Ver reseñas en Trustpilot
        </a>
      </div>
      {/* End TrustBox widget */}
    </div>
  );
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-[#00B67A]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TrustpilotLogo({ className = "h-5" }) {
  return (
    <svg className={className} viewBox="0 0 126 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.4 12.25H27.6V10H42.2v2.25h-5.8v15.3h-3v-15.3zM43.2 13.8h2.6v2.3h.1c.1-.4.3-.8.6-1.1.3-.4.6-.7 1-1 .4-.3.8-.5 1.3-.7.5-.2 1-.3 1.5-.3.4 0 .7 0 .9.1v2.7c-.2 0-.4-.1-.7-.1-.3 0-.5-.1-.8-.1-.6 0-1.1.1-1.6.3-.5.2-.9.5-1.2.9-.3.4-.6.8-.8 1.4-.2.5-.3 1.1-.3 1.8v7.5h-2.7V13.8zM63.1 27.6h-2.7v-2h-.1c-.4.7-1 1.3-1.7 1.7-.7.4-1.5.6-2.4.6-.8 0-1.5-.1-2.1-.4-.6-.2-1.1-.6-1.5-1.1-.4-.5-.7-1-.9-1.7-.2-.7-.3-1.4-.3-2.3V13.8h2.7v9.1c0 1.1.3 2 .8 2.6.5.6 1.2.9 2.1.9.6 0 1.2-.1 1.6-.4.5-.2.9-.5 1.2-.9.3-.4.5-.8.7-1.4.2-.5.2-1.1.2-1.7v-8.2h2.7v13.8zM66.4 21.6c0-.6.1-1.2.2-1.7.1-.6.4-1.1.7-1.6.3-.5.8-.9 1.4-1.3.6-.4 1.4-.6 2.4-.7l3.5-.4c0-.4-.1-.8-.2-1.1-.1-.4-.3-.7-.6-.9-.3-.3-.6-.5-1-.6-.4-.1-.9-.2-1.4-.2-.8 0-1.5.2-2.1.6-.6.4-.9.9-1 1.5h-2.7c.1-.8.3-1.4.6-2 .4-.5.8-1 1.4-1.3.6-.3 1.2-.6 1.9-.7.7-.2 1.4-.2 2.1-.2.8 0 1.5.1 2.2.3.7.2 1.3.5 1.8.9.5.4.9 1 1.2 1.6.3.7.5 1.5.5 2.4v8.4h-2.5v-1.8h-.1c-.2.3-.4.6-.7.9-.3.3-.6.5-.9.7-.4.2-.8.4-1.2.5-.5.1-1 .2-1.5.2-.6 0-1.2-.1-1.7-.3-.5-.2-1-.5-1.4-.8-.4-.4-.7-.8-.9-1.3-.3-.5-.4-1.1-.4-1.8v-.2zm2.7-.2c0 .4.1.7.2 1 .2.3.4.5.6.7.3.2.6.3.9.4.4.1.7.1 1.1.1.5 0 1-.1 1.4-.3.4-.2.8-.4 1.1-.7.3-.3.5-.6.7-1 .2-.4.3-.8.3-1.2v-1.3l-3.1.4c-.5.1-1 .2-1.4.3-.4.1-.8.3-1 .6-.3.2-.5.5-.6.8-.1.3-.2.7-.2 1.2zM79.4 21.6c0-.6.1-1.1.2-1.6.2-.5.4-1 .8-1.5.3-.5.8-.9 1.3-1.2.5-.4 1.2-.6 2-.8.7-.2 1.6-.3 2.6-.3.7 0 1.4.1 2.1.2.7.1 1.4.4 2 .7.6.3 1.1.8 1.5 1.3.4.6.6 1.3.6 2.1v6.5c0 .5 0 1 .1 1.5.1.4.1.8.3 1.1h-2.8c-.1-.2-.1-.5-.2-.7 0-.3-.1-.5-.1-.8-.5.6-1.2 1.1-2 1.4-.8.3-1.6.4-2.5.4-.7 0-1.3-.1-1.9-.3-.6-.2-1.1-.5-1.5-.8-.4-.4-.7-.8-1-1.3-.2-.5-.4-1.1-.4-1.8 0-.8.2-1.5.5-2 .3-.5.8-.9 1.3-1.3.5-.3 1.1-.6 1.8-.7.7-.2 1.3-.3 2-.4l1.9-.2c.4 0 .7-.1 1-.2.3-.1.5-.3.7-.5.2-.2.2-.5.2-.9 0-.4-.1-.8-.2-1.1-.2-.3-.4-.5-.6-.7-.3-.2-.6-.3-.9-.4-.4-.1-.7-.1-1.1-.1-.9 0-1.6.2-2.2.7-.5.5-.8 1.1-.9 2h-2.6v.3zm9.1 1.8c-.2.1-.4.2-.7.2-.3.1-.5.1-.8.2l-1 .2c-.3.1-.7.1-1 .2-.3.1-.7.2-.9.4-.3.2-.5.4-.7.6-.2.3-.3.6-.3 1 0 .4.1.7.2 1 .2.3.4.5.6.6.3.2.5.3.9.4.3.1.6.1 1 .1.4 0 .8-.1 1.2-.2.4-.1.8-.3 1.1-.5.3-.2.6-.5.8-.9.2-.4.3-.8.3-1.3v-2zM94.5 13.8h2.6v2.3h.1c.4-.8 1-1.5 1.8-1.9.8-.5 1.6-.7 2.6-.7.9 0 1.8.2 2.5.5.7.4 1.3.9 1.8 1.5.5.6.8 1.4 1.1 2.2.2.8.4 1.7.4 2.6 0 .9-.1 1.7-.4 2.5-.2.8-.6 1.5-1 2.1-.5.6-1.1 1.1-1.8 1.5-.7.4-1.6.5-2.6.5-.5 0-1-.1-1.4-.2-.5-.1-.9-.3-1.3-.5-.4-.2-.8-.5-1.1-.8-.3-.3-.6-.7-.8-1.1h-.1v7.1h-2.7V13.8h.3zm9.9 6.5c0-.6-.1-1.2-.2-1.7-.2-.6-.4-1-.8-1.5-.3-.4-.8-.8-1.3-1-.5-.3-1.1-.4-1.8-.4-.7 0-1.3.1-1.8.4-.5.3-1 .6-1.3 1.1-.3.4-.6.9-.8 1.5-.2.6-.3 1.1-.3 1.7 0 .6.1 1.2.3 1.7.2.6.4 1.1.8 1.5.3.4.8.8 1.3 1.1.5.3 1.1.4 1.8.4.7 0 1.3-.1 1.8-.4.5-.3.9-.6 1.3-1.1.3-.4.6-.9.8-1.5.1-.5.2-1.1.2-1.8zM109.2 10h2.7v2.6h-2.7V10zm0 3.8h2.7v13.8h-2.7V13.8zM114.6 10h2.7v17.6h-2.7V10zM124.2 28c-.9 0-1.8-.2-2.5-.5-.7-.3-1.4-.8-1.9-1.4-.5-.6-.9-1.3-1.2-2.1-.3-.8-.4-1.7-.4-2.6 0-.9.1-1.8.4-2.6.3-.8.7-1.5 1.2-2.1.5-.6 1.2-1.1 1.9-1.4.8-.3 1.6-.5 2.5-.5.9 0 1.8.2 2.5.5.8.3 1.4.8 2 1.4.5.6.9 1.3 1.2 2.1.3.8.4 1.7.4 2.6 0 .9-.1 1.8-.4 2.6-.3.8-.7 1.5-1.2 2.1-.5.6-1.2 1.1-2 1.4-.7.3-1.5.5-2.5.5zm0-2.3c.6 0 1.2-.1 1.7-.4.5-.3.9-.6 1.2-1.1.3-.4.6-.9.7-1.5.2-.6.2-1.1.2-1.7 0-.6-.1-1.2-.2-1.7-.2-.6-.4-1-.7-1.5-.3-.4-.7-.8-1.2-1-.5-.3-1-.4-1.7-.4-.6 0-1.2.1-1.7.4-.5.3-.9.6-1.2 1.1-.3.4-.6.9-.7 1.5-.2.5-.2 1.1-.2 1.7 0 .6.1 1.2.2 1.7.2.6.4 1 .7 1.5.3.4.7.8 1.2 1.1.5.2 1.1.3 1.7.3zM3.3 10h5l3.2 9.8h.1L14.8 10h4.7l-5.5 15.1c-.2.6-.5 1.2-.8 1.7-.3.5-.7 1-1.1 1.3-.4.4-.9.7-1.5.9-.6.2-1.2.3-2 .3-.6 0-1.1 0-1.5-.1-.5-.1-.9-.2-1.2-.3l.5-3.3c.2.1.5.1.8.2.3.1.6.1.9.1.4 0 .7 0 1-.1.3-.1.5-.2.7-.4.2-.2.4-.4.5-.7.1-.3.3-.6.4-1l.3-.9L3.3 10z" fill="#191919"/>
      <path d="M0 10h8.5l2.6 8 2.6-8H22L15.7 27.6h-5.3L0 10z" fill="#00B67A"/>
    </svg>
  );
}

function TestimonialCard({ testimonio }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
          {testimonio.nombre.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900 text-sm truncate">{testimonio.nombre}</span>
            <svg className="w-4 h-4 text-[#00B67A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{testimonio.ubicacion}</span>
            <StarRating rating={testimonio.rating} />
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">"{testimonio.texto}"</p>
      
      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full self-start mt-3">
        {testimonio.producto}
      </span>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function TrustpilotSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = TESTIMONIOS.length - itemsPerView;

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    if (window.gtag) {
      window.gtag('event', 'testimonial_arrow_click', {
        direction: 'prev',
        current_index: currentIndex
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    if (window.gtag) {
      window.gtag('event', 'testimonial_arrow_click', {
        direction: 'next',
        current_index: currentIndex
      });
    }
  };

  // Auto-scroll cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section id="testimonios" className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header con Widget Trustpilot Oficial */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-600 mb-4">
            Más de 400 familias y empresas confían en nosotros
          </p>
          
          {/* Widget Oficial Trustpilot */}
          <div className="flex justify-center mb-4">
            <TrustpilotWidget />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-2xl font-bold text-gray-900">4.9</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <a 
            href="https://es.trustpilot.com/review/aymaseguros.com.ar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-[#00B67A] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'trustpilot_link_click', { location: 'testimonials_section' });
              }
            }}
          >
            <span className="text-sm font-medium">+400 reseñas verificadas en</span>
            <TrustpilotLogo className="h-5" />
          </a>
        </div>

        {/* Carrusel Container */}
        <div className="relative">
          {/* Flechas de navegación */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carrusel */}
          <div className="overflow-hidden px-2">
            <div 
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView + 1.67)}%)` }}
            >
              {TESTIMONIOS.map((testimonio) => (
                <div 
                  key={testimonio.id} 
                  className="flex-shrink-0"
                  style={{ width: `calc((100% - 2.5rem) / 3)` }}
                >
                  <TestimonialCard testimonio={testimonio} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                if (window.gtag) {
                  window.gtag('event', 'testimonial_dot_click', { index: idx });
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-[#00B67A] w-6' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-8">
          <a 
            href="https://es.trustpilot.com/evaluate/aymaseguros.com.ar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00B67A] hover:bg-[#00a06b] text-white font-medium px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'trustpilot_review_cta_click');
              }
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Dejanos tu opinión
          </a>
        </div>

      </div>
    </section>
  );
}
'''

def main():
    # Detectar path del archivo
    paths_to_try = [
        'src/components/TrustpilotSection.jsx',
        './src/components/TrustpilotSection.jsx',
    ]
    
    target_path = None
    for path in paths_to_try:
        if os.path.exists(os.path.dirname(path) or '.'):
            target_path = path
            break
    
    if not target_path:
        target_path = 'src/components/TrustpilotSection.jsx'
    
    # Crear backup
    if os.path.exists(target_path):
        backup_path = target_path + '.backup'
        with open(target_path, 'r', encoding='utf-8') as f:
            original = f.read()
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original)
        print(f"✅ Backup creado: {backup_path}")
    
    # Escribir nuevo archivo
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(TRUSTPILOT_SECTION_JSX)
    
    print(f"✅ Archivo actualizado: {target_path}")
    print("")
    print("MEJORAS APLICADAS:")
    print("  • Widget oficial Trustpilot integrado")
    print("  • Logo SVG de Trustpilot inline")
    print("  • Auto-scroll cada 5 segundos")
    print("  • Diseño mejorado con gradientes")
    print("  • Botón CTA 'Dejanos tu opinión'")
    print("  • Tracking GA4 en todos los clicks")
    print("  • Animaciones suaves")
    print("")
    print("PRÓXIMOS PASOS:")
    print("  git add -A")
    print("  git commit -m 'Feat: Trustpilot widget oficial + mejoras UI'")
    print("  git push")

if __name__ == '__main__':
    main()
