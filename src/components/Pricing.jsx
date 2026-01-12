import { UserAuth } from '../Authcontex';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Code, Workflow, Calendar } from "lucide-react";

const Pricing = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Custom Website",
      icon: Code,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/20",
      price: "Custom",
      description: "Need your own platform? Let's build it together",
      features: [
        "Fully customized web application",
        "Your branding & design",
        "Custom features & functionality",
        "Database setup & configuration",
        "AI integration (ChatGPT, Gemini, etc.)",
        "User authentication system",
        "Admin dashboard",
        "Deployment & hosting setup",
        "Source code included",
        "Documentation & training",
        "Free support included",
        "Scalable architecture",
      ],
      buttonText: "Schedule Consultation",
      buttonStyle:
        "bg-sky-600 hover:bg-sky-500 text-white border border-sky-500/50",
      popular: false,
      link: "https://calendar.app.google/pTDNtRU2LLRULVPK7",
      isExternal: true,
    },
    {
      name: "Free Forever",
      icon: Zap,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
      price: "Free",
      description: "Full access to LinguaFlow - No credit card required",
      features: [
        "Unlimited vocabulary words",
        "AI-powered chat assistant",
        "revision practice",
        "Multiple question types (MCQ, Translation, Write)",
        "Progress tracking & statistics",
        "Learning streaks & goals",
        "Score tracking for all sessions",
        "Complete chat history",
        "Secure authentication",
        "Cloud sync across devices",
      ],
      buttonText: "Get Started Free",
      buttonStyle:
        "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]",
      popular: true,
      isLinguaFlow: true, // Flag to identify LinguaFlow plan
    },
    {
      name: "Automation & Integration",
      icon: Workflow,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/20",
      price: "Custom",
      description: "Automate your workflows & integrate systems",
      features: [
        "Workflow automation solutions",
        "API integrations",
        "Third-party service connections",
        "Data synchronization",
        "Automated reporting",
        "Webhook setup & management",
        "Custom bot development",
        "Email automation",
        "Scheduled tasks",
        "Monitoring & alerts",
        "Ongoing optimization",
      ],
      buttonText: "Book a Call",
      buttonStyle:
        "bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/50",
      popular: false,
      link: "https://calendar.app.google/pTDNtRU2LLRULVPK7",
      isExternal: true,
    },
  ];

  const handleButtonClick = (plan) => {
    // If it's the LinguaFlow plan, check session and navigate accordingly
    if (plan.isLinguaFlow) {
      if (session) {
        navigate("/Dashboard");
      } else {
        navigate("/signup");
      }
    } 
    // For other plans, open the calendar link
    else if (plan.isExternal) {
      window.open(plan.link, "_blank");
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Perfect Solution
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Start learning for free, or let us build custom solutions for your
            business
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <div
                key={index}
                className={`relative bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-emerald-500/50 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] md:-mt-4 md:scale-105"
                    : "border-white/10 hover:border-sky-400/30"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                    100% FREE
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${plan.iconBg} flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-7 h-7 ${plan.iconColor}`} />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                  </div>
                  {plan.price === "Custom" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Pricing based on project scope
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleButtonClick(plan)}
                  className={`w-full py-3 rounded-xl font-bold transition-all mb-8 flex items-center justify-center gap-2 ${plan.buttonStyle}`}
                >
                  {plan.isExternal && <Calendar className="w-5 h-5" />}
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Cloud Synced</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm">24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;