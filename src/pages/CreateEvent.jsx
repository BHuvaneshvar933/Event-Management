import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Calendar, MapPin, Tag, Phone, Type, AlignLeft, ArrowLeft, Loader2, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';

function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [organizerContact, setOrganizerContact] = useState('');
  const [image, setImage] = useState('');
  const [registrationStartDate, setRegistrationStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageProcessing(true);
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image is too large. Please select an image under 10MB.');
        setIsImageProcessing(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image if needed using a canvas
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          setImage(compressedBase64);
          setError('');
          setIsImageProcessing(false);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!user || !user.username) {
      setError('User information missing. Please log in.');
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      title,
      description,
      date: new Date(date).toISOString(),
      location,
      organizer: user.username.trim().toLowerCase(),
      category,
      organizerContact,
      registrationStartDate: new Date(registrationStartDate).toISOString(),
      registrationEndDate: new Date(registrationEndDate).toISOString(),
      image
    };

    try {
      const res = await fetch('https://event-backend-utqn.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create event');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        <div className="mb-12">
          <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
            <Sparkles size={18} />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Organiser Lab</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Host a New <br />
            <span className="text-gradient">Experience.</span>
          </h1>
        </div>

        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 font-bold mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Basics */}
          <div className="space-y-8 glass rounded-[3rem] p-10 border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b border-white/10 pb-4 mb-6">Event Details</h3>
            
            <div className="space-y-6">
              {/* Poster Upload */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Event Poster</label>
                <div className="relative group">
                  <div className="w-full aspect-video rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ff385c]/50">
                    {image ? (
                      <img src={image} alt="Poster Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="text-gray-600 mb-2" size={32} />
                        <span className="text-[10px] font-bold uppercase text-gray-500">Upload Poster</span>
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
                    placeholder="Neon Night Music Festival"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Description</label>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-6 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                  <textarea
                    placeholder="Describe the vibe, the line-up, and why people should come..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700 h-32"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Category</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Music"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Contact</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="+91..."
                      value={organizerContact}
                      onChange={(e) => setOrganizerContact(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Logistics */}
          <div className="space-y-8 glass rounded-[3rem] p-10 border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b border-white/10 pb-4 mb-6">Logistics & Timing</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="The Arena, NYC"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Event Date & Time</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff385c] transition-colors" size={18} />
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (!registrationEndDate) setRegistrationEndDate(e.target.value);
                    }}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                  />
                </div>
              </div>

              <hr className="border-white/10" />

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Registration Window (Starts)</label>
                <input
                  type="datetime-local"
                  value={registrationStartDate}
                  onChange={(e) => setRegistrationStartDate(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Registration Window (Ends)</label>
                <input
                  type="datetime-local"
                  value={registrationEndDate}
                  onChange={(e) => setRegistrationEndDate(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-8">
            <button
              type="submit"
              disabled={isSubmitting || isImageProcessing}
              className="btn-primary w-full py-6 text-2xl uppercase italic tracking-tighter font-black flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>
                  <Plus className="mr-2" size={28} />
                  {isImageProcessing ? 'Processing Image...' : 'Launch Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
