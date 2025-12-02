import Header from './components/Header';
import HeroSection from './components/HeroSection';
import { WhyChooseUs, Services, Testimonials, FinalCTA } from './components/Sections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <ChatBot />
      <HeroSection />
      <WhyChooseUs />
      <Services />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
