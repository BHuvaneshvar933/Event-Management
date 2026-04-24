import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Camera, ArrowLeft, Shield, Bell, Sparkles, ArrowRight } from 'lucide-react';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(user?.profileImage || localStorage.getItem('profileImage'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Access Denied</h2>
          <Link to="/login" className="btn-primary">Login to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/dashboard" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Hub</span>
          </Link>
          <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
            <User size={18} />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Profile Settings</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Member <br />
            <span className="text-gradient">Identity.</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-8">
            <div className="glass rounded-[3rem] p-8 border-white/10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff385c] to-[#ff8a00]"></div>
              
              <div className="relative inline-block mb-6 group">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl relative bg-white/5 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-700" size={48} />
                  )}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#ff385c] rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles size={14} className="text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-1">{user.username}</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6">Pioneer Member</p>

              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Settings */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass rounded-[3rem] p-10 border-white/10 space-y-8">
              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 border-b border-white/10 pb-4">Personal Info</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center space-x-4">
                      <Mail className="text-[#ff385c]" size={20} />
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</div>
                        <div className="text-sm font-bold">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center space-x-4">
                      <Shield className="text-[#ff385c]" size={20} />
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Member ID</div>
                        <div className="text-sm font-bold">{user.id || 'EVNT-933'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 border-b border-white/10 pb-4">Preferences</h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-4">
                    <Bell className="text-[#ff385c]" size={20} />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Notifications</div>
                      <div className="text-sm font-bold">Manage your alerts</div>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </section>
            </div>

            <div className="p-8 glass rounded-[3rem] border-white/10 bg-gradient-to-br from-[#ff385c]/5 to-transparent flex items-center justify-between">
              <div>
                <h4 className="font-bold uppercase tracking-tight italic mb-1">Events Pro Status</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Upgrade for zero booking fees</p>
              </div>
              <button className="px-6 py-2 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:scale-105 transition-transform">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
