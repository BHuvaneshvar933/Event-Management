import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <h1 className="text-[12rem] font-black italic tracking-tighter leading-none opacity-10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gradient text-5xl font-black uppercase italic tracking-tighter">Lost in Space.</div>
          </div>
        </motion.div>
        
        <p className="text-gray-500 font-bold uppercase tracking-widest mb-12 max-w-md mx-auto">
          The experience you're looking for has moved to another dimension or never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/" className="btn-primary flex items-center space-x-2 px-8">
            <Home size={18} />
            <span>Go Home</span>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
