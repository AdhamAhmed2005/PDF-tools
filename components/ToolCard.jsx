import React from 'react';
import Link from "next/link";


const COLOR_MAP = {
  merge: 'bg-red-600 text-white',
  split: 'bg-orange-500 text-white',
  compress: 'bg-blue-600 text-white',
  word: 'bg-indigo-600 text-white',
  edit: 'bg-green-600 text-white',
  utility: 'bg-gray-700 text-white',
};

const ToolCard = ({
  icon: IconComponent, // Accepts a React component for the icon (e.g., from Heroicons)
  title,
  description,
  href,
  color = 'utility', // Default color if not specified
}) => {
  // Get the Tailwind classes for the icon background
  const iconClasses = COLOR_MAP[color] || COLOR_MAP.utility;
  
  // Determine if the card should use the premium amber highlight
  const isPremium = color === 'premium';
  const cardBorder = isPremium 
    ? 'border-2 border-amber-400 shadow-xl' 
    : 'border border-gray-100 hover:border-teal-400 hover:shadow-lg';

  // Fallback for premium color classes
  const premiumIconClasses = isPremium ? 'bg-amber-400 text-teal-900' : '';

  return (
    <Link
      href={href}
      // Card Container: Subtle shadow, rounded edges, and hover effects
      className={`
        flex flex-col items-center p-6 bg-white rounded-xl transition duration-300 transform 
        hover:-translate-y-1 group ${cardBorder}
      `}
    >
      {/* 1. Icon Container (The Visual Differentiator) */}
      <div 
        className={`
          w-16 h-16 rounded-full flex items-center justify-center mb-4 
          ${isPremium ? premiumIconClasses : iconClasses}
          ${isPremium ? '' : 'group-hover:ring-4 group-hover:ring-teal-100'}
        `}
      >
        {/* Render the passed-in Icon component */}
        {/* We assume the icon component takes a size class like 'w-8 h-8' */}
        {IconComponent && <IconComponent className="w-8 h-8" />}
      </div>

      {/* 2. Title & Description */}
      <h3 
        className={`text-xl font-bold mb-2 text-center transition duration-300 
                    ${isPremium ? 'text-teal-900' : 'text-gray-900 group-hover:text-teal-700'}`}
      >
        {title}
        {/* Optional: Premium Tag */}
        {isPremium && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                PRO
            </span>
        )}
      </h3>
  
      <p className="text-sm text-gray-500 text-center">
        {description}
      </p>

    </Link>
  );
};

export default ToolCard;