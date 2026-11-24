import { useState } from 'react';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SERVICES } from './data/barbershop';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0].name);

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A] text-[#F2F2F0]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection onSelectService={setSelectedService} />
        <GallerySection />
        <BookingSection
          selectedService={selectedService}
          onServiceChange={setSelectedService}
        />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
