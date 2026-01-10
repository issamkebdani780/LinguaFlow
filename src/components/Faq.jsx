// src/components/FAQ.jsx
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does LinguaFlow work?",
      answer: "LinguaFlow is a web-based vocabulary learning platform. Create an account, add English words with Arabic translations, practice with our AI chat assistant, and test your knowledge with revision exercises. All your progress is automatically saved and synced across devices."
    },
    {
      question: "Do I need to download an app?",
      answer: "No! LinguaFlow works entirely in your web browser on any device. Just visit the website, create a free account, and start learning. You can access it from your phone, tablet, or computer - no downloads or installations required."
    },
    {
      question: "What makes LinguaFlow different from other learning apps?",
      answer: "LinguaFlow lets YOU build your own vocabulary list with words you actually need to learn. Our AI chat assistant knows your specific vocabulary and creates personalized quizzes and examples. Plus, our revision system uses multiple question types (multiple choice, translation, writing) to reinforce learning from different angles."
    },
    {
      question: "How does the AI chat assistant work?",
      answer: "The AI assistant has access to all your saved words and creates personalized learning experiences. Ask for quizzes, request example sentences, practice translations, or get explanations - all focused on YOUR vocabulary. It's like having a personal tutor available 24/7."
    },
    {
      question: "What is the revision practice feature?",
      answer: "You'll get 10 random questions from your vocabulary in different formats: multiple choice (select correct translation), translation (Arabic to English), and writing exercises. After each session, you get a score, accuracy percentage, and detailed statistics."
    },
    {
      question: "Is LinguaFlow really free?",
      answer: "Yes! LinguaFlow is 100% free with no word limits, no feature restrictions, and no credit card required. You get unlimited vocabulary storage, full AI chat access, unlimited revision practice, complete progress tracking, and all features forever."
    },
    {
      question: "What languages does LinguaFlow support?",
      answer: "Currently, LinguaFlow focuses on English vocabulary learning with Arabic translations. This makes it perfect for Arabic speakers learning English or English speakers learning Arabic vocabulary. We're planning to add more language pairs in the future."
    },
    {
      question: "How is my progress tracked?",
      answer: "LinguaFlow provides comprehensive statistics including: total words learned, words added this week/month, learning streaks, AI chat time, revision session scores, accuracy percentages, and detailed performance analytics. Set daily goals and track your improvement over time."
    },
    {
      question: "Can I use LinguaFlow offline?",
      answer: "LinguaFlow requires an internet connection to sync your data and use the AI features. However, once your page is loaded, you can browse your vocabulary list even if your connection is temporarily interrupted. All changes sync automatically when you're back online."
    },
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
            Everything you need to know about LinguaFlow
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