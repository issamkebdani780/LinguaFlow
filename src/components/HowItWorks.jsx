import { Send, Cpu, RefreshCw } from 'lucide-react';

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Effortless Workflow</h2>
            <p className="text-gray-400 max-w-xl mx-auto">No complex apps to navigate. Just chat with the bot, and our automation engine handles the heavy lifting.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/30 to-sky-500/0 border-t border-dashed border-gray-600 z-0"></div>
            
            <div className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-[#111318] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(56,189,248,0.3)] group-hover:border-sky-500/50 transition-colors">
                <Send className="w-10 h-10 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Send a Word</h3>
              <p className="text-sm text-gray-400 px-4">Encounter a new word? Just type it or send a voice note to the Telegram bot.</p>
            </div>
            
            <div className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-[#111318] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] group-hover:border-purple-500/50 transition-colors">
                <Cpu className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-gray-400 px-4">Our engine defines it, finds examples, generates audio, and categorizes it.</p>
            </div>
            
            <div className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-[#111318] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)] group-hover:border-green-500/50 transition-colors">
                <RefreshCw className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Auto-Review</h3>
              <p className="text-sm text-gray-400 px-4">Receive smart quizzes and reviews exactly when you're about to forget.</p>
            </div>
          </div>
        </div>
  </section>
);

export default HowItWorks;
