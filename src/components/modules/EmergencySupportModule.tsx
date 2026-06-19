"use client";

import React, { useState } from "react";
import { AlertTriangle, Phone, ShieldAlert, HeartHandshake, Info } from "lucide-react";

export default function EmergencySupportModule() {
  const [showSOS, setShowSOS] = useState(false);

  const SOS_CONTACTS = [
    { name: "National Suicide Prevention Lifeline", phone: "988", type: "Crisis Line" },
    { name: "Crisis Text Line", phone: "Text HOME to 741741", type: "Text Line" },
    { name: "Emergency Services", phone: "911", type: "Emergency" },
  ];

  if (showSOS) {
    return (
      <div className="bg-red-600 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-red-700/50 animate-pulse pointer-events-none" />
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black mb-4">You are not alone.</h2>
          <p className="text-xl text-red-100 mb-10 max-w-lg mx-auto">Please reach out immediately. Help is available 24/7. These services are free and confidential.</p>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto mb-10">
            {SOS_CONTACTS.map(c => (
              <a key={c.name} href={`tel:${c.phone.replace(/[^0-9]/g, '')}`} className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-5 rounded-2xl transition-colors border border-red-400/30">
                <div className="text-left">
                  <div className="font-bold text-lg">{c.name}</div>
                  <div className="text-red-200 text-sm">{c.type}</div>
                </div>
                <div className="flex items-center gap-2 font-black text-xl bg-white text-red-600 px-4 py-2 rounded-xl">
                  <Phone className="w-5 h-5" /> {c.phone}
                </div>
              </a>
            ))}
          </div>

          <button onClick={() => setShowSOS(false)} className="text-red-200 hover:text-white font-bold underline decoration-2 underline-offset-4">
            Exit Emergency Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black flex items-center gap-2 mb-2 text-red-500">
          <ShieldAlert className="w-7 h-7" /> Crisis & Emergency Support
        </h2>
        <p className="text-zinc-500">Resources and immediate support when you are in distress.</p>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div>
          <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mb-2">Immediate Danger?</h3>
          <p className="text-red-800/70 dark:text-red-200/70 mb-4 max-w-md">If you or someone else is in immediate physical danger, or experiencing a medical emergency, tap the SOS button now.</p>
        </div>
        <button onClick={() => setShowSOS(true)} className="w-full md:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-2xl shadow-xl hover:shadow-red-500/30 transition-all flex items-center justify-center gap-3 animate-pulse">
          <AlertTriangle className="w-6 h-6" /> SOS BUTTON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="w-6 h-6 text-pink-500" />
            <h3 className="text-xl font-bold">Safety Plan</h3>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 leading-relaxed">
            A safety plan helps you manage a crisis. It includes your coping strategies and people you can contact when in distress.
          </p>
          <button className="text-pink-600 dark:text-pink-400 font-bold text-sm bg-pink-50 dark:bg-pink-900/20 px-4 py-2 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors w-full">
            Review Safety Plan
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-teal-500" />
            <h3 className="text-xl font-bold">Local Resources</h3>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 leading-relaxed">
            Find local clinics, support groups, and emergency psychiatric facilities near your location.
          </p>
          <button className="text-teal-600 dark:text-teal-400 font-bold text-sm bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors w-full">
            Find Local Help
          </button>
        </div>
      </div>
    </div>
  );
}
