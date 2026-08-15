import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LogosAseguradoras from './components/LogosAseguradoras';
import { WhyChooseUs, Services, SeccionHogar, SeccionComercio, SeccionEmpresas, FinalCTA } from './components/Sections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import TrustpilotSection from './components/TrustpilotSection';
import CookieBanner from './components/CookieBanner';
import { retryPendingTokens } from './utils/tokenVault';

// Landing Page
function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header isChatOpen={isChatOpen} onOpenChat={() => setIsChatOpen(true)} />
      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <HeroSection />
      <LogosAseguradoras />
      <TrustpilotSection />
      <WhyChooseUs />
      <Services />
      <SeccionHogar />
      <SeccionComercio />
      <SeccionEmpresas />
      <FinalCTA />
      <Footer />
      <CookieBanner />
    </div>
  );
}

// App con rutas
function App() {
  useEffect(() => {
    retryPendingTokens();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
