import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events');
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Error fetching events');
        }
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-300">Loading events...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  if (!events || events.length === 0) {
    return <div className="p-6 text-center text-gray-300">No events found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        All Hosted Events
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <li
            key={event._id}
            className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition duration-200"
          >
            <h2 className="text-2xl font-semibold text-gray-100 mb-2">
              {event.title}
            </h2>
            <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
            <div className="text-gray-400 text-sm mb-2">
              <strong>Date:</strong> {new Date(event.date).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm mb-2">
              <strong>Location:</strong> {event.location}
            </div>
            <div className="text-gray-400 text-sm mb-4">
              <strong>Organized by:</strong> {event.organizer}
            </div>
            <Link
              to={`/events/${event._id}`}
              className="inline-block px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition text-white"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllEvents;
