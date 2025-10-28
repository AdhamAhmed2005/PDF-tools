
import SigninForm from '@/components/SigninForm';

// app/signin/page.jsx
export const metadata = {
  title: 'Sign In - PDFCentral',
  description: 'Sign in to your PDFCentral account to access and manage your PDFs.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Sign In - PDFCentral',
    description: 'Sign in to access your PDFs securely.',
    url: 'https://pdfcentral.com/signin',
    siteName: 'PDFCentral',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In - PDFCentral',
    description: 'Sign in to access your PDFs securely.',
  },
};


export default function SigninPage() {
  // Server component: render page shell and client form component for interactivity
  return (
	<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
	  <div className="w-full max-w-md">
		<div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
		  <h1 className="text-2xl font-extrabold text-gray-900">Sign in</h1>
		  <p className="mt-2 text-sm text-gray-600">Welcome back — sign in to access your tools and settings.</p>

		  <SigninForm />

		</div>
	  </div>
	</div>
  );
}
