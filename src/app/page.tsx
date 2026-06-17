"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain, Heart, Smile, Activity, User, Users, Send,
  Calendar, CheckCircle, XCircle, Plus, Trash, PlusCircle, LogOut,
  Compass, Shield, BookOpen, Clock, AlertCircle, ChevronRight,
  Star, ArrowRight, Phone, Mail, MapPin, Menu, X, TrendingUp, Lock,
  MessageCircle, Video, FileText, Award, Zap, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'landing' | 'patient' | 'therapist' | 'admin';
type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type ResourceType = 'article' | 'video' | 'exercise';
type AdminTab = 'overview' | 'users' | 'topics' | 'resources';

interface MoodLog { date: string; score: number; emoji: string; label: string; }
interface Appointment { id: number; date: string; time: string; therapist: string; status: AppointmentStatus; email: string; }
interface ChatMessage { id: number; sender: 'user' | 'aura'; text: string; timestamp: string; }
interface Category { id: number; name: string; }
interface Resource { id: number; title: string; category: string; type: ResourceType; urlOrBody: string; }
interface UserProfile { id: number; username: string; email: string; role: 'patient' | 'therapist' | 'admin'; active: boolean; }

// ─── Constants ────────────────────────────────────────────────────────────────
const THERAPISTS = ["Dr. Sarah Jenkins", "Dr. Michael Rowe", "Dr. Aisha Patel"];

const AURA_RESPONSES: Record<string, string> = {
  anxious: "Anxiety can feel overwhelming, but you have more control than you think. Try the 4-7-8 breathing method: inhale for 4 seconds, hold for 7, then exhale slowly for 8 seconds. Repeat 3 times. You've got this. 💜",
  breath: "Let's ground you right now. Close your eyes, breathe in slowly for 4 counts through your nose, hold for 4, then release through your mouth for 6 counts. Do this 3 times and feel your nervous system calm down.",
  stress: "When everything feels urgent, zoom out. Write down your top 3 tasks and focus only on the first one. Take a 5-minute walk, stretch, or step outside — your brain will thank you.",
  sad: "I'm really sorry you're feeling this way. It takes courage to acknowledge sadness. Be gentle with yourself today. Try naming one small thing you're grateful for, or reach out to someone you trust.",
  default: "Thank you for sharing that with me. Remember you're not alone — our licensed therapists are here for you. You can also explore our mindfulness exercises and educational resources in the dashboard.",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>('landing');
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Patient state
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([
    { date: "Jun 10", score: 2, emoji: "😕", label: "Low" },
    { date: "Jun 11", score: 3, emoji: "😐", label: "Neutral" },
    { date: "Jun 12", score: 4, emoji: "🙂", label: "Good" },
    { date: "Jun 13", score: 3, emoji: "😐", label: "Neutral" },
    { date: "Jun 14", score: 5, emoji: "😊", label: "Excellent" },
    { date: "Jun 15", score: 4, emoji: "🙂", label: "Good" },
    { date: "Jun 16", score: 5, emoji: "😊", label: "Excellent" },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, date: "2026-06-20", time: "14:00", therapist: "Dr. Sarah Jenkins", status: "pending", email: "patient1@mindwell.com" },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "aura", text: "Hello! I'm Aura, your personal mental wellness guide. How are you feeling today? 💙", timestamp: "Now" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [auraTyping, setAuraTyping] = useState(false);
  const [bookingEmail, setBookingEmail] = useState("patient1@mindwell.com");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTherapist, setBookingTherapist] = useState(THERAPISTS[0]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Therapist state
  const [selectedApptId, setSelectedApptId] = useState<number | null>(1);
  const [clinicalNote, setClinicalNote] = useState("");

  // Admin state
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Anxiety" }, { id: 2, name: "Depression" },
    { id: 3, name: "CBT Techniques" }, { id: 4, name: "Mindfulness" },
    { id: 5, name: "Grief & Loss" },
  ]);
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: "Deep Breathing 4-7-8 Exercise", category: "Mindfulness", type: "exercise", urlOrBody: "Inhale 4s, hold 7s, exhale 8s. Repeat 3×." },
    { id: 2, title: "Understanding Panic Attacks", category: "Anxiety", type: "article", urlOrBody: "A guide to understanding panic attack triggers and responses." },
    { id: 3, title: "CBT Thought Record Worksheet", category: "CBT Techniques", type: "exercise", urlOrBody: "Identify automatic thoughts, emotions, and balanced alternatives." },
    { id: 4, title: "Mindful Walking Meditation", category: "Mindfulness", type: "video", urlOrBody: "https://youtube.com/watch?v=mindful_walking" },
  ]);
  const [users, setUsers] = useState<UserProfile[]>([
    { id: 1, username: "patient1", email: "patient1@mindwell.com", role: "patient", active: true },
    { id: 2, username: "sarah_jenkins", email: "sarah.jenkins@mindwell.com", role: "therapist", active: true },
    { id: 3, username: "john_doe", email: "john.doe@gmail.com", role: "patient", active: true },
    { id: 4, username: "michael_rowe", email: "m.rowe@mindwell.com", role: "therapist", active: true },
    { id: 5, username: "admin_main", email: "admin@mindwell.com", role: "admin", active: true },
    { id: 6, username: "alice_s", email: "alice.s@email.com", role: "patient", active: false },
  ]);
  const [newCatName, setNewCatName] = useState("");
  const [newResTitle, setNewResTitle] = useState("");
  const [newResCat, setNewResCat] = useState("Anxiety");
  const [newResType, setNewResType] = useState<ResourceType>('article');
  const [newResBody, setNewResBody] = useState("");

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, auraTyping]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const today = () => new Date().toISOString().split('T')[0];

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const logMood = (score: number, emoji: string, label: string) => {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setMoodLogs(prev => [...prev, { date, score, emoji, label }]);
    if (score <= 2) {
      setTimeout(() => {
        setAuraTyping(true);
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            id: Date.now(), sender: "aura",
            text: `I see you're feeling ${label.toLowerCase()} ${emoji}. That's completely okay. I'm here with you. Would you like to try a quick breathing exercise or talk about what's on your mind?`,
            timestamp: now()
          }]);
          setAuraTyping(false);
        }, 1200);
      }, 300);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "user", text, timestamp: now() }]);
    setChatInput("");
    setAuraTyping(true);
    setTimeout(() => {
      const key = Object.keys(AURA_RESPONSES).find(k => text.toLowerCase().includes(k)) || 'default';
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: "aura", text: AURA_RESPONSES[key], timestamp: now() }]);
      setAuraTyping(false);
    }, 1300);
  };

  const bookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) return;
    const appt: Appointment = { id: Date.now(), date: bookingDate, time: "10:00", therapist: bookingTherapist, status: "pending", email: bookingEmail };
    setAppointments(prev => [appt, ...prev]);
    setSelectedApptId(appt.id);
    setBookingDate("");
  };

  const updateAppt = (id: number, status: AppointmentStatus) =>
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  // ─── SVG Mood Chart ────────────────────────────────────────────────────────
  const MoodChart = () => {
    const W = 600, H = 200, PAD = 40;
    const n = moodLogs.length;
    if (n === 0) return null;
    const xStep = (W - PAD * 2) / Math.max(n - 1, 1);
    const yScale = (H - PAD * 2) / 4;
    const pts = moodLogs.map((l, i) => ({
      x: PAD + i * xStep,
      y: H - PAD - (l.score - 1) * yScale,
      ...l,
    }));
    const d = pts.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      return `${acc} C ${prev.x + xStep / 2} ${prev.y}, ${p.x - xStep / 2} ${p.y}, ${p.x} ${p.y}`;
    }, "");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {[1,2,3,4,5].map(lv => (
          <line key={lv} x1={PAD} y1={H - PAD - (lv-1)*yScale} x2={W-PAD} y2={H - PAD - (lv-1)*yScale}
            stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" opacity="0.1" />
        ))}
        {n > 1 && <>
          <path d={d} fill="none" stroke="#8b5cf6" strokeWidth="8" opacity="0.2" filter="url(#glow)" />
          <path d={d} fill="none" stroke="url(#lg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill="url(#lg)" stroke="white" strokeWidth="2" filter="url(#glow)" />
            <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="16">{p.emoji}</text>
            <text x={p.x} y={H - 8} textAnchor="middle" fontSize="11" fill="#9ca3af">{p.date}</text>
          </g>
        ))}
      </svg>
    );
  };

  // ─── Status Badge ─────────────────────────────────────────────────────────
  const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
    const map = {
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      confirmed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    };
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${map[status]}`}>{status}</span>;
  };

  // ─── Section Wrapper ──────────────────────────────────────────────────────
  const Section = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className={`w-full ${className}`}>
      {children}
    </motion.section>
  );

  // ─── Card ─────────────────────────────────────────────────────────────────
  const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => setActiveRole('landing')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent leading-tight">MindCare</div>
              <div className="text-xs font-medium text-zinc-400 leading-none">Wellness Platform</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl">
            {([
              { key: 'landing', label: 'Home' },
              { key: 'patient', label: '💙 Patient Space' },
              { key: 'therapist', label: '🩺 Therapist' },
              { key: 'admin', label: '⚙️ Admin Panel' },
            ] as { key: Role; label: string }[]).map(tab => (
              <button key={tab.key} onClick={() => setActiveRole(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeRole === tab.key
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-purple-600 dark:text-purple-300'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-lg">
              {isDark ? '☀️' : '🌙'}
            </button>
            {activeRole !== 'landing' && (
              <button onClick={() => setActiveRole('landing')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <LogOut className="w-4 h-4 text-red-500" />
                Exit
              </button>
            )}
            <button className="lg:hidden w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex flex-col gap-2">
            {([
              { key: 'landing', label: 'Home' },
              { key: 'patient', label: 'Patient Space' },
              { key: 'therapist', label: 'Therapist' },
              { key: 'admin', label: 'Admin Panel' },
            ] as { key: Role; label: string }[]).map(tab => (
              <button key={tab.key} onClick={() => { setActiveRole(tab.key); setMobileMenuOpen(false); }}
                className="text-left px-4 py-3 rounded-xl text-base font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════════════════════════════════
              LANDING PAGE
          ════════════════════════════════════════════════════════════════ */}
          {activeRole === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* HERO */}
              <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-zinc-950 to-teal-950 text-white">
                {/* Decorative blobs */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36 text-center">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-purple-200 mb-8">
                      <Zap className="w-4 h-4 text-yellow-400" /> AI-Powered Mental Healthcare Platform
                    </span>
                  </motion.div>

                  <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
                    Your Mental Wellness
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
                      Starts Here
                    </span>
                  </motion.h1>

                  <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    MindCare connects patients with licensed therapists, AI-guided coping tools, mood tracking, and structured care pathways — all in one premium platform.
                  </motion.p>

                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <button onClick={() => setActiveRole('patient')}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl text-white text-lg font-bold shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2">
                      Get Started Free <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => setActiveRole('therapist')}
                      className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                      <Video className="w-5 h-5" /> For Therapists
                    </button>
                  </motion.div>

                  {/* Stats row */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    {[
                      { val: "10,000+", label: "Patients Helped" },
                      { val: "500+", label: "Licensed Therapists" },
                      { val: "98%", label: "Satisfaction Rate" },
                      { val: "24/7", label: "AI Support" },
                    ].map(s => (
                      <div key={s.val} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                        <div className="text-3xl font-black text-white">{s.val}</div>
                        <div className="text-sm text-zinc-400 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </section>

              {/* FEATURES STRIP */}
              <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-3">
                  {["HIPAA Compliant", "End-to-End Encrypted", "AI-Powered Insights", "24/7 Aura Support", "Licensed Therapists Only"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </section>

              {/* HOW IT WORKS */}
              <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                  <h2 className="text-4xl font-black mb-4">How MindCare Works</h2>
                  <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">Three simple steps to start your journey towards better mental health.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: "01", icon: User, title: "Create Your Profile", desc: "Sign up in minutes. Tell us about your goals and what you're going through — everything stays private and secure.", color: "purple" },
                    { step: "02", icon: Users, title: "Match With a Therapist", desc: "Our smart matching algorithm connects you with a licensed therapist that fits your needs, schedule, and preferences.", color: "pink" },
                    { step: "03", icon: Heart, title: "Begin Your Healing", desc: "Start sessions, log your mood daily, use Aura AI between sessions, and track your progress with visual insights.", color: "teal" },
                  ].map(item => (
                    <div key={item.step} className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                      <span className="absolute top-6 right-6 text-5xl font-black text-zinc-100 dark:text-zinc-800">{item.step}</span>
                      <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
                        item.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' :
                        item.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' :
                        'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300'
                      }`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SERVICES GRID */}
              <section className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-900 py-20">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-14">
                    <h2 className="text-4xl font-black mb-4">Everything You Need to Thrive</h2>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">A complete toolkit for mental wellness, designed with compassion.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { icon: MessageCircle, title: "Aura AI Chat", desc: "24/7 empathetic AI chat for guided coping, breathing exercises, and emotional support between therapy sessions.", tag: "AI-Powered" },
                      { icon: TrendingUp, title: "Mood Tracking & Charts", desc: "Log daily moods with emoji scores. Visualize your mental wellness journey through interactive trend charts.", tag: "Analytics" },
                      { icon: Video, title: "Video Therapy Sessions", desc: "Connect face-to-face with licensed therapists via secure, HIPAA-compliant video consultations.", tag: "Core Feature" },
                      { icon: FileText, title: "Clinical Worksheets", desc: "Access CBT worksheets, mindfulness exercises, grounding techniques, and self-care guides.", tag: "Resources" },
                      { icon: Calendar, title: "Smart Scheduling", desc: "Book sessions with your therapist, receive reminders, and track appointment status in real-time.", tag: "Scheduling" },
                      { icon: Award, title: "Progress Reports", desc: "Therapists and patients receive detailed progress insights, mood trends, and session summaries.", tag: "Insights" },
                    ].map(s => (
                      <div key={s.title} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <s.icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300">{s.tag}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ROLE SELECTOR CTA */}
              <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                  <h2 className="text-4xl font-black mb-4">Launch Your Dashboard</h2>
                  <p className="text-xl text-zinc-500 dark:text-zinc-400">Choose your role to enter your personalized workspace.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      key: 'patient' as Role, icon: Heart,
                      title: "Patient Workspace",
                      desc: "Log moods, chat with Aura AI, track your booking stepper, and access wellness resources.",
                      color: "from-purple-600 to-pink-600",
                      features: ["Mood Logger & SVG Chart", "Aura AI Chat Assistant", "Booking Stepper", "Educational Resources"],
                    },
                    {
                      key: 'therapist' as Role, icon: Activity,
                      title: "Therapist Portal",
                      desc: "Manage your appointment queue, write clinical notes, and control session workflows.",
                      color: "from-teal-600 to-cyan-600",
                      features: ["Session Queue Management", "Clinical Note Intake", "Confirm / Complete / Cancel", "Patient Details View"],
                    },
                    {
                      key: 'admin' as Role, icon: Shield,
                      title: "Admin Control Panel",
                      desc: "Monitor platform analytics, manage users, curate content, and oversee all appointments.",
                      color: "from-pink-600 to-rose-600",
                      features: ["Real-Time Analytics", "User Activation Toggle", "Category Management", "Resource Publisher"],
                    },
                  ].map(role => (
                    <motion.div key={role.key} whileHover={{ y: -6 }}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col cursor-pointer group"
                      onClick={() => setActiveRole(role.key)}>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg`}>
                        <role.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black mb-3">{role.title}</h3>
                      <p className="text-base text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">{role.desc}</p>
                      <ul className="space-y-2 mb-8">
                        {role.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <div className={`mt-auto flex items-center gap-2 text-base font-bold bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                        Open Workspace <ChevronRight className="w-5 h-5" style={{ color: 'rgb(139,92,246)' }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-20">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-14">
                    <h2 className="text-4xl font-black mb-4">Loved by Thousands</h2>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400">Real stories from patients and therapists on our platform.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { quote: "MindCare completely transformed how I manage my anxiety. The Aura AI is genuinely helpful between sessions.", name: "Sarah M.", role: "Patient, 8 months" },
                      { quote: "As a therapist, the clinical note system and session queue management saves me hours every week. It's incredibly intuitive.", name: "Dr. James T.", role: "Licensed Therapist" },
                      { quote: "The mood tracking chart helped me see patterns I never noticed before. My therapist uses it in every session now.", name: "Alex R.", role: "Patient, 5 months" },
                    ].map(t => (
                      <div key={t.name} className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                        </div>
                        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">"{t.quote}"</p>
                        <div>
                          <div className="font-bold text-base">{t.name}</div>
                          <div className="text-sm text-zinc-500">{t.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA BANNER */}
              <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 py-20 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                  <h2 className="text-4xl lg:text-5xl font-black mb-4">Ready to Start Healing?</h2>
                  <p className="text-xl text-white/80 mb-10">Join thousands of people who have transformed their mental health with MindCare.</p>
                  <button onClick={() => setActiveRole('patient')}
                    className="px-10 py-5 bg-white text-purple-700 rounded-2xl text-xl font-black shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all">
                    Start Your Journey Today →
                  </button>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="bg-zinc-950 text-zinc-400 py-16">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-black text-lg">MindCare</span>
                      </div>
                      <p className="text-sm leading-relaxed">Compassionate, AI-powered mental healthcare for everyone.</p>
                    </div>
                    {[
                      { heading: "Platform", links: ["Patient Dashboard", "Therapist Portal", "Admin Panel", "Aura AI"] },
                      { heading: "Resources", links: ["Blog & Articles", "Research", "Therapist Guide", "Help Center"] },
                      { heading: "Company", links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"] },
                    ].map(col => (
                      <div key={col.heading}>
                        <div className="text-white font-bold mb-4 text-base">{col.heading}</div>
                        <ul className="space-y-2">
                          {col.links.map(l => <li key={l} className="text-sm hover:text-white cursor-pointer transition-colors">{l}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                    <span>© 2026 MindCare. All rights reserved.</span>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +1 800 MINDCARE</span>
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> support@mindcare.app</span>
                    </div>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              PATIENT WORKSPACE
          ════════════════════════════════════════════════════════════════ */}
          {activeRole === 'patient' && (
            <motion.div key="patient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black">Patient Workspace 💙</h1>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">Track your mood, chat with Aura, and manage your sessions.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Aura AI Online
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

                {/* LEFT: Mood + Stepper */}
                <div className="xl:col-span-3 flex flex-col gap-8">

                  {/* Mood Logger Card */}
                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                          <Smile className="w-7 h-7 text-purple-500" /> Mood Tracker
                        </h2>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-1">How are you feeling today? Tap to log your mood.</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-bold">SVG Live Chart</span>
                    </div>

                    {/* Mood Buttons */}
                    <div className="flex justify-around bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-4 mb-6 border border-zinc-200 dark:border-zinc-800">
                      {[
                        { val: 1, emoji: "😢", label: "Very Low" },
                        { val: 2, emoji: "😕", label: "Low" },
                        { val: 3, emoji: "😐", label: "Okay" },
                        { val: 4, emoji: "🙂", label: "Good" },
                        { val: 5, emoji: "😊", label: "Great" },
                      ].map(m => (
                        <button key={m.val} onClick={() => logMood(m.val, m.emoji, m.label)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md hover:scale-110 active:scale-95 transition-all">
                          <span className="text-4xl">{m.emoji}</span>
                          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{m.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">7-Day Trend</div>
                      <MoodChart />
                    </div>
                  </Card>

                  {/* Booking Stepper */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
                      <Clock className="w-7 h-7 text-teal-500" /> Session Status
                    </h2>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 mb-8">Your appointment stepper — updated in real-time by your therapist.</p>

                    {appointments.length > 0 && (
                      <>
                        {appointments[0].status === 'cancelled' ? (
                          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 mb-6">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <span className="text-base font-semibold">This appointment was cancelled. Please book a new session below.</span>
                          </div>
                        ) : (
                          <div className="relative flex items-center justify-between max-w-lg mx-auto mb-8">
                            {/* Track */}
                            <div className="absolute left-0 right-0 top-5 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                            <div className="absolute left-0 top-5 h-1.5 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full transition-all duration-700"
                              style={{ width: appointments[0].status === 'pending' ? '20%' : appointments[0].status === 'confirmed' ? '70%' : '100%' }} />
                            {[
                              { label: "Booked", active: true },
                              { label: "Confirmed", active: ['confirmed','completed'].includes(appointments[0].status) },
                              { label: "Completed", active: appointments[0].status === 'completed' },
                            ].map((step, i) => (
                              <div key={i} className="relative flex flex-col items-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2 shadow-md transition-all ${
                                  step.active ? 'bg-purple-600 text-white border-purple-500 scale-110' : 'bg-white dark:bg-zinc-800 text-zinc-400 border-zinc-300 dark:border-zinc-600'
                                }`}>
                                  {step.active ? <CheckCircle className="w-5 h-5" /> : i + 1}
                                </div>
                                <span className="text-sm font-bold mt-2 text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{step.label}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          <div>
                            <p className="text-sm text-zinc-400 font-semibold uppercase tracking-wide mb-1">Next Session</p>
                            <p className="text-xl font-black text-purple-600 dark:text-purple-300">{appointments[0].therapist}</p>
                            <p className="text-base text-zinc-500 dark:text-zinc-400 mt-0.5">{appointments[0].date} at {appointments[0].time}</p>
                          </div>
                          <StatusBadge status={appointments[0].status} />
                        </div>
                      </>
                    )}

                    {/* Booking Form */}
                    <form onSubmit={bookAppointment} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Notification Email</label>
                        <input type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} required
                          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Session Date</label>
                        <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={today()} required
                          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-zinc-900 dark:text-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Therapist</label>
                        <select value={bookingTherapist} onChange={e => setBookingTherapist(e.target.value)}
                          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 text-zinc-900 dark:text-white">
                          {THERAPISTS.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <button type="submit"
                          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-teal-500 text-white text-base font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg">
                          Book Session
                        </button>
                      </div>
                    </form>
                  </Card>
                </div>

                {/* RIGHT: Aura AI */}
                <div className="xl:col-span-2 flex flex-col">
                  <Card className="flex flex-col h-[750px]">
                    {/* Chat Header */}
                    <div className="p-5 bg-gradient-to-r from-purple-600 to-teal-600 rounded-t-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-black text-base">Aura AI Assistant</div>
                          <div className="text-white/70 text-sm">Mental wellness guide</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-white text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Active
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex flex-col max-w-[88%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                          <div className={`px-4 py-3 rounded-2xl text-base leading-relaxed shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-purple-600 text-white rounded-tr-none'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-xs text-zinc-400 mt-1.5">{msg.timestamp}</span>
                        </div>
                      ))}
                      {auraTyping && (
                        <div className="self-start flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none shadow-sm">
                          {[0, 150, 300].map(d => (
                            <span key={d} className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick chips */}
                    <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                      <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Quick prompts</p>
                      <div className="flex flex-wrap gap-2">
                        {["Feeling anxious 😰", "Need a breathing exercise 🌬️", "Stressed about work 💼", "Feeling lonely 💙"].map(chip => (
                          <button key={chip} onClick={() => sendMessage(chip)}
                            className="px-3 py-1.5 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                      <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage(chatInput)}
                        placeholder="How are you feeling? Type here…"
                        className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
                      <button onClick={() => sendMessage(chatInput)}
                        className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors shadow-md">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              THERAPIST WORKSPACE
          ════════════════════════════════════════════════════════════════ */}
          {activeRole === 'therapist' && (
            <motion.div key="therapist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">

              <div>
                <h1 className="text-4xl font-black">Therapist Portal 🩺</h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">Manage your session queue, write clinical notes, and update patient statuses.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Queue */}
                <div className="lg:col-span-2">
                  <Card className="p-6 h-full">
                    <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
                      <Activity className="w-7 h-7 text-teal-500" /> Session Queue
                    </h2>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 mb-6">Tap a session to manage it.</p>
                    <div className="flex flex-col gap-3">
                      {appointments.map(appt => (
                        <div key={appt.id} onClick={() => setSelectedApptId(appt.id)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedApptId === appt.id
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-lg font-black text-purple-600 dark:text-purple-300">patient1</div>
                              <div className="text-sm text-zinc-400 mt-0.5">{appt.email}</div>
                            </div>
                            <StatusBadge status={appt.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinc-500">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{appt.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{appt.time}</span>
                          </div>
                        </div>
                      ))}
                      {appointments.length === 0 && (
                        <p className="text-base text-zinc-500 text-center py-12">No sessions scheduled yet.</p>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-3">
                  {selectedApptId && (() => {
                    const appt = appointments.find(a => a.id === selectedApptId);
                    if (!appt) return null;
                    return (
                      <Card className="p-8 flex flex-col gap-8">
                        <div>
                          <h2 className="text-2xl font-black flex items-center gap-2 mb-1">
                            <User className="w-7 h-7 text-purple-500" /> Patient Details
                          </h2>
                          <p className="text-base text-zinc-500 dark:text-zinc-400">Review and manage this session.</p>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                          {[
                            { label: "Patient", val: "patient1" },
                            { label: "Email", val: appt.email },
                            { label: "Session ID", val: `#${appt.id.toString().slice(-6)}` },
                            { label: "Status", val: appt.status.toUpperCase() },
                            { label: "Date", val: appt.date },
                            { label: "Time", val: appt.time },
                          ].map(item => (
                            <div key={item.label}>
                              <div className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{item.label}</div>
                              <div className="text-base font-bold mt-1">{item.val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Clinical notes */}
                        <div>
                          <label className="block text-base font-bold text-zinc-600 dark:text-zinc-300 mb-2">Clinical Notes</label>
                          <textarea value={clinicalNote} onChange={e => setClinicalNote(e.target.value)} rows={5}
                            placeholder="Patient presents with generalized anxiety. Discussion centered on cognitive restructuring techniques. Recommended daily breathing exercises and mood journaling…"
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-base leading-relaxed outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-zinc-900 dark:text-white resize-none" />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3">
                          {appt.status === 'pending' && <>
                            <button onClick={() => updateAppt(appt.id, 'confirmed')}
                              className="flex-1 sm:flex-none px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md">
                              <CheckCircle className="w-5 h-5" /> Confirm Appointment
                            </button>
                            <button onClick={() => updateAppt(appt.id, 'cancelled')}
                              className="flex-1 sm:flex-none px-6 py-3.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-base font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2">
                              <XCircle className="w-5 h-5" /> Cancel Session
                            </button>
                          </>}
                          {appt.status === 'confirmed' && <>
                            <button onClick={() => updateAppt(appt.id, 'completed')}
                              className="flex-1 sm:flex-none px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md">
                              <CheckCircle className="w-5 h-5" /> Mark as Completed
                            </button>
                            <button onClick={() => updateAppt(appt.id, 'cancelled')}
                              className="flex-1 sm:flex-none px-6 py-3.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-base font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                              <XCircle className="w-5 h-5" /> Cancel
                            </button>
                          </>}
                          {(appt.status === 'completed' || appt.status === 'cancelled') && (
                            <div className="w-full text-center text-base font-semibold text-zinc-500 py-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                              Session finalized — Status: <span className="font-black uppercase text-purple-600 dark:text-purple-300">{appt.status}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              ADMIN PANEL
          ════════════════════════════════════════════════════════════════ */}
          {activeRole === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">

              <div>
                <h1 className="text-4xl font-black">Admin Control Panel ⚙️</h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">Platform analytics, user management, and content moderation.</p>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Patients", val: users.filter(u => u.role === 'patient').length, icon: User, color: "purple" },
                  { label: "Therapists", val: users.filter(u => u.role === 'therapist').length, icon: Users, color: "teal" },
                  { label: "Active Bookings", val: appointments.filter(a => ['pending','confirmed'].includes(a.status)).length, icon: Calendar, color: "pink" },
                  { label: "Resources", val: resources.length, icon: BookOpen, color: "amber" },
                ].map(stat => (
                  <Card key={stat.label} className="p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' :
                      stat.color === 'teal' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300' :
                      stat.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
                    }`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{stat.label}</div>
                      <div className="text-3xl font-black mt-1">{stat.val}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Tabs */}
              <Card className="overflow-hidden flex flex-col">
                <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-6">
                  <div className="flex gap-1 overflow-x-auto">
                    {([
                      { key: 'users', label: 'User Directory', icon: Users },
                      { key: 'topics', label: 'Topics & Categories', icon: Compass },
                      { key: 'resources', label: 'Educational Resources', icon: BookOpen },
                    ] as { key: AdminTab; label: string; icon: React.ElementType }[]).map(tab => (
                      <button key={tab.key} onClick={() => setAdminTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-4 border-b-2 text-base font-bold whitespace-nowrap transition-all ${
                          adminTab === tab.key
                            ? 'border-purple-600 text-purple-600 dark:text-purple-300 dark:border-purple-400'
                            : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}>
                        <tab.icon className="w-4 h-4" />{tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">

                  {/* USERS TAB */}
                  {adminTab === 'users' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-xl font-black">Registered Users</h3>
                          <p className="text-base text-zinc-500 dark:text-zinc-400">Activate or deactivate accounts with a single click.</p>
                        </div>
                        <span className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-base font-bold">{users.length} total</span>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                              {["Username", "Email", "Role", "Status", "Action"].map(h => (
                                <th key={h} className="text-left px-5 py-4 text-sm font-black text-zinc-400 uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {users.map(u => (
                              <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                <td className="px-5 py-4 text-base font-bold">{u.username}</td>
                                <td className="px-5 py-4 text-base text-zinc-500 dark:text-zinc-400">{u.email}</td>
                                <td className="px-5 py-4">
                                  <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-bold uppercase">{u.role}</span>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`flex items-center gap-2 text-base font-bold ${u.active ? 'text-emerald-600' : 'text-red-500'}`}>
                                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${u.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    {u.active ? 'Active' : 'Deactivated'}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <button onClick={() => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, active: !x.active } : x))}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                      u.active
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100'
                                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                                    }`}>
                                    {u.active ? 'Deactivate' : 'Activate'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TOPICS TAB */}
                  {adminTab === 'topics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-black mb-1">Add Category</h3>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 mb-5">Create new therapy topic categories.</p>
                        <form onSubmit={e => { e.preventDefault(); if(newCatName.trim()){ setCategories(p => [...p, {id: Date.now(), name: newCatName}]); setNewCatName(""); }}}
                          className="flex gap-3">
                          <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
                            placeholder="e.g. Trauma & PTSD"
                            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 text-zinc-900 dark:text-white" required />
                          <button type="submit"
                            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-base font-bold rounded-xl flex items-center gap-2 shadow-md">
                            <Plus className="w-5 h-5" /> Add
                          </button>
                        </form>
                      </div>
                      <div>
                        <h3 className="text-xl font-black mb-1">Active Categories</h3>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 mb-5">{categories.length} categories published.</p>
                        <div className="grid grid-cols-2 gap-3">
                          {categories.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                              <span className="text-base font-bold">{c.name}</span>
                              <button onClick={() => setCategories(p => p.filter(x => x.id !== c.id))}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RESOURCES TAB */}
                  {adminTab === 'resources' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-black mb-1">Publish Resource</h3>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 mb-5">Add articles, videos, and exercises.</p>
                        <form onSubmit={e => {
                          e.preventDefault();
                          if(!newResTitle.trim() || !newResBody.trim()) return;
                          setResources(p => [...p, { id: Date.now(), title: newResTitle, category: newResCat, type: newResType, urlOrBody: newResBody }]);
                          setNewResTitle(""); setNewResBody("");
                        }} className="flex flex-col gap-4">
                          <input value={newResTitle} onChange={e => setNewResTitle(e.target.value)}
                            placeholder="Resource title…"
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 text-zinc-900 dark:text-white" required />
                          <div className="grid grid-cols-2 gap-3">
                            <select value={newResCat} onChange={e => setNewResCat(e.target.value)}
                              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none text-zinc-900 dark:text-white">
                              {categories.map(c => <option key={c.id}>{c.name}</option>)}
                            </select>
                            <select value={newResType} onChange={e => setNewResType(e.target.value as ResourceType)}
                              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none text-zinc-900 dark:text-white">
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="exercise">Exercise</option>
                            </select>
                          </div>
                          <textarea value={newResBody} onChange={e => setNewResBody(e.target.value)} rows={3}
                            placeholder="Content body or YouTube URL…"
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-base outline-none focus:border-purple-500 resize-none text-zinc-900 dark:text-white" required />
                          <button type="submit"
                            className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 shadow-md">
                            <PlusCircle className="w-5 h-5" /> Publish Resource
                          </button>
                        </form>
                      </div>
                      <div className="lg:col-span-3">
                        <h3 className="text-xl font-black mb-1">Resource Catalog</h3>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 mb-5">{resources.length} resources published.</p>
                        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                          {resources.map(r => (
                            <div key={r.id} className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h4 className="text-base font-black">{r.title}</h4>
                                  <span className="px-2 py-0.5 text-xs font-bold bg-zinc-200 dark:bg-zinc-700 rounded uppercase">{r.type}</span>
                                  <span className="text-sm font-semibold text-purple-600 dark:text-teal-400">{r.category}</span>
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 font-mono truncate">{r.urlOrBody}</p>
                              </div>
                              <button onClick={() => setResources(p => p.filter(x => x.id !== r.id))}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0">
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
