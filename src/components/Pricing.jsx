// src/components/Pricing.jsx
import React, { useState } from 'react';
import { Check, Zap, Sparkles, Crown } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      icon: Zap,
      iconColor: 'text-gray-400',
      iconBg: 'bg-gray-500/20',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out LinguaFlow',
      features: [
        '50 words per month',
        'Basic AI definitions',
        'Spaced repetition reviews',
        'Text-based learning',
        'Mobile access via Telegram',
        'Community support'
      ],
      limitations: [
        'No voice analysis',
        'No advanced AI features',
        'Limited vocabulary storage'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white',
      popular: false
    },
    {
      name: 'Pro',
      icon: Sparkles,
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-500/20',
      price: { monthly: 9.99, yearly: 99 },
      description: 'For serious learners who want results',
      features: [
        'Unlimited words',
        'Advanced AI definitions & examples',
        'Voice pronunciation analysis',
        'Personalized learning path',
        'Priority support',
        'Export vocabulary (CSV, PDF)',
        'Detailed progress analytics',
        'Custom review schedules'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)]',
      popular: true
    },
    {
      name: 'Lifetime',
      icon: Crown,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      price: { monthly: 199, yearly: 199 },
      description: 'One-time payment, lifetime access',
      features: [
        'Everything in Pro',
        'Lifetime updates',
        'Premium AI models',
        'Unlimited voice analysis',
        'Early access to new features',
        'VIP support',
        'Personal AI tutor customization',
        'API access for developers'
      ],
      limitations: [],
      buttonText: 'Get Lifetime Access',
      buttonStyle: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)]',
      popular: false,
      isLifetime: true
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Choose Your <span> </span>
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Learning Plan
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Start free, upgrade when you're ready. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-[#1A1D24]/60 border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.isLifetime ? plan.price.monthly : plan.price[billingCycle];
            
            return (
              <div
                key={index}
                className={`relative bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'border-sky-500/50 shadow-[0_0_50px_-12px_rgba(14,165,233,0.3)] md:-mt-4 md:scale-105'
                    : 'border-white/10 hover:border-sky-400/30'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-sky-600 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${plan.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${plan.iconColor}`} />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">
                      ${price}
                    </span>
                    {!plan.isLifetime && (
                      <span className="text-gray-400">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && !plan.isLifetime && plan.name !== 'Free' && (
                    <p className="text-xs text-gray-500 mt-1">
                      ${(price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                  {plan.isLifetime && (
                    <p className="text-xs text-yellow-400 mt-1">
                      One-time payment • Forever yours
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-xl font-bold transition-all mb-8 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    What's Included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations (for Free plan) */}
                  {plan.limitations.length > 0 && (
                    <ul className="space-y-3 pt-4 border-t border-white/5">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 flex-shrink-0 text-gray-600 mt-0.5">×</span>
                          <span className="text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>        
      </div>
    </section>
  );
};

export default Pricing;