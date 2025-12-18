import { useState, useEffect } from 'react';

/**
 * Cookie Banner - Cumplimiento Ley 25.326 (Argentina) + GDPR
 * Integrado con Google Consent Mode v2
 */
export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Verificar si ya aceptó/rechazó cookies
    const consent = localStorage.getItem('ayma_cookie_consent');
    if (!consent) {
      // Mostrar banner después de 1 segundo
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Aplicar preferencias guardadas
      applyConsent(JSON.parse(consent));
    }
  }, []);

  const applyConsent = (preferences) => {
    // Google Consent Mode v2
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'ad_user_data': preferences.marketing ? 'granted' : 'denied',
        'ad_personalization': preferences.marketing ? 'granted' : 'denied',
      });
    }

    // Meta Pixel
    if (preferences.marketing && window.fbq) {
      window.fbq('consent', 'grant');
    }

    // Tracking event
    if (window.gtag && preferences.analytics) {
      window.gtag('event', 'cookie_consent', {
        analytics: preferences.analytics,
        marketing: preferences.marketing,
      });
    }
  };

  const handleAcceptAll = () => {
    const preferences = { analytics: true, marketing: true, timestamp: Date.now() };
    localStorage.setItem('ayma_cookie_consent', JSON.stringify(preferences));
    applyConsent(preferences);
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    const preferences = { analytics: false, marketing: false, timestamp: Date.now() };
    localStorage.setItem('ayma_cookie_consent', JSON.stringify(preferences));
    applyConsent(preferences);
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
        onClick={() => {}} // No cerrar al hacer click fuera
      />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              {/* Icono cookie */}
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  🍪 Utilizamos cookies
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  En AYMA Advisors usamos cookies propias y de terceros para mejorar tu experiencia, 
                  analizar el tráfico y mostrarte contenido relevante. Podés aceptar todas, 
                  solo las esenciales, o personalizar tu elección.
                </p>
                
                {/* Detalles expandibles */}
                {showDetails && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Esenciales</span>
                          <span className="text-gray-500 ml-1">(siempre activas)</span>
                          <p className="text-gray-500 mt-0.5">Necesarias para el funcionamiento básico del sitio.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Analíticas</span>
                          <span className="text-gray-500 ml-1">(Google Analytics)</span>
                          <p className="text-gray-500 mt-0.5">Nos ayudan a entender cómo usás el sitio para mejorarlo.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 11H14a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Marketing</span>
                          <span className="text-gray-500 ml-1">(Google Ads, Meta)</span>
                          <p className="text-gray-500 mt-0.5">Permiten mostrarte anuncios relevantes en otras plataformas.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <a 
                        href="/politica-privacidad" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        target="_blank"
                      >
                        Ver Política de Privacidad completa →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Botones */}
          <div className="px-5 md:px-6 pb-5 md:pb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                Aceptar todas
              </button>
              <button
                onClick={handleAcceptEssential}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={handleCustomize}
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-600 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
              </button>
            </div>
            
            {/* Legal footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Al continuar navegando, aceptás nuestra{' '}
              <a href="/politica-privacidad" className="underline hover:text-gray-700">Política de Privacidad</a>
              {' '}conforme a la Ley 25.326 de Protección de Datos Personales.
            </p>
          </div>
          
        </div>
      </div>
    </>
  );
}
