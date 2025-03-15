
import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-16 px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Contact <span>Us</span>
        </h1>
        <p className="text-lg text-gray-400 text-center mb-12">
          Have questions or need assistance? Reach out to us, and we'll be happy to help!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-200">
                Our <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Location</span>
              </h2>
              <p className="text-gray-400">123 Fitness Lane, Workout City, USA</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-200">
                Customer <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Support</span>
              </h2>
              <p className="text-gray-400">Email: support@eventpro.com</p>
              <p className="text-gray-400">Phone: +1 234 567 890</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-300">Your Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-300">Your Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-300">Your Message</label>
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition text-white font-bold rounded-lg shadow"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
