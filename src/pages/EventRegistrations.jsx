import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Trash2, Mail, QrCode, Search, Download, Loader2, AlertCircle } from 'lucide-react';

function EventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}/registrations`);
      if (!res.ok) throw new Error('Failed to fetch registrations');
      const data = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const handleRemove = async (registrationId) => {
    if (!window.confirm('Are you sure you want to remove this registration?')) return;
    try {
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}/registrations/${registrationId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove registration');
      setRegistrations(registrations.filter((reg) => reg._id !== registrationId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.participant?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link to={`/organiser/${id}`} className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-6 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Management</span>
            </Link>
            <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
              <Users size={18} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Guest List</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Verified <br />
              <span className="text-gradient">Attendees.</span>
            </h1>
          </div>

          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700 font-bold text-sm uppercase tracking-wider"
            />
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 font-bold mb-8 flex items-center space-x-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Guests', value: registrations.length },
            { label: 'Confirmed', value: registrations.length },
            { label: 'Waitlist', value: 0 },
            { label: 'Capacity', value: '∞' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-[2rem] border-white/10">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{stat.label}</div>
              <div className="text-3xl font-black italic tracking-tighter text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Registrations List */}
        <div className="space-y-6">
          {filteredRegistrations.length === 0 ? (
            <div className="py-24 text-center glass rounded-[3rem] border-dashed border-white/10">
              <p className="text-gray-500 font-bold uppercase tracking-widest">No matching registrations found.</p>
            </div>
          ) : (
            filteredRegistrations.map((reg, i) => (
              <motion.div
                key={reg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-8 rounded-[2.5rem] border-white/10 group hover:border-[#ff385c]/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#ff385c] to-[#ff8a00] flex items-center justify-center font-black text-2xl shadow-lg shadow-[#ff385c]/20">
                      {reg.fullName?.[0]?.toUpperCase() || reg.participant?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{reg.fullName || reg.participant}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                          <Mail size={12} className="mr-1 text-[#ff385c]" />
                          {reg.email}
                        </div>
                        <div className="px-3 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Confirmed
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-gray-500 group-hover:text-white transition-colors">
                      <QrCode size={24} />
                    </div>
                    <button
                      onClick={() => handleRemove(reg._id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EventRegistrations;
