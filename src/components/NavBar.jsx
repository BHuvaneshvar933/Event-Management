import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard, PlusCircle, Info, PhoneCall, Calendar } from "lucide-react";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", path: "/events", icon: <Calendar size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
    { name: "Contact", path: "/contact", icon: <PhoneCall size={18} /> },
  ];

  if (user) {
    navLinks.unshift(
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Create", path: "/create-event", icon: <PlusCircle size={18} /> }
    );
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`glass rounded-2xl px-6 py-3 flex justify-between items-center transition-all duration-500 ${
          scrolled ? "shadow-2xl border-white/30 bg-black/60 backdrop-blur-3xl" : "border-white/20 bg-black/20 backdrop-blur-xl"
        }`}>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#ff385c] to-[#ff8a00] rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              EVENTS<span className="text-[#ff385c]">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative text-sm font-bold uppercase tracking-widest transition-all hover:text-white ${
                    location.pathname === link.path ? "text-white" : "text-gray-300"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff385c] rounded-full"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/account" 
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-8 text-sm">
                Join Now
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-6"
          >
            <div className="glass rounded-3xl p-6 shadow-2xl border-white/20 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-colors ${
                    location.pathname === link.path 
                      ? "bg-[#ff385c]/10 text-[#ff385c]" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span className="font-semibold">{link.name}</span>
                </Link>
              ))}
              <hr className="border-white/10" />
              {user ? (
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  <User size={18} />
                  <span className="font-semibold">My Account</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center py-4"
                >
                  Join Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
