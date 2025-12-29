import React from 'react';
import ContentPage from '@/features/content/ui/ContentPage';

export const metadata = {
  title: 'Privacy Policy | PDF-tools',
  description: 'How PDF-tools collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      intro="We design our tools to minimize data collection and respect your privacy."
    >
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Summary</h3>
        <p className="text-blue-700">
          We process your files temporarily, collect minimal analytics, and never sell your personal data. 
          Your privacy matters to us.
        </p>
      </div>

      <h2>Information we collect</h2>
      <p>
        We aim to process files in-memory when possible. If a tool needs to persist output temporarily to provide
        a download link, we store it securely and remove it after a short period. We do not sell personal data.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Types of data we may collect:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <li>• File metadata (name, size, type)</li>
          <li>• Processing timestamps</li>
          <li>• Tool usage statistics</li>
          <li>• Error logs (anonymized)</li>
        </ul>
      </div>

      <h2>Usage analytics</h2>
      <p>
        We may record anonymized usage metrics such as tool name, timestamp, and coarse-grained status
        (e.g., completed/failed) to improve reliability. Signed-in actions may be associated with your account
        to provide history or support.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed by third-party providers. We never store your full payment details on our servers.
      </p>

      <h2>Contact</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-green-800">
          Questions about privacy? Email us at <a href="mailto:hello@example.com" className="font-semibold">hello@example.com</a>.
          We typically respond within 24 hours.
        </p>
      </div>
    </ContentPage>
  );
}
