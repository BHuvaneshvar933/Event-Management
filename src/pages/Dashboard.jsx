import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, loading } = useAuth();
  const username = user ? user.username.trim().toLowerCase() : '';

  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('organized');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;
    const fetchOrganized = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/mine?username=${username}`);
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
        const res = await fetch(`http://localhost:5000/api/registrations?username=${username}`);
        if (!res.ok) throw new Error("Error fetching registrations");
        const data = await res.json();
        setRegistrations(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (activeTab === "organized") {
      fetchOrganized();
    } else {
      fetchRegistrations();
    }
  }, [activeTab, username]);

  if (loading) return <div className="p-4 text-center text-gray-300">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Dashboard
      </h1>
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("organized")}
          className={`px-6 py-3 rounded-md transition ${
            activeTab === "organized"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          My Organized Events
        </button>
        <button
          onClick={() => setActiveTab("registrations")}
          className={`px-6 py-3 rounded-md transition ${
            activeTab === "registrations"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          My Registrations
        </button>
      </div>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {activeTab === "organized" ? (
        organizedEvents.length === 0 ? (
          <p className="text-center text-gray-400">You have not organized any events yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizedEvents.map((event) => (
              <li
                key={event._id}
                className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <Link
                  to={`/organiser/${event._id}`}
                  className="block text-2xl font-semibold mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text hover:underline"
                >
                  {event.title}
                </Link>
                <p className="text-gray-400 mb-2">{new Date(event.date).toLocaleString()}</p>
                <p className="text-gray-400">{event.location}</p>
              </li>
            ))}
          </ul>
        )
      ) : registrations.length === 0 ? (
        <p className="text-center text-gray-400">You have not registered for any events yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <li
              key={reg.registration._id}
              className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <Link
                to={`/ticket/${reg.registration._id}`}
                className="block text-2xl font-semibold mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text hover:underline"
              >
                {reg.event.title}
              </Link>
              <p className="text-gray-400">{new Date(reg.event.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
