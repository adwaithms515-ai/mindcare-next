"use client";

import React, { useState } from "react";
import { User, Activity, ClipboardList, BookOpen, Clock, Stethoscope, Phone, Mail, MapPin, AlertTriangle, CheckCircle, Flame, HeartPulse } from "lucide-react";
import AssessmentsModule from "./AssessmentsModule";
import WellnessJournalModule from "./WellnessJournalModule";

interface TherapistPatientProfileModuleProps {
  appt: any;
  data: any;
  onUpdateAppt: (id: number, status: string) => Promise<void>;
  onJoinVideoCall: () => void;
}

export default function TherapistPatientProfileModule({ appt, data, onUpdateAppt, onJoinVideoCall }: TherapistPatientProfileModuleProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Safe fallbacks for data
  const profile = data?.profile || {};
  const moods = data?.moods || [];
  const assessments = data?.assessments || [];
  const journals = data?.journals || [];
  const goals = data?.goals || [];
  const habits = data?.habits || [];
  const activities = data?.activities || [];

  const avgMood = moods.length ? (moods.reduce((a:any, b:any) => a + b.score, 0) / moods.length).toFixed(1) : "N/A";
  const recentAssmt = assessments.length ? assessments[assessments.length - 1] : null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* Header Profile Area */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white flex flex-col md:flex-row justify-between md:items-end gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl shadow-xl backdrop-blur-sm">
            {profile.full_name ? profile.full_name.charAt(0) : "P"}
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">{profile.full_name || appt.email}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-white/80 font-medium text-sm">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {appt.email}</span>
              {profile.phone_number && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone_number}</span>}
              {profile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>}
            </div>
            {profile.emergency_contact && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-100 rounded-full text-xs font-bold border border-red-500/30">
                <AlertTriangle className="w-3.5 h-3.5" /> Emergency: {profile.emergency_contact}
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          <button onClick={onJoinVideoCall} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
            Join Video Session
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'assessments', label: 'Assessments', icon: ClipboardList },
          { id: 'mood', label: 'Mood Tracking', icon: HeartPulse },
          { id: 'journal', label: 'Journal', icon: BookOpen },
          { id: 'history', label: 'Session History', icon: Clock },
          { id: 'recommendations', label: 'Actions & Recs', icon: Stethoscope },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-zinc-900' 
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8 flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-900/50">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <User className="w-5 h-5 text-indigo-500" /> Personal Info
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><span className="text-zinc-500 block mb-1">Age</span><span className="font-bold">{profile.age || 'Unknown'}</span></div>
                  <div><span className="text-zinc-500 block mb-1">Gender</span><span className="font-bold">{profile.gender || 'Unknown'}</span></div>
                  <div><span className="text-zinc-500 block mb-1">Primary Concern</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.primary_concern || 'Not specified'}</span></div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Risk Level</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      profile.risk_level === 'high' ? 'bg-red-100 text-red-600' : 
                      profile.risk_level === 'moderate' ? 'bg-amber-100 text-amber-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>{profile.risk_level || 'low'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <Activity className="w-5 h-5 text-teal-500" /> Mental Health Snapshot
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl text-center border border-zinc-100 dark:border-zinc-800">
                    <div className="text-3xl font-black text-teal-600 mb-1">{avgMood}</div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Avg Mood</div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl text-center border border-zinc-100 dark:border-zinc-800">
                    <div className="text-3xl font-black text-purple-600 mb-1">{assessments.length}</div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Assessments</div>
                  </div>
                </div>
                {recentAssmt && (
                  <div className="text-sm p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 rounded-lg">
                    <strong>Latest Assessment:</strong> {recentAssmt.type} ({recentAssmt.score} pts) on {new Date(recentAssmt.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
               <h3 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <Flame className="w-5 h-5 text-orange-500" /> Active Goals & Habits
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-bold text-zinc-500 text-sm mb-3">Goals</h4>
                   <ul className="flex flex-col gap-2">
                     {goals.map((g:any) => (
                       <li key={g.id} className="text-sm font-medium flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                         <span>{g.title}</span>
                         <span className="text-xs text-zinc-400 font-bold">{g.current_value}/{g.target_value}</span>
                       </li>
                     ))}
                     {goals.length===0 && <li className="text-sm text-zinc-400 italic">No goals active.</li>}
                   </ul>
                 </div>
                 <div>
                   <h4 className="font-bold text-zinc-500 text-sm mb-3">Habits</h4>
                   <ul className="flex flex-col gap-2">
                     {habits.map((h:any) => (
                       <li key={h.id} className="text-sm font-medium flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                         <span>{h.title}</span>
                         <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-bold">{h.streak}🔥</span>
                       </li>
                     ))}
                     {habits.length===0 && <li className="text-sm text-zinc-400 italic">No habits active.</li>}
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* TAB: ASSESSMENTS (Read-only view of patient assessments) */}
        {activeTab === 'assessments' && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-black mb-6">Patient Assessment History</h3>
            {assessments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {assessments.map((a:any) => (
                  <div key={a.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg capitalize">{a.type} Assessment</h4>
                      <p className="text-sm text-zinc-500">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-600">{a.score}</div>
                      <div className="text-xs font-bold text-zinc-400 uppercase">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                No assessments completed yet.
              </div>
            )}
          </div>
        )}

        {/* TAB: MOOD */}
        {activeTab === 'mood' && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-black mb-6">Mood Tracking Data</h3>
            <div className="grid grid-cols-1 gap-4">
              {moods.length > 0 ? moods.map((m:any, i:number) => (
                 <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <span className="text-3xl">{m.emoji}</span>
                     <div>
                       <div className="font-bold text-lg">{m.label}</div>
                       <div className="text-sm text-zinc-500">{m.date}</div>
                     </div>
                   </div>
                   <div className="font-black text-xl text-zinc-400">{m.score}/5</div>
                 </div>
              )) : (
                 <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  No mood logs recorded.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: JOURNAL */}
        {activeTab === 'journal' && (
          <div className="animate-in fade-in duration-500">
             <h3 className="text-xl font-black mb-6">Patient Wellness Journal</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {journals.map((j:any) => (
                  <div key={j.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg">{j.title}</h4>
                      {j.mood_linked && <span className="text-xl">{j.mood_linked}</span>}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 italic">&quot;{j.content}&quot;</p>
                    <div className="text-xs font-bold text-zinc-400 uppercase">{new Date(j.created_at).toLocaleString()} {j.is_voice_generated && '• Voice Note'}</div>
                  </div>
                ))}
                {journals.length === 0 && (
                   <div className="col-span-2 text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    No journal entries shared.
                  </div>
                )}
             </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-black mb-6">Session History</h3>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm text-center text-zinc-500">
               Historical session notes and transcripts would be loaded here.
               <br/><br/>
               (Showing data for active appointment <strong className="text-purple-500">#{appt.id}</strong>)
            </div>
          </div>
        )}

        {/* TAB: RECOMMENDATIONS / ACTIONS */}
        {activeTab === 'recommendations' && (
          <div className="animate-in fade-in duration-500 flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Stethoscope className="w-6 h-6 text-purple-500"/> Clinical Actions</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-2">Session Notes (Private)</label>
                <textarea rows={4} placeholder="Add clinical notes for this session..." className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-2">Prescribe Exercises / Recommendations</label>
                <div className="flex gap-2 mb-3">
                  <button className="px-4 py-2 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 rounded-lg text-sm font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors">+ 4-7-8 Breathing</button>
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg text-sm font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors">+ Stress Assessment</button>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <button onClick={() => onUpdateAppt(appt.id, 'completed')} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md">Complete Session</button>
                   <button className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-200 transition-colors">Schedule Follow-up</button>
                </div>
                {appt.status !== 'pending' && <span className="text-sm font-bold text-zinc-400 uppercase">Status: {appt.status}</span>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
