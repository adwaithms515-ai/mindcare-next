"use client";

import React, { useState } from "react";
import { Target, Flame, Plus, CheckCircle, Circle, Trophy, ArrowRight, RefreshCw } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  target_value: number;
  current_value: number;
  status: string;
  created_at: string;
}

interface Habit {
  id: number;
  title: string;
  streak: number;
  last_completed: string | null;
  created_at: string;
}

interface GoalsHabitsModuleProps {
  userId: string;
  goals: Goal[];
  habits: Habit[];
  onAddGoal: (title: string, target: number) => Promise<void>;
  onUpdateGoal: (id: number, current: number, status: string) => Promise<void>;
  onAddHabit: (title: string) => Promise<void>;
  onIncrementHabit: (id: number) => Promise<void>;
}

export default function GoalsHabitsModule({ userId, goals, habits, onAddGoal, onUpdateGoal, onAddHabit, onIncrementHabit }: GoalsHabitsModuleProps) {
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  const handleAddGoal = async () => {
    if (!newGoalTitle || !newGoalTarget) return;
    await onAddGoal(newGoalTitle, parseInt(newGoalTarget));
    setNewGoalTitle("");
    setNewGoalTarget("");
    setIsAddingGoal(false);
  };

  const handleAddHabit = async () => {
    if (!newHabitTitle) return;
    await onAddHabit(newHabitTitle);
    setNewHabitTitle("");
    setIsAddingHabit(false);
  };

  const isHabitDoneToday = (habit: Habit) => {
    if (!habit.last_completed) return false;
    const last = new Date(habit.last_completed).toDateString();
    const today = new Date().toDateString();
    return last === today;
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
          <Target className="w-7 h-7 text-indigo-500" /> Goals & Habits
        </h2>
        <p className="text-zinc-500">Set personal milestones and build positive daily routines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HABITS COLUMN */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Daily Habits
            </h3>
            <button onClick={() => setIsAddingHabit(!isAddingHabit)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isAddingHabit && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-4 flex gap-2">
              <input type="text" placeholder="e.g. Drink 2L water" value={newHabitTitle} onChange={e => setNewHabitTitle(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 outline-none focus:border-indigo-500 text-sm" />
              <button onClick={handleAddHabit} className="px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">Add</button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {habits.map(habit => {
              const done = isHabitDoneToday(habit);
              return (
                <div key={habit.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <button onClick={() => !done && onIncrementHabit(habit.id)} disabled={done}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${done ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-emerald-500'}`}>
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <span className={`font-bold ${done ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-100'}`}>{habit.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold">
                    <Flame className="w-3.5 h-3.5" /> {habit.streak} Day{habit.streak !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
            {habits.length === 0 && !isAddingHabit && (
              <div className="text-center p-8 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-500 text-sm">
                No habits tracked yet.
              </div>
            )}
          </div>
        </div>

        {/* GOALS COLUMN */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-500" /> Active Goals
            </h3>
            <button onClick={() => setIsAddingGoal(!isAddingGoal)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isAddingGoal && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-4 flex flex-col gap-3">
              <input type="text" placeholder="Goal (e.g. Read Books)" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 text-sm" />
              <div className="flex gap-2">
                <input type="number" placeholder="Target count" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 text-sm" />
                <button onClick={handleAddGoal} className="px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">Add Goal</button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {goals.map(goal => {
              const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
              const isCompleted = goal.status === 'completed' || goal.current_value >= goal.target_value;
              return (
                <div key={goal.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold ${isCompleted ? 'text-zinc-500 line-through' : ''}`}>{goal.title}</h4>
                    {!isCompleted ? (
                      <button onClick={() => {
                        const next = goal.current_value + 1;
                        onUpdateGoal(goal.id, next, next >= goal.target_value ? 'completed' : 'in_progress');
                      }} className="w-6 h-6 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-md transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 w-12 text-right">{goal.current_value} / {goal.target_value}</span>
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && !isAddingGoal && (
              <div className="text-center p-8 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-500 text-sm">
                No goals set yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
