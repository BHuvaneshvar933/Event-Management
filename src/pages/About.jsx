import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 bg-gray-900 text-gray-200">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-center">
          About Us
        </h1>
        
        <p className="text-lg mb-6 leading-relaxed">
          Welcome to <span className="text-indigo-400 font-semibold">EventManager</span>, your one-stop solution for managing and discovering events in your area. Our platform connects event organizers with enthusiastic participants, making it easier than ever to host and attend memorable events.
        </p>

        <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 bg-opacity-10">
          <h2 className="text-3xl font-semibold text-indigo-400 mb-3">Our Mission</h2>
          <p className="mb-4">
            Our mission is to empower organizers to create and manage events effortlessly while providing participants with a seamless registration and ticketing experience. We strive to bring people together by simplifying the event management process.
          </p>
        </div>

        <h2 className="text-3xl font-semibold text-purple-400 mt-8 mb-3">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>User-friendly event creation and management tools</li>
          <li>Seamless registration process with unique QR code tickets</li>
          <li>Real-time event updates and notifications</li>
          <li>A vibrant community of event enthusiasts</li>
        </ul>

        <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 bg-opacity-10 mt-8">
          <h2 className="text-3xl font-semibold text-indigo-400 mb-3">Our Story</h2>
          <p className="mb-4">
            Founded in 2023, <span className="text-purple-400 font-semibold">EventManager</span> was created with the vision of revolutionizing the event management landscape. What started as a small project has now grown into a comprehensive platform trusted by thousands of organizers and participants.
          </p>
          <p className="font-semibold">
            Join us in creating unforgettable experiences and connecting communities through events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
