
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedClasses from '@/components/FeaturedClasses';
import Instructors from '@/components/Instructors';
import Footer from '@/components/Footer';
import TimedPopup from '@/components/TimedPopup';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <FeaturedClasses />
      <Instructors />
      <Footer />
      <TimedPopup />
    </div>
  );
};

export default Index;
