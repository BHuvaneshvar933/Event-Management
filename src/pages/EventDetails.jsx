import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Tag, Phone, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Share2, Heart } from 'lucide-react';

function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Event not found');
        }
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const now = new Date().getTime();
  const registrationsOpen =
    event &&
    event.status === 'open' &&
    event.registrationStartDate &&
    event.registrationEndDate &&
    now >= new Date(event.registrationStartDate).getTime() &&
    now <= new Date(event.registrationEndDate).getTime();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.username) {
      setRegistrationMessage('Please log in to register.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant: user.username,
          relation: 'participant',
          email,
          fullName,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setRegistrationMessage(data.message);
      setTimeout(() => setShowRegisterForm(false), 2000);
    } catch (err) {
      console.error(err);
      setRegistrationMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-6">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold mb-4">{error}</h2>
      <Link to="/events" className="btn-primary">Back to Events</Link>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className="text-[#ff385c]" size={48} />
      </motion.div>
    </div>
  );

  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'TBA';
  const regEndDate = event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : 'TBA';

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Hero Visual */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <img 
          src={event.image || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000`} 
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        
        <div className="absolute top-32 left-6 md:left-24">
          <Link to="/events" className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </Link>
        </div>

        <div className="absolute bottom-12 left-6 md:left-24 right-6 md:right-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1 bg-[#ff385c] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  {event.category || 'General'}
                </span>
                <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
                  {registrationsOpen ? 'Booking Open' : 'Registration Closed'}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-white/80">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10"><Calendar size={20} className="text-[#ff385c]" /></div>
                  <div className="text-sm font-bold uppercase tracking-widest">{eventDate}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10"><MapPin size={20} className="text-[#ff385c]" /></div>
                  <div className="text-sm font-bold uppercase tracking-widest">{event.location}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-24 mt-12">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#ff385c] mb-6">About the Event</h3>
              <p className="text-xl text-gray-400 leading-relaxed font-medium">
                {event.description}
              </p>
            </section>

            <section className="grid sm:grid-cols-2 gap-8">
              <div className="p-8 glass rounded-[2.5rem] border-white/10">
                <Tag className="text-[#ff385c] mb-4" size={32} />
                <h4 className="text-lg font-bold mb-2 uppercase italic tracking-tight">Curated Vibe</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Part of the official {event.category || 'General'} lineup. Premium experience guaranteed.</p>
              </div>
              <div className="p-8 glass rounded-[2.5rem] border-white/10">
                <Phone className="text-[#ff385c] mb-4" size={32} />
                <h4 className="text-lg font-bold mb-2 uppercase italic tracking-tight">Organizer Connect</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{event.organizerContact || 'Verified Events Partner'}</p>
              </div>
            </section>

            <section className="p-1 w-full bg-gradient-to-r from-[#ff385c] to-[#ff8a00] rounded-[3rem]">
              <div className="bg-[#0a0a0a] rounded-[2.9rem] p-12 text-center">
                <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Join the Community</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Registration closes on {regEndDate}. Don't miss out on this exclusive experience.</p>
                <div className="flex justify-center space-x-4">
                  <button className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Share2 size={24} /></button>
                  <button className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-[#ff385c]"><Heart size={24} /></button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 glass rounded-[3rem] p-8 border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff385c] to-[#ff8a00]"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Passes Starting at</div>
                  <div className="text-4xl font-black italic tracking-tighter">FREE</div>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Live
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!showRegisterForm ? (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {registrationsOpen ? (
                      <button
                        onClick={() => setShowRegisterForm(true)}
                        className="btn-primary w-full py-5 text-xl uppercase italic tracking-tighter font-black"
                      >
                        Secure My Spot
                      </button>
                    ) : (
                      <div className="p-6 bg-white/5 rounded-3xl text-center border border-white/5">
                        <AlertCircle className="mx-auto mb-2 text-gray-600" size={32} />
                        <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">Registrations Closed</div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full py-5 text-xl uppercase italic tracking-tighter font-black disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Pass'}
                    </button>

                    {registrationMessage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center space-x-2 p-3 rounded-xl text-xs font-bold ${
                          registrationMessage.includes('failed') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                        }`}
                      >
                        {registrationMessage.includes('failed') ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                        <span>{registrationMessage}</span>
                      </motion.div>
                    )}
                    
                    <button 
                      type="button"
                      onClick={() => setShowRegisterForm(false)}
                      className="w-full text-center text-xs font-bold text-gray-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center space-x-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                  <CheckCircle2 size={14} className="text-[#ff385c]" />
                  <span>Verified attendees get digital tickets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
