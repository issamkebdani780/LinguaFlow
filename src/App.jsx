import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import FAQ from './components/Faq';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Navbar />
      <Hero  />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default App;