import { BrainCircuit, Bot, Database, ArrowRight } from "lucide-react";

const Features = () => (
  <section id="features" className="py-24 bg-[#111318]/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Everything you need to <br />
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            learn english.
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 md:row-span-2 bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-sky-400/30 hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-sky-500/20"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Spaced Repetition</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              We use the Ebbinghaus Forgetting Curve algorithm. The AI schedules
              reviews for each word specifically based on your performance.
            </p>
            <div className="w-full h-40 bg-[#0B0C10]/50 rounded-xl border border-white/5 flex items-end p-4 gap-2">
              <div className="w-1/6 bg-sky-900/50 h-[30%] rounded-t"></div>
              <div className="w-1/6 bg-sky-800/50 h-[45%] rounded-t"></div>
              <div className="w-1/6 bg-sky-700/50 h-[60%] rounded-t"></div>
              <div className="w-1/6 bg-sky-600/50 h-[50%] rounded-t"></div>
              <div className="w-1/6 bg-sky-500/50 h-[80%] rounded-t"></div>
              <div className="w-1/6 bg-sky-400 h-[95%] rounded-t shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-sky-400/30 hover:-translate-y-1 transition-all">
          <Bot className="w-8 h-8 text-sky-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
          <p className="text-sm text-gray-400">
            Practice with AI tutor that knows your vocabulary. Get quizzes,
            examples, and explanations in real-time.
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-sky-400/30 hover:-translate-y-1 transition-all">
          <Database className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Infinite Vocabulary</h3>
          <p className="text-sm text-gray-400">
            Store thousands of words. Search, filter, and export your personal
            dictionary anytime.
          </p>
        </div>

        <div className="md:col-span-3 bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 hover:border-sky-400/30 hover:-translate-y-1 transition-all">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3">Built for Your Growth</h3>
            <p className="text-gray-400">
              Learn at your own pace with examples that match your goals,
              mindset, and ambitions. Every lesson is designed to push you
              forward and help you become more confident every day.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="px-4 py-2 rounded-lg bg-[#0B0C10] border border-white/10 text-sm flex items-center gap-2">
              <span className="text-xs bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">
                EN
              </span>
              Entrepreneur
            </div>
            <ArrowRight className="text-gray-600" />
            <div className="px-4 py-2 rounded-lg bg-[#0B0C10] border border-white/10 text-sm flex items-center gap-2">
              <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                AR
              </span>
              رائد أعمال
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
