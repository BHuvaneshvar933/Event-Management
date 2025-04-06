import React from 'react';
import home from "../assets/background.jpg";

const Home = () => (
  <div
    className="relative bg-cover bg-center h-dvh bg-gray-900"
    style={{ backgroundImage: `url(${home})` }} 
  >
   
    <div className="absolute inset-0 bg-gradient-to-r from-black to-neutral-900  opacity-65"></div>

    <div className="relative container mx-auto p-8 text-center text-white">
      <h1 className="text-7xl  font-bold mt-36">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition text-transparent bg-clip-text">
          EventPro
        </span>
      </h1>
      <p className="text-lg mb-6 text-gray-300 mt-2">
        Discover, manage, and enjoy events like never before. Your ultimate event management solution is here!
      </p>
      <link to"/events">
      <a
        href="/events"
        className="py-2 px-4 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition"
      >
        Discover Events
      </a>
      </Link>
      </div>
    </div>
  </div>
);

export default Home;
