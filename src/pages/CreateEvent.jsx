
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [organizerContact, setOrganizerContact] = useState('');
  const [registrationStartDate, setRegistrationStartDate] = useState('');
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.username) {
      setError('User information missing. Please log in.');
      return;
    }

    const eventData = {
      title,
      description,
      date,
      location,
      organizer: user.username.trim().toLowerCase(),
      category,
      organizerContact,
      registrationStartDate,
      registrationEndDate,
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
      await res.json();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-800 text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Create New Event
        </h2>
        {error && <div className="text-red-400 mb-6 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-300">Event Title</label>
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Event Description</label>
            <textarea
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Event Date &amp; Time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Location</label>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Event Category (e.g., Music, Tech)</label>
            <input
              type="text"
              placeholder="Event Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Organizer Contact Info (e.g., Phone)</label>
            <input
              type="text"
              placeholder="Organizer Contact Info"
              value={organizerContact}
              onChange={(e) => setOrganizerContact(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Registration Start Date &amp; Time</label>
            <input
              type="datetime-local"
              placeholder="Registration Start Date"
              value={registrationStartDate}
              onChange={(e) => setRegistrationStartDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-300">Registration End Date &amp; Time</label>
            <input
              type="datetime-local"
              placeholder="Registration End Date"
              value={registrationEndDate}
              onChange={(e) => setRegistrationEndDate(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-lg shadow transition duration-300"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
