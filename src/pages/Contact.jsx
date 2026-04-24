import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight, Sparkles, Globe } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#ff385c]/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center space-x-2 text-[#ff385c] mb-6 bg-[#ff385c]/10 px-4 py-2 rounded-full border border-[#ff385c]/20"
          >
            <MessageSquare size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Contact Hub</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8"
          >
            Get in <br />
            <span className="text-gradient">Touch.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-gray-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            Have a question about an event or want to partner with us? Our team is always on standby to assist you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[3rem] p-10 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff385c] to-[#ff8a00]"></div>
              
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-10 border-b border-white/10 pb-4">Our Channels</h3>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[#ff385c] group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Email Support</div>
                    <div className="text-lg font-bold text-white tracking-tight">hq@events.district</div>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[#ff385c] group-hover:scale-110 transition-transform">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Phone Line</div>
                    <div className="text-lg font-bold text-white tracking-tight">+1 (888) DISTRICT</div>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[#ff385c] group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Global HQ</div>
                    <div className="text-lg font-bold text-white tracking-tight italic">Lexington Ave, NYC</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-6 bg-gradient-to-br from-[#ff385c]/5 to-transparent rounded-[2rem] border border-white/5">
                <Globe className="text-[#ff385c] mb-4" size={24} />
                <h4 className="font-bold uppercase tracking-tight italic mb-2">Global Presence</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest font-black">Operating across 25+ cities worldwide. We're where the scene is.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-[3.5rem] p-12 border-white/10 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-10">
                <Sparkles className="text-[#ff385c]" size={20} />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Send a Transmission</h3>
              </div>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="John Wick"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Event Partnership / Inquiry"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Message</label>
                  <textarea
                    placeholder="Tell us what's on your mind..."
                    rows="5"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-6 text-xl uppercase italic tracking-tighter font-black flex items-center justify-center group"
                >
                  Blast Message
                  <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={24} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
