
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function OrganiserEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Event not found');
        }
        const data = await res.json();
        setEvent(data);
        setFormData({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          category: data.category,
          organizerContact: data.organizerContact,
          registrationStartDate: data.registrationStartDate,
          registrationEndDate: data.registrationEndDate,
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

  const updateEvent = async () => {
    try {
      const updatedData = { ...formData, organizer: event.organizer };
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
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
    }
  };

  const closeEvent = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/close`, {
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
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizer: event.organizer })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete event');
      }
      setMessage('Event deleted successfully');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const removeAttendee = async (attendee) => {
    try {
      const updatedAttendees = event.attendees.filter(a => a !== attendee);
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
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
      const delRes = await fetch(`http://localhost:5000/api/registrations?eventId=${id}&user=${attendee}`, {
        method: 'DELETE'
      });
      if (!delRes.ok) {
        const delErr = await delRes.json();
        throw new Error(delErr.error || 'Failed to cancel registration');
      }
      setMessage(`Registration for ${attendee} cancelled`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!event) return <div className="p-6 text-gray-300">Loading event details...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Manage Your Event
        </h1>
        {message && <p className="mb-4 text-center text-green-400">{message}</p>}
        
        {!editMode ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-200">{event.title}</h2>
            <p className="text-gray-400 mt-2">{event.description}</p>
            <div className="mt-4 space-y-2 text-gray-400">
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Organizer Contact:</strong> {event.organizerContact}</p>
              <p>
                <strong>Registration Window:</strong> {new Date(event.registrationStartDate).toLocaleString()} to {new Date(event.registrationEndDate).toLocaleString()}
              </p>
              <p><strong>Status:</strong> {event.status === 'open' ? 'Open for registration' : 'Closed'}</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded hover:from-indigo-600 hover:to-purple-600 transition"
              >
                Edit Event
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-300">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Event Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Event Date &amp; Time</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Event Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Organizer Contact</label>
              <input
                type="text"
                name="organizerContact"
                value={formData.organizerContact}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Registration Start Date &amp; Time</label>
              <input
                type="datetime-local"
                name="registrationStartDate"
                value={formData.registrationStartDate}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-300">Registration End Date &amp; Time</label>
              <input
                type="datetime-local"
                name="registrationEndDate"
                value={formData.registrationEndDate}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={updateEvent}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-md transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Attendees ({attendees.length})</h3>
          {attendees.length === 0 ? (
            <p className="text-gray-400">No attendees yet.</p>
          ) : (
            <ul className="space-y-2">
              {attendees.map((att, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <span className="text-gray-200">{att}</span>
                  <button
                    onClick={() => removeAttendee(att)}
                    className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex space-x-4">
          {event.status === 'open' && (
            <button
              onClick={closeEvent}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md transition"
            >
              Close Event
            </button>
          )}
          <button
            onClick={deleteEvent}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-md transition"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrganiserEventDetails;
