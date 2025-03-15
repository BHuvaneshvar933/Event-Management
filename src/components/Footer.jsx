import React from 'react';

const Footer = () => (
  <footer className="border-t-[1px]  p-4   w-full  bg-gray-800 text-gray-300 border-neutral-700/80">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} EventPro. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
