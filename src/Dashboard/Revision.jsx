// src/components/Revision.jsx
import { useState, useEffect } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import {
  BookOpen,
  Check,
  X,
  Award,
  Target,
  Clock,
  Zap,
  ArrowRight,
  Volume2,
  Sparkles,
  Trophy,
  RefreshCw,
} from "lucide-react";

const Revision = () => {
  const { session } = UserAuth();
  const [words, setWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [revisionId, setRevisionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // Fetch user's words
  useEffect(() => {
    const fetchWords = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("words")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching words:", error);
        return;
      }

      setWords(data || []);
    };

    fetchWords();
  }, [session]);

  // Generate questions from words
  const generateQuestions = (wordList) => {
    if (wordList.length < 3) {
      alert("You need at least 3 words to start revision!");
      return [];
    }

    // Take up to 10 random words
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, Math.min(10, wordList.length));

    return selectedWords.map((word, index) => {
      const questionTypes = ["multiple_choice", "translation", "write"];
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      if (type === "multiple_choice") {
        // Create wrong answers from other words
        const wrongAnswers = wordList
          .filter((w) => w.id !== word.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((w) => w.arabic);

        const options = [...wrongAnswers, word.arabic].sort(() => Math.random() - 0.5);

        return {
          id: word.id,
          type: "multiple_choice",
          question: `What is the meaning of "${word.english}"?`,
          options: options,
          correctAnswer: word.arabic,
          word: word,
        };
      } else if (type === "translation") {
        return {
          id: word.id,
          type: "translation",
          question: word.arabic,
          correctAnswer: word.english.toLowerCase(),
          word: word,
        };
      } else {
        return {
          id: word.id,
          type: "write",
          question: `Write "${word.arabic}" in English`,
          correctAnswer: word.english.toLowerCase(),
          word: word,
        };
      }
    });
  };

  // Start revision session
  const startRevision = async () => {
    const generatedQuestions = generateQuestions(words);
    if (generatedQuestions.length === 0) return;

    setQuestions(generatedQuestions);
    setSessionStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    const newSessionId = `${session.user.id}_${Date.now()}`;
    setSessionId(newSessionId);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());

    // Create revision record
    const { data, error } = await supabase
      .from("revisions")
      .insert([
        {
          user_id: session.user.id,
          session_id: newSessionId,
          total_questions: generatedQuestions.length,
          correct_answers: 0,
          score: 0,
          accuracy: 0,
          completed: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating revision:", error);
    } else {
      setRevisionId(data.id);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  // Check answer
  const checkAnswer = async () => {
    if (selectedAnswer === null && questions[currentQuestion].type === "multiple_choice") return;

    const question = questions[currentQuestion];
    const userAnswer =
      question.type === "multiple_choice" ? selectedAnswer : selectedAnswer?.toLowerCase();
    const correct = userAnswer === question.correctAnswer.toLowerCase();

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
      setScore((prev) => prev + 10);
    }

    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    // Save answer to database
    if (revisionId) {
      await supabase.from("revision_answers").insert([
        {
          revision_id: revisionId,
          user_id: session.user.id,
          word_id: question.id,
          question_type: question.type,
          user_answer: userAnswer || "",
          correct_answer: question.correctAnswer,
          is_correct: correct,
          time_taken_seconds: timeTaken,
        },
      ]);
    }
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(Date.now());
    } else {
      finishSession();
    }
  };

  // Finish session
  const finishSession = async () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = ((correctAnswers / questions.length) * 100).toFixed(2);

    // Update revision record
    if (revisionId) {
      await supabase
        .from("revisions")
        .update({
          correct_answers: correctAnswers,
          score: score,
          accuracy: parseFloat(accuracy),
          duration_seconds: totalTime,
          completed: true,
        })
        .eq("id", revisionId);
    }

    setSessionCompleted(true);
  };

  // Reset and start new session
  const resetSession = () => {
    setSessionStarted(false);
    setSessionCompleted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setQuestions([]);
  };

  if (words.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
          <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Words to Practice</h2>
          <p className="text-gray-400">
            Add some words to your collection first, then come back to practice!
          </p>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (!sessionStarted && !sessionCompleted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-600 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Practice Revision</h1>
                <p className="text-gray-400">Test your vocabulary knowledge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
                <BookOpen className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{words.length}</p>
                <p className="text-xs text-gray-400">Total Words</p>
              </div>
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">10</p>
                <p className="text-xs text-gray-400">Questions</p>
              </div>
              <div className="text-center p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl">
                <Clock className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">~5</p>
                <p className="text-xs text-gray-400">Minutes</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Question Types
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-[#0B0C10]/60 border border-white/10 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Multiple Choice</p>
                    <p className="text-xs text-gray-400">Choose the correct translation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0B0C10]/60 border border-white/10 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Translation</p>
                    <p className="text-xs text-gray-400">Translate from Arabic to English</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0B0C10]/60 border border-white/10 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Write</p>
                    <p className="text-xs text-gray-400">Type the correct answer</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startRevision}
              className="group w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold transition-all flex items-center justify-center gap-2 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Practice
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (sessionCompleted) {
    const accuracy = ((correctAnswers / questions.length) * 100).toFixed(0);
    const isPerfect = correctAnswers === questions.length;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-600 rounded-full blur-2xl opacity-50" />
              <Trophy className="relative w-24 h-24 text-violet-400 mx-auto" />
            </div>

            <h2 className="text-4xl font-bold text-white mb-2">
              {isPerfect ? "Perfect! 🎉" : "Great Job! 👏"}
            </h2>
            <p className="text-gray-400 mb-8">You've completed your revision session</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl">
                <Award className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{score}</p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 rounded-2xl">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">
                  {correctAnswers}/{questions.length}
                </p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30 rounded-2xl">
                <Sparkles className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{accuracy}%</p>
                <p className="text-sm text-gray-400">Accuracy</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetSession}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Practice Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-400">
            Question {currentQuestion + 1}/{questions.length}
          </span>
          <span className="text-sm font-semibold text-violet-400">{score} pts</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Question Type Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-400 capitalize">
              {question.type.replace("_", " ")}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{question.question}</h2>
            {question.type === "translation" && (
              <div className="flex items-center gap-2 text-gray-400">
                <Volume2 className="w-5 h-5" />
                <span className="text-sm">Listen and translate</span>
              </div>
            )}
          </div>

          {/* Multiple Choice Options */}
          {question.type === "multiple_choice" && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    showResult
                      ? option === question.correctAnswer
                        ? "bg-green-500/20 border-green-500 text-white"
                        : option === selectedAnswer
                        ? "bg-red-500/20 border-red-500 text-white"
                        : "bg-[#0B0C10]/60 border-white/10 text-gray-400"
                      : selectedAnswer === option
                      ? "bg-violet-500/20 border-violet-500 text-white"
                      : "bg-[#0B0C10]/60 border-white/10 text-white hover:border-violet-400/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        showResult && option === question.correctAnswer
                          ? "bg-green-500 text-white"
                          : showResult && option === selectedAnswer
                          ? "bg-red-500 text-white"
                          : selectedAnswer === option
                          ? "bg-violet-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-semibold text-lg" dir="rtl">
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Text Input for Translation/Write */}
          {(question.type === "translation" || question.type === "write") && (
            <div className="space-y-4">
              <input
                type="text"
                value={selectedAnswer || ""}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                placeholder="Type your answer..."
                className="w-full bg-[#0B0C10]/60 border-2 border-white/10 focus:border-violet-500 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-600 focus:outline-none transition-all disabled:opacity-50"
              />
              {showResult && (
                <div
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect
                      ? "bg-green-500/20 border-green-500"
                      : "bg-red-500/20 border-red-500"
                  }`}
                >
                  <p className="text-sm font-semibold text-white mb-1">
                    {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-300">
                      Correct answer: <span className="font-bold">{question.correctAnswer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            {!showResult ? (
              <button
                onClick={checkAnswer}
                disabled={!selectedAnswer}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Check Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    See Results
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div
          className={`p-6 rounded-2xl border-2 ${
            isCorrect
              ? "bg-green-500/20 border-green-500"
              : "bg-red-500/20 border-red-500"
          }`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <Check className="w-8 h-8 text-green-400" />
            ) : (
              <X className="w-8 h-8 text-red-400" />
            )}
            <div>
              <p className="text-lg font-bold text-white">
                {isCorrect ? "Great job! 🎉" : "Not quite right"}
              </p>
              <p className="text-sm text-gray-300">
                {isCorrect ? "+10 points" : "Keep practicing!"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revision;