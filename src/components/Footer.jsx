// src/components/Footer.jsx
import { UserAuth } from '../Authcontex';
import { Bot, Mail, Send, Linkedin, Github, Calendar } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = ({ openModal }) => {
  const currentYear = new Date().getFullYear();

  const { session } = UserAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (session) {
      navigate("/Dashboard");
    } else {
      navigate("/signup");
    }
  };

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    resources: [
      {
        name: "Contact",
        href: "https://wa.me/213781243966",
        external: true,
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/issam-kebdani-8b6154334",
        external: true,
      },
      {
        name: "TikTok",
        href: "https://www.tiktok.com/@linguaflow.ai",
        external: true,
      },
    ],
  };

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/issam-kebdani-8b6154334",
      label: "LinkedIn",
    },
    {
      icon: FaTiktok,
      href: "https://www.tiktok.com/@linguaflow.ai?is_from_webapp=1&sender_device=pc",
      label: "TikTok",
    },
    {
      icon: Calendar,
      href: "https://calendar.app.google/pTDNtRU2LLRULVPK7",
      label: "Schedule Call",
    },
  ];

  return (
    <footer className="relative bg-[#0B0C10] border-t border-white/5 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(56,189,248,0.05)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                <Bot className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Lingua<span className="text-sky-400">Flow</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Your personal AI-powered English learning platform. Build
              vocabulary, practice with AI, and track your progress.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4 text-sky-400" />
              <a
                href="mailto:kebdaniissam780@gmail.com"
                className="hover:text-sky-400 transition-colors"
              >
                kebdaniissam780@gmail.com
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-sky-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* connect Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Connect
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-sky-400 transition-colors text-sm"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & CTA */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/50 flex items-center justify-center text-gray-400 hover:text-sky-400 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-full bg-white text-[#0B0C10] font-semibold text-sm hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              Start Learning Free
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} LinguaFlow. Built by{" "}
              <a
                href="https://www.linkedin.com/in/issam-kebdani-8b6154334"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300"
              >
                Issam Kebdani
              </a>
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-400">
                  Let's build something together
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
