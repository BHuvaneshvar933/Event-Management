import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Calendar, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: "Events Hosted", value: "10K+", icon: <Calendar className="text-[#ff385c]" size={20} /> },
    { label: "Happy Members", value: "50K+", icon: <Users className="text-[#ff385c]" size={20} /> },
    { label: "Cities Covered", value: "25+", icon: <Zap className="text-[#ff385c]" size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 text-[#ff385c] mb-6 bg-[#ff385c]/10 px-4 py-2 rounded-full border border-[#ff385c]/20"
          >
            <Sparkles size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Our Story</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8"
          >
            Defining the <br />
            <span className="text-gradient">Experience.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed"
          >
            Events isn't just a platform; it's a movement. We're dedicated to bridging the gap between extraordinary organizers and curious souls seeking their next adventure.
          </motion.p>
        </div>

        {/* Vision Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff385c] to-[#ff8a00] blur-3xl opacity-20 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000" 
              alt="Events Community" 
              className="rounded-[3rem] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000'; }}
            />
          </motion.div>
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tight leading-tight">
              A Mission to <br />
              <span className="text-gradient">Connect Cities.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded with the vision of making event discovery as thrilling as the event itself. We believe that every city has a heartbeat, and our goal is to help you find it. From underground art shows to global tech summits, we curate the scenes that matter.
            </p>
            <div className="space-y-4">
              {['Seamless Ticketing', 'Verified Organizers', 'Curated Experiences'].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-white font-bold uppercase tracking-widest text-xs">
                  <ShieldCheck className="text-[#ff385c]" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[2.5rem] p-10 text-center border-white/10"
            >
              <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-4 border border-white/5">{stat.icon}</div>
              <div className="text-4xl font-black italic tracking-tighter mb-2">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-1 bg-gradient-to-r from-[#ff385c] to-[#ff8a00] rounded-[3rem]"
        >
          <div className="bg-[#0a0a0a] rounded-[2.9rem] p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">Ready to join the <span className="text-gradient">District?</span></h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">Create an account today and start discovering the most exclusive events in your area.</p>
            <Link to="/register" className="btn-primary px-12 py-5 text-lg group">
              Start Your Journey
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
