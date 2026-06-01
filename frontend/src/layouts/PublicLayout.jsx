import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Dynamic Modular Navbar Header */}
      <Navbar />

      {/* Main Page Layout Core */}
      <main className="flex-1 relative">
        {/* Sleek top ambient glow to add high-fidelity depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-brand-navy/10 to-transparent pointer-events-none blur-3xl z-0" />
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Dynamic Modular Footer Section */}
      <Footer />

    </div>
  );
}

