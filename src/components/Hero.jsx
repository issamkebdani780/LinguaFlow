import { Zap, PlayCircle, Bot, Mic, CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../Authcontex';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const {session} = UserAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (session) {
      navigate("/Dashboard");
    } else {
      navigate("/signup");
    }
  };
  return (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/3 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-sky-500/30 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-sky-400 uppercase tracking-wide">build better future with English</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Your Personal AI <br />
                <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">English Coach.</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                Stop memorizing lists. Start automating your fluency. Send words to LinguaFlow, and our AI builds your personalized curriculum instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleStart} className="px-8 py-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] cursor-crosshair cursor-pointer">
                  <Zap className="w-5 h-5" />
                  Start Learning Free
                </button>
                {/* <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Watch Demo
                </button> */}
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-full blur-3xl transform scale-75 animate-pulse"></div>
              <div className="relative w-[320px] h-[640px] bg-[#0B0C10] rounded-[3rem] border-8 border-[#111318] shadow-2xl overflow-hidden z-20 animate-[float_6s_ease-in-out_infinite]">
                <div className="bg-[#111318] p-4 flex items-center gap-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                    <Bot className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">LinguaFlow Bot</h3>
                    <p className="text-xs text-sky-400">bot</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 h-full flex flex-col text-sm">
                  <div className="self-end bg-sky-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                    Quiz me on 5 random words from my list
                  </div>
                  <div className="self-start bg-[#1A1D24] text-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[90%] border border-white/5 shadow-lg">
                    <p className="font-semibold text-sky-400 mb-1">Sure! Let’s do this! 😊</p>
                    <p className="mb-2"> Here are five new random words from your list...</p>
                  </div>
                  <div className="self-start bg-[#1A1D24] text-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[90%] border border-white/5 shadow-lg">
                    <p className="flex items-center gap-2 font-semibold text-green-400 mb-1">
                      <CheckCircle className="w-3 h-3" /> Saved to Deck
                    </p>
                  </div>
                  <div className="self-end bg-sky-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg mt-4 animate-pulse">
                    message sent...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  </section>
)};

export default Hero;
