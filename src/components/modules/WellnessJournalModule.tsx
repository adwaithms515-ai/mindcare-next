"use client";

import React, { useState, useEffect, useRef } from "react";
import { Book, Mic, MicOff, Search, Plus, Save, Smile, AlignLeft, Calendar } from "lucide-react";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood_linked: string | null;
  is_voice_generated: boolean;
  created_at: string;
}

interface WellnessJournalModuleProps {
  userId: string;
  entries: JournalEntry[];
  onAddEntry: (title: string, content: string, mood: string | null, isVoice: boolean) => Promise<void>;
}

export default function WellnessJournalModule({ userId, entries, onAddEntry }: WellnessJournalModuleProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setContent(prev => {
          // simple logic to append, avoiding duplication if interim
          const lastSpace = prev.lastIndexOf(" ");
          return prev + (prev.length > 0 ? " " : "") + currentTranscript;
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support voice-to-text recognition.");
      }
    }
  };

  const handleSave = async () => {
    if (!title || !content) return;
    await onAddEntry(title, content, selectedMood, isListening);
    setTitle("");
    setContent("");
    setSelectedMood(null);
    setIsComposing(false);
    if (isListening) toggleListening();
  };

  const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase()));

  if (isComposing) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">New Entry</h2>
          <button onClick={() => setIsComposing(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold">Cancel</button>
        </div>

        <input 
          type="text" 
          placeholder="Entry Title..." 
          value={title} onChange={e => setTitle(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 mb-6"
        />

        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-500">Link Mood:</span>
            {['😊', '😐', '😔', '😰'].map(m => (
              <button key={m} onClick={() => setSelectedMood(m)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${selectedMood === m ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500' : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-6">
          <textarea 
            placeholder="What's on your mind today?" 
            value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-64 p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl resize-none outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <button onClick={toggleListening}
            className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'}`}>
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        <button onClick={handleSave} disabled={!title || !content} className="w-full py-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save Entry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Book className="w-7 h-7 text-pink-500" /> Wellness Journal
          </h2>
          <p className="text-zinc-500">Document your thoughts, reflect on your days, and track patterns securely.</p>
        </div>
        <button onClick={() => setIsComposing(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" /> Write Entry
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search your journal..." 
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold truncate pr-4">{entry.title}</h3>
              {entry.mood_linked && (
                <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-lg shadow-sm">
                  {entry.mood_linked}
                </div>
              )}
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 flex-1">
              {entry.content}
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wide border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-auto">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(entry.created_at).toLocaleDateString()}</span>
              {entry.is_voice_generated && <span className="flex items-center gap-1 text-purple-500"><Mic className="w-3.5 h-3.5" /> Voice</span>}
            </div>
          </div>
        ))}
        {filteredEntries.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 flex flex-col items-center">
            <AlignLeft className="w-12 h-12 mb-4 opacity-20" />
            <p>No entries found. Start writing your first thought!</p>
          </div>
        )}
      </div>
    </div>
  );
}
