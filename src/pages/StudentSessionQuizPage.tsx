import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function StudentSessionQuizPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "What is the pH of a neutral solution at 25°C?",
      options: ["0", "14", "7", "1"],
      correct: "7"
    },
    {
      question: "Which reaction releases heat?",
      options: ["Endothermic", "Exothermic", "Neutralization", "Redox"],
      correct: "Exothermic"
    },
    {
      question: "Litmus turns red in:",
      options: ["Basic solution", "Acidic solution", "Neutral water", "Alcohol"],
      correct: "Acidic solution"
    }
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RoleGate allowedRoles={['student']}>
            <Section 
              title="Quiz Results" 
              description="Chemical Reactions - Part 1"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Great Job!</h2>
                <p className="text-xl text-gray-300">You scored 2 out of 3 questions correctly</p>
                <div className="text-3xl font-bold text-green-400 mt-4">67%</div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Question Review</h3>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white font-medium">{q.question}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          index < 2 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {index < 2 ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Correct answer: {q.correct}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate(`/student/sessions/${sessionId}/overview`)}
                  className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300"
                >
                  Back to Overview
                </button>
                <button
                  onClick={() => navigate(`/student/chat/${sessionId}`)}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300"
                >
                  Ask Questions
                </button>
              </div>
            </Section>
          </RoleGate>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['student']}>
          <button
            onClick={() => navigate(`/student/sessions/${sessionId}/overview`)}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Overview
          </button>

          <Section 
            title="Quiz: Chemical Reactions - Part 1" 
            description={`Question ${currentQuestion + 1} of ${questions.length}`}
          >
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center text-gray-400">
                  <Clock size={20} className="mr-2" />
                  <span>No time limit</span>
                </div>
                <div className="text-gray-400">
                  {currentQuestion + 1} / {questions.length}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnswer === option
                          ? 'border-violet-500 bg-violet-500/10 text-white'
                          : 'border-slate-700 bg-slate-800/50 text-gray-300 hover:border-slate-600 hover:bg-slate-800/70'
                      }`}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)})
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}