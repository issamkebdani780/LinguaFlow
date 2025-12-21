import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../Authcontex';

const Navbar = () => {
  const {session} = UserAuth();
  return (
  <nav className="fixed w-full z-50 border-b border-white/5 bg-[#0B0C10]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                    <Bot className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight">Lingua<span className="text-sky-400">Flow</span></span>
                </div>
                
                <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
                  <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                  <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                  <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>
    
                {
                  session ?
                  <Link to="/dashboard" className="ml-4 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link> : 
                  <div className="flex items-center gap-4">
                  <Link to="/signin" className="text-sky-400 ml-1 hover:underline">
                    <button className="cursor-pointer hidden md:block text-sm font-medium text-gray-300 hover:text-white">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" className="text-sky-400 ml-1 hover:underline">
                    <button  className="cursor-pointer px-5 py-2.5 rounded-full bg-white text-[#0B0C10] font-semibold text-sm hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      Get Started
                    </button>
                  </Link>
                </div>
                }
              </div>
            </div>
  </nav>
)};

export default Navbar;
