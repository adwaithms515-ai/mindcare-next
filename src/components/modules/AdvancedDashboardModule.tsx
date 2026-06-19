"use client";

import React from "react";
import { Activity, Brain, CheckCircle, TrendingUp, HeartPulse, Clock, Sparkles } from "lucide-react";

interface AdvancedDashboardProps {
  moodLogs: any[];
  assessments: any[];
  entries: any[];
  goals: any[];
  activityLogs: any[];
}

export default function AdvancedDashboardModule({ moodLogs, assessments, entries, goals, activityLogs }: AdvancedDashboardProps) {
  
  // Calculations
  const averageMood = moodLogs.length ? (moodLogs.reduce((acc, l) => acc + l.score, 0) / moodLogs.length).toFixed(1) : "N/A";
  const completedGoals = goals.filter(g => g.status === 'completed' || g.current_value >= g.target_value).length;
  const recentAssessment = assessments.length ? assessments[assessments.length - 1] : null;
  const totalActivityMin = activityLogs.reduce((acc, l) => acc + l.duration_minutes, 0);

  // Wellness Score Logic (heuristic based on active usage)
  let wellnessScore = 50; // base score
  if (moodLogs.length) wellnessScore += Math.min(20, moodLogs.length * 2);
  if (entries.length) wellnessScore += Math.min(15, entries.length * 3);
  if (totalActivityMin > 0) wellnessScore += Math.min(15, totalActivityMin);
  wellnessScore = Math.min(100, Math.max(0, wellnessScore));

  const isHighWellness = wellnessScore > 75;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
            <TrendingUp className="w-7 h-7 text-emerald-500" /> Wellness Dashboard
          </h2>
          <p className="text-zinc-500">Your mental health analytics and progress at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SCORE CARD */}
        <div className={`col-span-1 md:col-span-2 rounded-3xl p-8 text-white relative overflow-hidden ${isHighWellness ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
          <Sparkles className="absolute top-4 right-4 w-24 h-24 opacity-10" />
          <div className="text-white/80 font-bold uppercase tracking-widest text-sm mb-4">Overall Wellness Score</div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-7xl font-black leading-none">{wellnessScore}</span>
            <span className="text-xl font-bold mb-2 text-white/70">/ 100</span>
          </div>
          <p className="text-white/90 text-sm mt-4 leading-relaxed">
            {isHighWellness 
              ? "You're doing great! Your consistent tracking and wellness activities are reflecting positively on your score." 
              : "Keep building your daily habits. Log your mood, journal, and try guided activities to boost your wellness score."}
          </p>
        </div>

        {/* METRICS */}
        {[
          { label: "Avg Mood Score", value: averageMood, icon: HeartPulse, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
          { label: "Mindful Minutes", value: totalActivityMin, icon: Clock, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30" },
          { label: "Journal Entries", value: entries.length, icon: Activity, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
          { label: "Goals Reached", value: completedGoals, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
        ].map((m, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
            <div className={`w-12 h-12 rounded-full ${m.bg} flex items-center justify-center mb-4`}>
              <m.icon className={`w-6 h-6 ${m.color}`} />
            </div>
            <div className="text-3xl font-black mb-1">{m.value}</div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* RECENT ASSESSMENT OVERVIEW */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold">Latest Assessment</h3>
          </div>
          
          {recentAssessment ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-500 font-semibold capitalize">{recentAssessment.type} Score</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{recentAssessment.score}</span>
              </div>
              <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (recentAssessment.score / 12) * 100)}%` }} />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Taken on {new Date(recentAssessment.created_at).toLocaleDateString()}. View the Assessments tab to take a new clinical evaluation or review history.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              No assessments taken yet.
            </div>
          )}
        </div>

        {/* RECENT ACTIVITY SUMMARY */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold">Activity Summary</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Active Goals</span>
              <span className="font-bold">{goals.length - completedGoals}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Total Mindful Sessions</span>
              <span className="font-bold">{activityLogs.length}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Mood Log Streak</span>
              <span className="font-bold text-orange-500">{moodLogs.length > 0 ? 'Active' : 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
