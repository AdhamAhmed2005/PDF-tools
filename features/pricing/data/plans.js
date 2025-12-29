export const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out our PDF tools',
    features: [
      '5 tool uses per device',
      'All PDF tools access',
      'Basic file processing',
      'No credit card required',
    ],
    cta: 'Get Started',
    ctaLink: '/tools',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9',
    period: 'per month',
    description: 'Unlimited access to all PDF tools',
    features: [
      'Unlimited tool uses',
      'All PDF tools access',
      'Priority processing',
      'Advanced features',
      'Email support',
      'No ads',
    ],
    cta: 'Upgrade Now',
    ctaLink: '/signup',
    popular: true,
  },
];
