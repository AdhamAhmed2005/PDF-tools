import React from 'react';
import ContentPage from '@/features/content/ui/ContentPage';

export const metadata = {
  title: 'Terms of Use | PDF-tools',
  description: 'Terms and conditions for using PDF-tools.',
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      intro="By using PDF-tools, you agree to the following terms and acceptable use policies."
    >
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
        <p className="text-yellow-700">
          By using PDF-tools, you agree to these terms. Please read them carefully before using our services.
        </p>
      </div>

      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse our services or attempt to interfere with normal operation. You are responsible
        for complying with all applicable laws when using the tools.
      </p>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold text-red-800 mb-3">Prohibited activities include:</h3>
        <ul className="text-red-700 space-y-1">
          <li>• Uploading malware or malicious content</li>
          <li>• Attempting to breach our security measures</li>
          <li>• Using automated tools to abuse rate limits</li>
          <li>• Processing copyrighted material without permission</li>
        </ul>
      </div>

      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your account credentials secure. We may suspend accounts that violate these terms
        or abuse rate limits.
      </p>

      <h2>Intellectual property</h2>
      <p>
        PDF-tools and associated content are protected by applicable intellectual property laws. You retain ownership of your files.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        Our tools are provided on an &quot;as is&quot; basis without warranties of any kind. To the maximum extent permitted by law, we are not liable
        for any indirect or consequential damages arising from use of the service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms periodically. Continued use after changes indicates acceptance of the new terms.
      </p>
    </ContentPage>
  );
}
