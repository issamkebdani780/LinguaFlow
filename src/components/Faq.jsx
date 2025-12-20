// src/components/FAQ.jsx
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does LinguaFlow AI work?",
      answer: "Simply send any English word or phrase to our Telegram bot. Our AI instantly provides definitions, pronunciation, examples, and saves it to your personalized deck. The system then schedules reviews using spaced repetition to ensure long-term retention."
    },
    {
      question: "Do I need to download an app?",
      answer: "No! LinguaFlow works entirely through Telegram, which you probably already have. Just start a chat with our bot and you're ready to learn. No additional apps, logins, or complex setups required."
    },
    {
      question: "What makes LinguaFlow different from other learning apps?",
      answer: "Unlike traditional apps with pre-made content, LinguaFlow builds YOUR curriculum based on words YOU encounter. Our AI adapts examples to your region, career, and learning style. Plus, it's completely automated - no manual flashcard creation needed."
    },
    {
      question: "Can I use voice messages?",
      answer: "Absolutely! Send voice notes to practice pronunciation and our AI will analyze your speech, provide instant feedback, and help you improve. It's like having a personal pronunciation coach available 24/7."
    },
    {
      question: "How does the spaced repetition work?",
      answer: "We use the scientifically-proven Ebbinghaus Forgetting Curve algorithm. The AI tracks your performance on each word and schedules reviews at optimal intervals - right before you're about to forget. This maximizes retention with minimal effort."
    },
    {
      question: "Is there a free plan?",
      answer: "Yes! Our free plan includes 50 words per month, basic AI definitions, and spaced repetition reviews. Perfect for casual learners. Upgrade anytime for unlimited words, voice analysis, and advanced features."
    },
    {
      question: "What languages does LinguaFlow support?",
      answer: "Currently, we focus on English learning with support for Arabic, French, and Spanish speakers. Our AI provides translations and examples tailored to your native language and cultural context."
    },
    {
      question: "Can I export my vocabulary list?",
      answer: "Yes! You can export your entire vocabulary database anytime in CSV, PDF, or Anki-compatible formats. Your learning data is always yours to keep and use however you like."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-sky-500/30 mb-6">
            <span className="text-xs font-medium text-sky-400 uppercase tracking-wide">
              Got Questions?
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Frequently Asked <br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about LinguaFlow AI. Can't find what you're looking for? 
            <a href="#" className="text-sky-400 hover:text-sky-300 ml-1">Contact our support team</a>.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-400/30"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180 bg-sky-500/30' : ''
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-sky-400" />
                  )}
                </div>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;