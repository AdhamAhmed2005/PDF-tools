'use client';

import { plans } from '@/data/plans';
import { useState } from 'react';

export default function PricingPage() {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (plan) => {
    if (plan.price === '$0') {
      // Free plan - just navigate to tools
      window.location.href = plan.ctaLink;
      return;
    }

    setLoading(plan.name);

    try {
      // Extract numeric amount from price string (e.g., "$9" -> 9)
      const amount = parseFloat(plan.price.replace('$', ''));

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: plan.name,
          amount: amount,
        }),
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // Redirect to ARB payment gateway
        window.location.href = result.paymentUrl;
      } else {
        alert(result.message || 'Failed to initiate payment. Please try again.');
        setLoading(null);
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('An error occurred. Please try again.');
      setLoading(null);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-teal-600 transform scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="inline-flex rounded-full bg-teal-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-xl font-medium text-gray-500">/{plan.period}</span>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-teal-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={loading === plan.name}
                  className={`block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {loading === plan.name ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need help choosing a plan?{' '}
            <a href="/contact" className="text-teal-600 hover:text-teal-700 font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
