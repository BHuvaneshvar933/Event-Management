
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const now = new Date();
  const registrationsOpen =
    event &&
    event.status === 'open' &&
    now >= new Date(event.registrationStartDate) &&
    now <= new Date(event.registrationEndDate);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.username) {
      setRegistrationMessage('User information missing. Please log in.');
      return;
    }
    if (!email || !fullName || !phone) {
      setRegistrationMessage('Please fill in all fields.');
      return;
    }
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
      setShowRegisterForm(false);
    } catch (err) {
      console.error(err);
      setRegistrationMessage(err.message);
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!event) return <div className="p-6 text-gray-300">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            {event.title}
          </h1>
          <p className="mt-2 text-center text-gray-400">{event.description}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 border-t border-b border-gray-700 py-4">
          <div className="flex justify-between">
            <span className="font-medium">Event Date:</span>
            <span>{new Date(event.date).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Location:</span>
            <span>{event.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Category:</span>
            <span>{event.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Organizer Contact:</span>
            <span>{event.organizerContact}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Registration Window:</span>
            <span>
              {new Date(event.registrationStartDate).toLocaleString()} –{' '}
              {new Date(event.registrationEndDate).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span>
              {event.status === 'open'
                ? registrationsOpen
                  ? 'Open for registration'
                  : 'Registrations closed'
                : 'Closed'}
            </span>
          </div>
        </div>

        <div className="mt-8">
          {registrationsOpen ? (
            !showRegisterForm ? (
              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-md transition"
              >
                Register for Event
              </button>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-400">Username</label>
                  <input
                    type="text"
                    value={user ? user.username : ''}
                    readOnly
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-400">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-400">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-400">Your Email</label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-md transition"
                >
                  Register
                </button>
                {registrationMessage && (
                  <p className="mt-2 text-center text-red-400">{registrationMessage}</p>
                )}
              </form>
            )
          ) : (
            <div className="mt-4 text-center text-gray-500">Registrations closed</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
