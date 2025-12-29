"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const Navbar = ({ logoText = 'PDF Central' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Tools', href: '/tools' },
    { name: 'Help', href: '/help' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-teal-700 hover:text-teal-600">
              {logoText}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-teal-700 text-base font-medium transition duration-150"
              >
                {link.name}
              </Link>
            ))}
            
            <Link href={"/signin"} className="px-4 py-2 border border-teal-700 text-teal-700 bg-white rounded-md 
                               hover:bg-teal-50 transition duration-150 font-semibold text-sm">
              Log In
            </Link>
            <Link href={"/signup"} className="px-4 py-2 border border-transparent bg-teal-700 text-white rounded-md 
                               hover:bg-teal-600 shadow-lg shadow-teal-500/50 transition duration-150 font-semibold text-sm">
              Sign Up
            </Link>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-700 
                         focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2 px-3">
                <button className="w-full px-4 py-2 border border-teal-700 text-teal-700 bg-white rounded-md 
                                   hover:bg-teal-50 transition duration-150 font-semibold text-sm">
                  Log In
                </button>
                <button className="w-full px-4 py-2 border border-transparent bg-teal-700 text-white rounded-md 
                                   hover:bg-teal-600 shadow-lg shadow-teal-500/50 transition duration-150 font-semibold text-sm">
                  Sign Up
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
