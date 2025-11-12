import React from 'react';
import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export const metadata = {
  title: 'Help Center | PDF-tools',
  description: 'FAQs and support resources for PDF-tools.',
};

export default function HelpPage() {
  return (
    <ContentPage
      title="Help Center"
      intro="Find answers to common questions and ways to get support."
    >
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Need quick help?</h3>
        <p className="text-blue-700">
          Check our FAQ below or reach out to our support team. We're here to help you get the most out of PDF-tools.
        </p>
      </div>

      <h2>Frequently asked questions</h2>
      
      <div className="space-y-6 my-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Where do I download my file?</h3>
          <p className="text-gray-700">After conversion, you will be redirected to a result page with a download button.</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">My download expired.</h3>
          <p className="text-gray-700">Downloads are available for 30 minutes. Re-run the tool or contact support with your details.</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Why is there a usage limit?</h3>
          <p className="text-gray-700">Free tier has a daily cap to ensure fair access. Upgrading removes limits and adds priority processing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">💬 Contact Support</h3>
          <p className="text-green-700 mb-4">Get personalized help from our team.</p>
          <Link href="/contact" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Send Message
          </Link>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📧 Email Us</h3>
          <p className="text-blue-700 mb-4">Direct email for technical questions.</p>
          <a href="mailto:support@example.com" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            support@example.com
          </a>
        </div>
      </div>

      <h2>Developer docs</h2>
      <p>
        For integration details, see our README and API routes in the repository.
      </p>
    </ContentPage>
  );
}
