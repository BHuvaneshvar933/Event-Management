import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, Filter, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await fetch('https://event-backend-utqn.onrender.com/api/events');
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Error fetching events');
        }
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-[#ff385c]" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
                <Sparkles size={18} />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">The Lineup</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                Explore <br />
                <span className="text-gradient">Events.</span>
              </h1>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group flex-grow md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff385c] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search events, cities, scenes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-600"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 bg-[#121212] border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/5 transition-colors">
                <Filter size={20} />
                <span className="font-bold uppercase text-sm tracking-widest">Filter</span>
              </button>
            </div>
          </motion.div>
        </div>

        {error && (
          <div className="p-8 glass rounded-3xl text-center mb-12 border-red-500/20">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-bold text-gray-500">No events found matching your search.</h3>
            <p className="text-gray-600 mt-2">Try searching for something else or browse all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <Link to={`/events/${event._id}`} className="block h-full">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-[#121212]">
                    <img 
                      src={event.image || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000`} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      onError={(e) => { 
                        e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'; 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-6 left-6 flex flex-col space-y-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                        {event.category || 'General'}
                      </span>
                    </div>

                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="flex items-center space-x-2 text-[#ff385c] mb-2">
                            <Calendar size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">
                              {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-white uppercase italic leading-tight mb-1 group-hover:text-gradient transition-all duration-300">
                            {event.title}
                          </h3>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black -mb-1 scale-0 group-hover:scale-100 transition-transform duration-500">
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-widest">
                      <MapPin size={14} className="mr-2 text-[#ff385c]" />
                      {event.location}
                    </div>
                    <p className="mt-3 text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllEvents;
