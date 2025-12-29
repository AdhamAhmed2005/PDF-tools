import React from 'react';

const Footer = ({ logoText = 'PDF Central' }) => {
  const toolLinks = [
    { name: 'Merge PDF', href: '/merge' },
    { name: 'Compress PDF', href: '/compress' },
    { name: 'PDF to Word', href: '/pdftoword' },
    { name: 'All Tools', href: '/tools' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Premium Plan', href: '/premium' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Help Center', href: '/help' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-12">
      {/* --- 1. Top CTA Section (Optional but Recommended) --- */}
      

      {/* --- 2. Main Footer Grid --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          
          {/* Section A: Logo and Mission */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-3xl font-bold text-teal-700 mb-4">
              {logoText}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your centralized hub for secure, fast, and free PDF management. Built for efficiency.
            </p>
            <div className="flex space-x-4 mt-4">
                {/* Placeholder for Social Icons */}
                <a href="#" className="text-gray-400 hover:text-teal-700 transition">
                    {/* Placeholder SVG for Facebook */}
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"></svg> 
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-700 transition">
                    {/* Placeholder SVG for Twitter */}
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"></svg>
                </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Tools</h4>
            <ul className="space-y-3">
              {toolLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-teal-700 text-sm transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-teal-700 text-sm transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal & Support</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-teal-700 text-sm transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {logoText}. All rights reserved. 
            <span className="ml-2 hidden sm:inline">| Built with security and speed in mind.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;