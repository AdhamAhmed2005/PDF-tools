import React from 'react';

// Server Component - Enhanced shared layout for content pages
// This component runs entirely on the server for optimal performance
export default function ContentPage({ title, intro, children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <header className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {title}
            </h1>
            {intro && (
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {intro}
              </p>
            )}
          </header>
        </div>
      </div>

      {/* Content Section */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <article className="prose prose-lg prose-slate max-w-none p-8 md:p-12 
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-gray-200 [&_h2:first-child]:mt-0
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-8 [&_h3]:mb-4
            [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-6
            [&_ul]:space-y-3 [&_ul]:mb-6
            [&_li]:text-gray-700 [&_li]:leading-relaxed
            [&_a]:text-blue-600 [&_a]:font-medium [&_a]:hover:text-blue-700 [&_a]:hover:underline [&_a]:transition-colors
            [&_strong]:font-semibold [&_strong]:text-gray-900">
            {children}
          </article>
        </div>

        {/* Footer CTA - Server-rendered static content */}
        <div className="mt-12 text-center">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-3">Questions or feedback?</h3>
            <p className="text-blue-100 mb-6">We're here to help. Reach out anytime.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/help" 
                className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
