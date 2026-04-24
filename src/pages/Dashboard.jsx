import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, MapPin, ArrowRight, Loader2, User, Ticket, Sparkles } from 'lucide-react';

function Dashboard() {
  const { user, loading } = useAuth();
  const username = user ? user.username.trim().toLowerCase() : '';

  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('organized');
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!username) return;
    const fetchOrganized = async () => {
      try {
        const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/mine?username=${username}`);
        if (!res.ok) throw new Error("Error fetching organized events");
        const data = await res.json();
        setOrganizedEvents(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`https://event-backend-utqn.onrender.com/api/registrations?username=${username}`);
        if (!res.ok) throw new Error("Error fetching registrations");
        const data = await res.json();
        setRegistrations(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    const fetchAll = async () => {
      setFetching(true);
      await Promise.all([fetchOrganized(), fetchRegistrations()]);
      setFetching(false);
    };

    fetchAll();
  }, [username]);

  if (loading || (fetching && organizedEvents.length === 0)) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className="text-[#ff385c]" size={48} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
              <LayoutDashboard size={18} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Personal Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Control <br />
              <span className="text-gradient">Center.</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 p-2 rounded-3xl border border-white/10">
            <button
              onClick={() => setActiveTab("organized")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest ${
                activeTab === "organized"
                  ? "bg-[#ff385c] text-white shadow-lg shadow-[#ff385c]/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Sparkles size={16} />
              <span>Organized</span>
            </button>
            <button
              onClick={() => setActiveTab("registrations")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest ${
                activeTab === "registrations"
                  ? "bg-[#ff385c] text-white shadow-lg shadow-[#ff385c]/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Ticket size={16} />
              <span>Registered</span>
            </button>
          </div>
        </div>

        {error && <p className="text-center text-red-500 mb-8 font-bold">{error}</p>}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "organized" ? (
              organizedEvents.length === 0 ? (
                <div className="py-24 text-center glass rounded-[3rem] border-dashed border-white/10">
                  <p className="text-gray-500 font-bold uppercase tracking-widest">You haven't organized any events yet.</p>
                  <Link to="/create-event" className="inline-block mt-6 text-[#ff385c] font-black uppercase italic tracking-tighter text-xl hover:underline">
                    Create your first +
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {organizedEvents.map((event, i) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-[2.5rem] p-8 border-white/10 hover:border-[#ff385c]/50 transition-all group"
                    >
                      <Link to={`/organiser/${event._id}`} className="block">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-white/5 rounded-2xl text-[#ff385c]">
                            <Calendar size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full">
                            Manager View
                          </span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-gradient transition-all">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-[#ff385c]" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-[#ff385c]" />
                            {event.location}
                          </div>
                        </div>
                        <div className="mt-8 flex items-center text-[#ff385c] font-black uppercase italic tracking-tighter text-sm group-hover:translate-x-2 transition-transform">
                          Manage Event <ArrowRight size={16} className="ml-2" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )
            ) : registrations.length === 0 ? (
              <div className="py-24 text-center glass rounded-[3rem] border-dashed border-white/10">
                <p className="text-gray-500 font-bold uppercase tracking-widest">You haven't registered for any events yet.</p>
                <Link to="/events" className="inline-block mt-6 text-[#ff385c] font-black uppercase italic tracking-tighter text-xl hover:underline">
                  Find an event to join
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {registrations.map((reg, i) => (
                  <motion.div
                    key={reg.registration._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-[2.5rem] p-8 border-white/10 hover:border-[#ff385c]/50 transition-all group"
                  >
                    <Link to={`/ticket/${reg.registration._id}`} className="block">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/5 rounded-2xl text-[#ff385c]">
                          <Ticket size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                          Confirmed
                        </span>
                      </div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-gradient transition-all">
                        {reg.event.title}
                      </h3>
                      <div className="space-y-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-[#ff385c]" />
                          {new Date(reg.event.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-8 flex items-center text-[#ff385c] font-black uppercase italic tracking-tighter text-sm group-hover:translate-x-2 transition-transform">
                        View Ticket <ArrowRight size={16} className="ml-2" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;
