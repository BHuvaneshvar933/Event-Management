import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
  };

  if (!user) {
    return <p className="text-center text-xl text-gray-300">Please log in to view your account.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6">
      <div className="max-w-lg w-full bg-gray-800 text-white p-8 rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-6">
          Your <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Account</span>
        </h1>

        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <img
              src={profileImage || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
            />
            <label className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full p-2 cursor-pointer transition duration-200">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <span className="text-white text-xl font-bold">+</span>
            </label>
            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full p-2 cursor-pointer transition duration-200"
              >
                <span className="text-white text-lg font-bold">-</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-400 mt-2">{user.email}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
