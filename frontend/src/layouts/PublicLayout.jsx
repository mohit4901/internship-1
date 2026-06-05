import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Dynamic Modular Navbar Header */}
      <Navbar />

      {/* Main Page Layout Core */}
      <main className="flex-1 pt-16 md:pt-24 pb-20 md:pb-0 relative z-10 bg-[#FAF9F6]">
        <Outlet />
      </main>

      {/* Dynamic Modular Footer Section */}
      <Footer />

    </div>
  );
}

