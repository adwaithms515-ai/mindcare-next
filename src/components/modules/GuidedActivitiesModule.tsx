"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Wind, Eye, Music, Heart, CheckCircle2, RotateCcw } from "lucide-react";

interface ActivityLog {
  id: number;
  activity_type: string;
  duration_minutes: number;
  completed_at: string;
}

interface GuidedActivitiesModuleProps {
  userId: string;
  logs: ActivityLog[];
  onAddLog: (type: string, duration: number) => Promise<void>;
}

const EXERCISES = [
  {
    id: 'breathe-478',
    title: '4-7-8 Breathing',
    type: 'Breathing',
    icon: Wind,
    color: 'teal',
    duration: 3,
    description: 'A calming breathing pattern to reduce anxiety and help you sleep.'
  },
  {
    id: 'meditation-focus',
    title: 'Focus Meditation',
    type: 'Meditation',
    icon: Music,
    color: 'purple',
    duration: 5,
    description: 'A 5-minute guided mindfulness session to center your thoughts.'
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    type: 'Relaxation',
    icon: Eye,
    color: 'pink',
    duration: 10,
    description: 'A progressive relaxation technique to release physical tension.'
  }
];

export default function GuidedActivitiesModule({ userId, logs, onAddLog }: GuidedActivitiesModuleProps) {
  const [activeExc, setActiveExc] = useState<typeof EXERCISES[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(""); // For breathing phases
  
  // Basic breathing animation logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeExc && isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        
        // Simple phase calculation for 4-7-8
        if (activeExc.id === 'breathe-478') {
          const cycle = timeLeft % 19;
          if (cycle > 15) setPhase("Inhale...");
          else if (cycle > 8) setPhase("Hold...");
          else setPhase("Exhale...");
        } else {
          setPhase("Relax and focus...");
        }

      }, 1000);
    } else if (timeLeft === 0 && isPlaying && activeExc) {
      // Finished
      setIsPlaying(false);
      onAddLog(activeExc.title, activeExc.duration);
      setPhase("Complete!");
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, activeExc, onAddLog]);

  const startExercise = (exc: typeof EXERCISES[0]) => {
    setActiveExc(exc);
    setTimeLeft(exc.duration * 60);
    setIsPlaying(true);
    setPhase("Get ready...");
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const reset = () => {
    if (activeExc) {
      setTimeLeft(activeExc.duration * 60);
      setIsPlaying(false);
      setPhase("");
    }
  };

  const exit = () => {
    setActiveExc(null);
    setIsPlaying(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (activeExc) {
    const progress = 100 - (timeLeft / (activeExc.duration * 60)) * 100;
    const Icon = activeExc.icon;

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-3xl font-black mb-2">{activeExc.title}</h2>
        <p className="text-zinc-500 mb-12">{activeExc.type} • {activeExc.duration} min</p>

        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Animated rings */}
          <div className={`absolute inset-0 rounded-full border-4 border-${activeExc.color}-100 dark:border-${activeExc.color}-900/30`} />
          <div 
            className={`absolute inset-0 rounded-full border-4 border-${activeExc.color}-500 transition-all duration-1000 ease-linear`}
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
          />
          
          {/* Breathing pulse */}
          {isPlaying && activeExc.id === 'breathe-478' && (
            <div className={`absolute w-48 h-48 rounded-full bg-${activeExc.color}-500/20 animate-ping`} style={{ animationDuration: '4s' }} />
          )}

          <div className="z-10 flex flex-col items-center">
            {timeLeft === 0 && !isPlaying ? (
              <CheckCircle2 className={`w-16 h-16 text-${activeExc.color}-500 mb-2`} />
            ) : (
              <Icon className={`w-12 h-12 text-${activeExc.color}-500 mb-4`} />
            )}
            <div className="text-4xl font-black text-zinc-900 dark:text-white font-mono">{formatTime(timeLeft)}</div>
            <div className={`text-lg font-bold text-${activeExc.color}-600 dark:text-${activeExc.color}-400 mt-2 h-6`}>{phase}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={reset} className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button onClick={togglePlay} disabled={timeLeft === 0} 
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all ${activeExc.color === 'purple' ? 'bg-purple-600' : activeExc.color === 'pink' ? 'bg-pink-600' : 'bg-teal-600'} disabled:opacity-50 disabled:hover:scale-100`}>
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button onClick={exit} className="px-6 py-4 rounded-full font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Summary logic
  const totalMinutes = logs.reduce((sum, l) => sum + l.duration_minutes, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
          <Heart className="w-7 h-7 text-teal-500" /> Guided Wellness Activities
        </h2>
        <p className="text-zinc-500">Take a moment to center yourself. Choose an exercise to start relaxing.</p>
      </div>

      <div className="flex gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-6 text-white flex-1 flex flex-col justify-between">
          <div className="text-teal-100 font-bold uppercase tracking-wide text-sm mb-2">Total Mindful Minutes</div>
          <div className="text-5xl font-black">{totalMinutes}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex-1 flex flex-col justify-between">
          <div className="text-zinc-500 font-bold uppercase tracking-wide text-sm mb-2">Sessions Completed</div>
          <div className="text-5xl font-black text-zinc-900 dark:text-white">{logs.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {EXERCISES.map(exc => (
          <div key={exc.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:shadow-md transition-shadow group flex flex-col">
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${
              exc.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' :
              exc.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' :
              'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300'
            }`}>
              <exc.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-1">{exc.title}</h3>
            <div className="text-sm font-bold text-zinc-400 mb-4">{exc.duration} min • {exc.type}</div>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 flex-1 text-sm leading-relaxed">{exc.description}</p>
            <button onClick={() => startExercise(exc)} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              exc.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:text-purple-300' :
              exc.color === 'pink' ? 'bg-pink-50 hover:bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:hover:bg-pink-900/40 dark:text-pink-300' :
              'bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 dark:text-teal-300'
            }`}>
              <Play className="w-4 h-4" /> Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
