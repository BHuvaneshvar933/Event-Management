import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Account from './pages/Account';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import AllEvents from './pages/AllEvents';
import EventRegistrations from './pages/EventRegistrations';
import Ticket from './pages/Ticket';
import OrganiserEventDetails from './pages/OrganiserEventDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/organiser/:id" element={
          <ProtectedRoute>
            <OrganiserEventDetails />
          </ProtectedRoute>
        } />
        <Route path="/events/:id/registrations" element={
          <ProtectedRoute>
            <EventRegistrations />
          </ProtectedRoute>
        } />
        <Route path="/ticket/:registrationId" element={
          <ProtectedRoute>
            <Ticket />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
