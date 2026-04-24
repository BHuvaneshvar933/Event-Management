import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Settings, Trash2, XCircle, Edit3, Save, X, 
  ArrowLeft, Loader2, Sparkles, Calendar, MapPin, 
  Phone, Tag, AlignLeft, Type, Trash, Camera, Image as ImageIcon
} from 'lucide-react';

function OrganiserEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);

  const formatForInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

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
        setFormData({
          title: data.title,
          description: data.description,
          date: formatForInput(data.date),
          location: data.location,
          category: data.category,
          organizerContact: data.organizerContact,
          registrationStartDate: formatForInput(data.registrationStartDate),
          registrationEndDate: formatForInput(data.registrationEndDate),
          image: data.image || ''
        });
        setAttendees(data.attendees || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageProcessing(true);
      if (file.size > 10 * 1024 * 1024) {
        setError('Image is too large. Please select an image under 10MB.');
        setIsImageProcessing(false);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width; width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height; height = MAX_HEIGHT;
            }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData({ ...formData, image: compressedBase64 });
          setError('');
          setIsImageProcessing(false);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEvent = async () => {
    setIsSubmitting(true);
    try {
      const updatedData = { 
        ...formData, 
        organizer: event.organizer,
        date: new Date(formData.date).toISOString(),
        registrationStartDate: new Date(formData.registrationStartDate).toISOString(),
        registrationEndDate: new Date(formData.registrationEndDate).toISOString()
      };
      console.log('UPDATING EVENT - IMAGE SIZE:', updatedData.image?.length || 0);
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update event');
      }
      const data = await res.json();
      setEvent(data);
      setMessage('Event updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEvent = async () => {
    if (!window.confirm('Are you sure you want to close registrations?')) return;
    try {
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizer: event.organizer })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to close event');
      }
      const data = await res.json();
      setMessage(data.message);
      setEvent({ ...event, status: 'closed' });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm('CRITICAL: This will permanently delete the event. Proceed?')) return;
    try {
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizer: event.organizer })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete event');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const removeAttendee = async (attendee) => {
    try {
      const updatedAttendees = event.attendees.filter(a => a !== attendee);
      const res = await fetch(`https://event-backend-utqn.onrender.com/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizer: event.organizer, attendees: updatedAttendees })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update event');
      }
      const updatedEvent = await res.json();
      setEvent(updatedEvent);
      setAttendees(updatedEvent.attendees);
      setMessage(`Registration for ${attendee} cancelled`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-6">
      <XCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold mb-4">{error}</h2>
      <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className="text-[#ff385c]" size={48} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-6 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
              <Settings size={18} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Event Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Edit <br />
              <span className="text-gradient">Mission.</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)}
                className="btn-primary flex items-center space-x-2 px-8"
              >
                <Edit3 size={18} />
                <span>Edit Event</span>
              </button>
            ) : (
              <button 
                onClick={() => setEditMode(false)}
                className="px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center space-x-3 text-green-400 text-sm font-bold"
          >
            <Sparkles size={18} />
            <span>{message}</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Form/Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!editMode ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="glass rounded-[3rem] p-10 border-white/10">
                    {event.image && (
                      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10">
                        <img src={event.image} alt="Event Poster" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{event.title}</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">{event.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <Calendar className="text-[#ff385c]" size={20} />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Date</div>
                          <div className="text-sm font-bold">{new Date(event.date).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <MapPin className="text-[#ff385c]" size={20} />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Location</div>
                          <div className="text-sm font-bold">{event.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <div className="glass rounded-[3rem] p-10 border-white/10 space-y-6">
                    {/* Poster Edit */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Update Poster</label>
                      <div className="relative group">
                        <div className="w-full aspect-video rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ff385c]/50">
                          {formData.image ? (
                            <img src={formData.image} alt="Poster Preview" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <ImageIcon className="text-gray-600 mb-2" size={32} />
                              <span className="text-[10px] font-bold uppercase text-gray-500">Upload New Poster</span>
                            </>
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <Camera className="text-white" size={24} />
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Event Title</label>
                      <div className="relative group">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Description</label>
                      <div className="relative group">
                        <AlignLeft className="absolute left-4 top-6 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all h-32"
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Event Date</label>
                        <input
                          type="datetime-local"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <button
                        onClick={updateEvent}
                        disabled={isSubmitting || isImageProcessing}
                        className="btn-primary w-full py-5 text-xl uppercase italic tracking-tighter font-black flex items-center justify-center disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (
                          <>
                            <Save className="mr-2" size={24} />
                            {isImageProcessing ? 'Processing Image...' : 'Save New Config'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attendees List */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#ff385c]">Passenger List</h3>
                <span className="px-4 py-1 bg-white/5 rounded-full text-xs font-bold border border-white/10">
                  {attendees.length} Attendees
                </span>
              </div>
              
              <div className="space-y-4">
                {attendees.length === 0 ? (
                  <div className="p-12 glass rounded-[2.5rem] text-center border-dashed border-white/10">
                    <p className="text-gray-600 font-bold uppercase tracking-widest">No attendees yet.</p>
                  </div>
                ) : (
                  attendees.map((att, i) => (
                    <motion.div
                      key={att}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-6 glass rounded-3xl border-white/5 group hover:border-[#ff385c]/30 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xl">
                          {att[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{att}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified Member</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttendee(att)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass rounded-[3rem] p-8 border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Danger Zone</h4>
              <div className="space-y-4">
                {event.status === 'open' && (
                  <button
                    onClick={closeEvent}
                    className="w-full flex items-center justify-between p-4 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                  >
                    <span>Close Registration</span>
                    <XCircle size={16} />
                  </button>
                )}
                <button
                  onClick={deleteEvent}
                  className="w-full flex items-center justify-between p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                >
                  <span>Abort Mission</span>
                  <Trash size={16} />
                </button>
              </div>
            </div>

            <div className="glass rounded-[3rem] p-8 border-white/10 bg-gradient-to-br from-[#ff385c]/5 to-transparent">
              <Sparkles className="text-[#ff385c] mb-4" size={24} />
              <h4 className="font-bold uppercase tracking-tight italic mb-2">Events Pro Tip</h4>
              <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest">Keep your event description punchy and update your location details if they change. Your attendees get real-time notifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganiserEventDetails;
