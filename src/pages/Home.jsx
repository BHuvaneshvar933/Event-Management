import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Star, Users, Zap } from "lucide-react";

const Home = () => {
  const categories = [
    { name: "Music", count: "24 Events", color: "from-pink-500 to-rose-500", icon: <Zap size={24} /> },
    { name: "Tech", count: "12 Events", color: "from-blue-500 to-indigo-500", icon: <Zap size={24} /> },
    { name: "Food", count: "18 Events", color: "from-orange-500 to-amber-500", icon: <Zap size={24} /> },
    { name: "Art", count: "9 Events", color: "from-purple-500 to-violet-500", icon: <Zap size={24} /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero.png" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60 scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-[#ff385c] uppercase bg-[#ff385c]/10 rounded-full border border-[#ff385c]/20">
              Discover the Extraordinary
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              YOUR CITY'S <br />
              <span className="text-gradient">BEST EVENTS.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
              From secret underground gigs to massive tech conferences. 
              Find your next favorite experience on <span className="text-white font-bold">Events.</span>
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Link to="/events" className="btn-primary w-full md:w-auto text-lg group">
                Explore Events
                <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/about" className="w-full md:w-auto px-8 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/5 transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-0 right-0 hidden lg:block"
        >
          <div className="container mx-auto px-6">
            <div className="flex justify-center space-x-24">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg"><Calendar className="text-[#ff385c]" size={20} /></div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Events Yearly</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg"><Users className="text-[#ff385c]" size={20} /></div>
                <div>
                  <div className="text-2xl font-bold">50k+</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active Users</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg"><Star className="text-[#ff385c]" size={20} /></div>
                <div>
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2 uppercase italic">Browse by Scene</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#ff385c] to-[#ff8a00] rounded-full"></div>
          </div>
          <Link to="/events" className="text-gray-400 hover:text-white transition-colors flex items-center font-bold uppercase text-sm tracking-widest">
            View All <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative group h-48 rounded-3xl overflow-hidden cursor-pointer`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                <div className="mb-3 p-3 bg-white/20 rounded-2xl backdrop-blur-md">{cat.icon}</div>
                <h3 className="text-2xl font-black uppercase italic">{cat.name}</h3>
                <span className="text-xs font-bold opacity-80 uppercase tracking-tighter">{cat.count}</span>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Events Section */}
      <section className="py-24 bg-[#121212] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-[#ff385c] to-[#ff8a00] rotate-3 absolute inset-0 -z-10 blur-2xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000" 
                alt="Community" 
                className="rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div>
              <h2 className="text-5xl font-black tracking-tight mb-8 leading-tight">
                MORE THAN JUST <br />
                <span className="text-gradient underline">TICKETS.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Exclusive Access", desc: "Get early access to the hottest events and secret underground experiences." },
                  { title: "Smart Discovery", desc: "Our AI-powered engine learns what you love and suggests events you'll actually care about." },
                  { title: "Seamless Experience", desc: "Book, share, and enter events with our lightning-fast digital ticket system." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                      <div className="w-3 h-3 rounded-full bg-[#ff385c]"></div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
