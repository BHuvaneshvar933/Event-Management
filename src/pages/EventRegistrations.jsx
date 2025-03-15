
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function EventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`/api/events/${id}/registrations`);
      if (!res.ok) throw new Error('Failed to fetch registrations');
      const data = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const handleRemove = async (registrationId) => {
    try {
      const res = await fetch(`/api/events/${id}/registrations/${registrationId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove registration');
      setRegistrations(registrations.filter((reg) => reg._id !== registrationId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-300">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to={`/events/${id}`} className="text-indigo-400 hover:underline">
            &larr; Back to Event Details
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Event Registrations
        </h1>
        {registrations.length === 0 ? (
          <p className="text-center text-gray-400">No registrations found.</p>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">QR Code</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-sm text-gray-300">{reg.user.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{reg.user.email}</td>
                    <td className="py-3 px-4 text-sm">
                      <img src={reg.qrCodeData} alt="QR Code" className="w-16 h-16" />
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleRemove(reg._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventRegistrations;
