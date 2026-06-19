"use client";

import React, { useState } from "react";
import { ClipboardList, CheckCircle, ArrowRight, Activity, Calendar, AlertCircle } from "lucide-react";

interface Assessment {
  id: number;
  type: string;
  score: number;
  answers: any;
  created_at: string;
}

interface AssessmentsModuleProps {
  userId: string;
  assessments: Assessment[];
  onAddAssessment: (type: string, score: number, answers: any) => Promise<void>;
}

const QUIZZES = {
  stress: {
    title: "Perceived Stress Scale",
    description: "Measure the degree to which situations in your life are appraised as stressful.",
    questions: [
      "In the last month, how often have you been upset because of something that happened unexpectedly?",
      "In the last month, how often have you felt that you were unable to control the important things in your life?",
      "In the last month, how often have you felt nervous and 'stressed'?",
      "In the last month, how often have you felt that difficulties were piling up so high that you could not overcome them?"
    ]
  },
  anxiety: {
    title: "GAD-7 Anxiety Assessment",
    description: "A screening tool for Generalized Anxiety Disorder.",
    questions: [
      "Feeling nervous, anxious, or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?"
    ]
  }
};

const OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Fairly Often", value: 2 },
  { label: "Very Often", value: 3 }
];

export default function AssessmentsModule({ userId, assessments, onAddAssessment }: AssessmentsModuleProps) {
  const [activeQuiz, setActiveQuiz] = useState<keyof typeof QUIZZES | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState<number | null>(null);

  const handleStart = (quizType: keyof typeof QUIZZES) => {
    setActiveQuiz(quizType);
    setCurrentStep(0);
    setAnswers([]);
    setShowResult(null);
  };

  const handleAnswer = async (val: number) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);

    if (activeQuiz && newAnswers.length === QUIZZES[activeQuiz].questions.length) {
      // Finished
      setIsSubmitting(true);
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      await onAddAssessment(activeQuiz, totalScore, newAnswers);
      setShowResult(totalScore);
      setIsSubmitting(false);
    } else {
      setCurrentStep(curr => curr + 1);
    }
  };

  const getInterpretation = (score: number, maxScore: number) => {
    const ratio = score / maxScore;
    if (ratio < 0.33) return { text: "Low", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (ratio < 0.66) return { text: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { text: "High", color: "text-red-500", bg: "bg-red-500/10" };
  };

  if (activeQuiz && showResult !== null) {
    const maxScore = QUIZZES[activeQuiz].questions.length * 3;
    const interp = getInterpretation(showResult, maxScore);
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center">
        <div className={`w-20 h-20 mx-auto rounded-full ${interp.bg} flex items-center justify-center mb-6`}>
          <Activity className={`w-10 h-10 ${interp.color}`} />
        </div>
        <h2 className="text-3xl font-black mb-2">Assessment Complete</h2>
        <p className="text-zinc-500 mb-6">Your total score is <strong className="text-zinc-900 dark:text-zinc-100">{showResult}</strong> out of {maxScore}</p>
        
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${interp.bg} ${interp.color} font-bold mb-8`}>
          <AlertCircle className="w-5 h-5" />
          {interp.text} Indication
        </div>

        <p className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          {interp.text === 'High' ? "Your score indicates a higher level of concern. We strongly recommend discussing these results with your therapist." : 
           interp.text === 'Moderate' ? "You're experiencing some moderate symptoms. Keep tracking your progress and practice self-care." : 
           "Your results fall in the lower range. Keep up your current wellness routines!"}
        </p>

        <button onClick={() => setActiveQuiz(null)} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
          Return to Assessments
        </button>
      </div>
    );
  }

  if (activeQuiz) {
    const quiz = QUIZZES[activeQuiz];
    const progress = (currentStep / quiz.questions.length) * 100;
    
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold text-zinc-500 mb-3">
            <span>{quiz.title}</span>
            <span>Question {currentStep + 1} of {quiz.questions.length}</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-8 text-center">{quiz.questions[currentStep]}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map(opt => (
            <button key={opt.label} onClick={() => handleAnswer(opt.value)} disabled={isSubmitting}
              className="p-5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 font-bold transition-all text-left">
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
          <ClipboardList className="w-7 h-7 text-purple-500" /> Self-Assessments
        </h2>
        <p className="text-zinc-500">Take clinical assessments to measure your stress and anxiety levels over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(QUIZZES).map(([key, quiz]) => (
          <div key={key} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-start hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 capitalize">{quiz.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 flex-1">{quiz.description}</p>
            <button onClick={() => handleStart(key as keyof typeof QUIZZES)} className="w-full py-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-300 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors">
              Start Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {assessments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Past Results</h3>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            {assessments.map((a, i) => (
              <div key={a.id} className={`p-4 flex items-center justify-between ${i !== assessments.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-bold capitalize">{a.type} Assessment</div>
                    <div className="text-sm text-zinc-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(a.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-purple-600 dark:text-purple-400">{a.score}</div>
                  <div className="text-xs text-zinc-400 font-bold uppercase">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
