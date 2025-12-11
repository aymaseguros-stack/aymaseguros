import { useState, useEffect, useRef } from 'react';
import { tokenizar, TIPOS } from '../utils/tokenVault';

const WHATSAPP_ROSARIO = '5493416952259';
const PORTAL_URL = 'https://ayma-portal-frontend.vercel.app';
const SINIESTRO_URL = 'https://centro.aymaseguros.com.ar/siniestros';

const SocialIcons = {
  instagram: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>),
  facebook: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>),
  linkedin: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>),
  x: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNosotrosOpen, setIsNosotrosOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNosotrosOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '#hogar', label: 'Hogar' },
    { href: '#comercio', label: 'Comercio' },
    { href: '#empresas', label: 'Empresas' },
  ];

  const nosotrosLinks = [
    { href: '#nosotros', label: 'Quiénes Somos', external: false },
    { href: '#contacto', label: 'Contacto', external: false },
    { href: 'https://centro.aymaseguros.com.ar', label: 'Centro AYMA', external: true },
  ];

  const socialLinks = [
    { href: 'https://instagram.com/aymaseguros', icon: 'instagram', color: 'hover:text-pink-500' },
    { href: 'https://facebook.com/61584119926136', icon: 'facebook', color: 'hover:text-blue-500' },
    { href: 'https://linkedin.com/company/ayma-seguros', icon: 'linkedin', color: 'hover:text-blue-600' },
    { href: 'https://x.com/AymaSeguros', icon: 'x', color: 'hover:text-gray-900' },
  ];

  const handleWhatsApp = async () => {
    await tokenizar(TIPOS.WA_CLICK, { ubicacion: 'header' }, 'header');
    window.open(`https://wa.me/${WHATSAPP_ROSARIO}?text=Hola! Quiero información sobre seguros`, '_blank');
  };

  const handleSiniestro = async () => {
    await tokenizar(TIPOS.FORM_START, { tipo: 'siniestro', ubicacion: 'header' }, 'header');
    window.open(SINIESTRO_URL, '_blank');
  };

  const handlePortal = async () => {
    await tokenizar(TIPOS.FORM_START, { tipo: 'portal_login', ubicacion: 'header' }, 'header');
    window.open(PORTAL_URL, '_blank');
  };

  const handlePhoneClick = async () => {
    await tokenizar(TIPOS.PHONE_CLICK, { ubicacion: 'header', numero: '3416952259' }, 'header');
  };

  const scrollToSection = (e, href, external) => {
    if (external) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsNosotrosOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo solo texto */}
          <a href="/" className="flex flex-col">
            <span className={`font-bold text-xl md:text-2xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>AYMA</span>
            <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}>Gestores de Riesgos</span>
          </a>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-600/10 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                {link.label}
              </a>
            ))}
            
            {/* Dropdown Nosotros */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsNosotrosOpen(!isNosotrosOpen)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-600/10 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                Nosotros
                <svg className={`w-4 h-4 transition-transform ${isNosotrosOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {isNosotrosOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {nosotrosLinks.map((link) => (
                    link.external ? (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        {link.label} <span className="text-xs">↗</span>
                      </a>
                    ) : (
                      <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">{link.label}</a>
                    )
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-0.5 mr-1">
              {socialLinks.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-full transition-all ${isScrolled ? `text-gray-400 ${social.color}` : `text-white/60 hover:text-white`}`} aria-label={social.icon}>
                  {SocialIcons[social.icon]}
                </a>
              ))}
            </div>

            <a href="tel:+5493416952259" onClick={handlePhoneClick} className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium transition-all ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/80 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span className="hidden xl:inline">341 695-2259</span>
            </a>

            <button onClick={handlePortal} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isScrolled ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="hidden xl:inline">Ingresar</span>
            </button>

            <button onClick={handleSiniestro} className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="hidden xl:inline">Siniestro</span>
            </button>

            <button onClick={handleWhatsApp} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>Cotizá</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} aria-label="Menú">
            {isMobileMenuOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">{link.label}</a>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">Nosotros</p>
                {nosotrosLinks.map((link) => (
                  link.external ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-lg text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-between">{link.label} <span>↗</span></a>
                  ) : (
                    <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium block">{link.label}</a>
                  )
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
              {socialLinks.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full bg-gray-100 text-gray-600 ${social.color} transition-all`} aria-label={social.icon}>{SocialIcons[social.icon]}</a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <a href="tel:+5493416952259" onClick={handlePhoneClick} className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Llamar: 341 695-2259
              </a>
              <button onClick={handlePortal} className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Ingresar al Portal
              </button>
              <button onClick={handleSiniestro} className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Reportar Siniestro
              </button>
              <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Cotizá por WhatsApp
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
