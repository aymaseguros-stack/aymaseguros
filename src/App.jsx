import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LogosAseguradoras from './components/LogosAseguradoras';
import { WhyChooseUs, Services, FinalCTA } from './components/Sections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import TrustpilotSection from './components/TrustpilotSection';
import { retryPendingTokens } from './utils/tokenVault';

// Landing Page
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ChatBot />
      <HeroSection />
      <WhyChooseUs />
      <LogosAseguradoras />
      <Services />
      <TrustpilotSection />
      <FinalCTA />
      <Footer />
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
