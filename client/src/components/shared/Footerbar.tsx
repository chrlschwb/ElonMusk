import React from 'react';

const FooterBar = () => {
  return (
    <div className="bg-orange-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-center md:text-left mb-4 md:mb-0">© 2022 My Website. All rights reserved.</p>
          <ul className="flex items-center">
            <li className="mx-4">
              <a href="#" className="text-white hover:text-gray-800 font-bold">
                About Us
              </a>
            </li>
            <li className="mx-4">
              <a href="#" className="text-white hover:text-gray-800 font-bold">
                Contact Us
              </a>
            </li>
            <li className="mx-4">
              <a href="#" className="text-white hover:text-gray-800 font-bold">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterBar;
