import SignupForm from '@/components/SignupForm';

export const metadata = {
  title: 'Sign Up - PDFCentral',
  description: 'Create a PDFCentral account to manage, edit, and organize your PDFs securely and efficiently.',
  robots: 'noindex, nofollow', 
  openGraph: {
    title: 'Sign Up - PDFCentral',
    description: 'Create a PDFCentral account to manage, edit, and organize your PDFs securely and efficiently.',
    url: 'https://pdfcentral.com/signup',
    siteName: 'PDFCentral',
    images: [
      {
        url: 'https://pdfcentral.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up - PDFCentral',
    description: 'Create a PDFCentral account to manage, edit, and organize your PDFs securely and efficiently.',
    images: ['https://pdfcentral.com/twitter-image.png'],
  },
};


export default function SignupPage() {
  return (
	<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
	  <div className="w-full max-w-lg">
		<div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
		  <h1 className="text-2xl font-extrabold text-gray-900">Create account</h1>
		  <p className="mt-2 text-sm text-gray-600">Sign up to unlock premium features and sync your settings.</p>

		  <SignupForm />

		</div>
	  </div>
	</div>
  );
}

