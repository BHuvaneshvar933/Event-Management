import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Calendar } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#0a0a0a] border-t border-white/5 pt-24 pb-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#ff385c] to-[#ff8a00] rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              EVENTS<span className="text-[#ff385c]">.</span>
            </span>
          </Link>
          <p className="text-gray-500 max-w-sm text-lg leading-relaxed mb-8 italic font-medium">
            "The premiere destination for those who seek the extraordinary in every corner of the city."
          </p>
          <div className="flex space-x-6">
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white"><Instagram size={20} /></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white"><Twitter size={20} /></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white"><Facebook size={20} /></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white"><Youtube size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff385c] mb-8">Explore</h4>
          <ul className="space-y-4 font-bold text-gray-400">
            <li><Link to="/events" className="hover:text-white transition-colors">All Events</Link></li>
            <li><Link to="/categories/music" className="hover:text-white transition-colors">Music Scene</Link></li>
            <li><Link to="/categories/tech" className="hover:text-white transition-colors">Tech Hub</Link></li>
            <li><Link to="/categories/food" className="hover:text-white transition-colors">Foodie District</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff385c] mb-8">Support</h4>
          <ul className="space-y-4 font-bold text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Get Help</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Entry</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Vault</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest text-center md:text-left w-full">
          &copy; 2024 EVENTS HQ. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
