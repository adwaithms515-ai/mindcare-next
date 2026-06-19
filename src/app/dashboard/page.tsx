"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain, Heart, Smile, Activity, User, Users, Send,
  Calendar, CheckCircle, XCircle, Plus, Trash, PlusCircle, LogOut,
  Compass, Shield, BookOpen, Clock, AlertCircle, ChevronRight,
  Star, ArrowRight, Phone, Mail, MapPin, Menu, X, TrendingUp, Lock,
  MessageCircle, Video, FileText, Award, Zap, Globe, Eye, EyeOff, KeyRound, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";

// Server Actions
import {
  getMoodLogs, addMoodLog,
  getAppointments, bookAppointment as bookAppointmentServer, updateAppointmentStatus,
  getChatMessages, sendChatMessage,
  getUsers, toggleUserActive,
  getCategories, getResources, addCategory, addResource,
  getAssessments, addAssessment,
  getJournalEntries, addJournalEntry,
  getActivityLogs, addActivityLog,
  getGoals, addGoal, updateGoalStatus,
  getHabits, addHabit, incrementHabitStreak,
  getTherapistPatientData
} from "../actions";

import AssessmentsModule from "../../components/modules/AssessmentsModule";
import WellnessJournalModule from "../../components/modules/WellnessJournalModule";
import GuidedActivitiesModule from "../../components/modules/GuidedActivitiesModule";
import GoalsHabitsModule from "../../components/modules/GoalsHabitsModule";
import AdvancedDashboardModule from "../../components/modules/AdvancedDashboardModule";
import EmergencySupportModule from "../../components/modules/EmergencySupportModule";
import TherapistPatientProfileModule from "../../components/modules/TherapistPatientProfileModule";
import VideoSessionModule from "../../components/modules/VideoSessionModule";
import LandingPageModule from "../../components/modules/LandingPageModule";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        if (user.role) {
          setActiveRole(user.role as Role);
        }
      } catch(e){}
      setAuthChecked(true);
    } else {
      window.location.href = '/login';
    }
  }, []);

  // Admin auth state
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginShake, setLoginShake] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

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
    { id: 1, sender: "aura", text: "Hello! I'm MindCare, your personal mental wellness guide. How are you feeling today? 💙", timestamp: "Now" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [auraTyping, setAuraTyping] = useState(false);
  const [bookingEmail, setBookingEmail] = useState("patient1@mindwell.com");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTherapist, setBookingTherapist] = useState(THERAPISTS[0]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Advanced Modules State
  const [patientTab, setPatientTab] = useState('overview');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);

  // Therapist state
  const [selectedApptId, setSelectedApptId] = useState<number | null>(1);
  const [clinicalNote, setClinicalNote] = useState("");
  const [therapistPatientData, setTherapistPatientData] = useState<any>(null);
  const [isFetchingPatientData, setIsFetchingPatientData] = useState(false);

  // Video Session State
  const [isVideoSessionActive, setIsVideoSessionActive] = useState(false);
  const [videoRemoteName, setVideoRemoteName] = useState("");

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

  // Fetch initial data
  const refreshData = async () => {
    try {
      // Hardcoded user IDs for demo purposes based on active role
      const patientId = '11111111-1111-1111-1111-111111111111';
      
      if (activeRole === 'patient') {
        const [
          fetchedMoods, fetchedAppts, fetchedChats,
          fetchedAssessments, fetchedJournals, fetchedActivities, fetchedGoals, fetchedHabits
        ] = await Promise.all([
          getMoodLogs(patientId),
          getAppointments(patientId),
          getChatMessages(patientId),
          getAssessments(patientId),
          getJournalEntries(patientId),
          getActivityLogs(patientId),
          getGoals(patientId),
          getHabits(patientId)
        ]);
        if (fetchedMoods.length) setMoodLogs(fetchedMoods);
        if (fetchedAppts.length) setAppointments(fetchedAppts);
        if (fetchedChats.length) setChatMessages(fetchedChats);
        if (fetchedAssessments.length) setAssessments(fetchedAssessments);
        if (fetchedJournals.length) setJournalEntries(fetchedJournals);
        if (fetchedActivities.length) setActivityLogs(fetchedActivities);
        if (fetchedGoals.length) setGoals(fetchedGoals);
        if (fetchedHabits.length) setHabits(fetchedHabits);
      } else if (activeRole === 'therapist') {
        const fetchedAppts = await getAppointments();
        if (fetchedAppts.length) setAppointments(fetchedAppts);
        
        // Fetch default selected patient
        if (selectedApptId) {
           setIsFetchingPatientData(true);
           const ptData = await getTherapistPatientData('11111111-1111-1111-1111-111111111111');
           setTherapistPatientData(ptData);
           setIsFetchingPatientData(false);
        }
      } else if (activeRole === 'admin') {
        const [fetchedUsers, fetchedCats, fetchedRes, fetchedAppts] = await Promise.all([
          getUsers(), getCategories(), getResources(), getAppointments()
        ]);
        if (fetchedUsers.length) setUsers(fetchedUsers);
        if (fetchedCats.length) setCategories(fetchedCats);
        if (fetchedRes.length) setResources(fetchedRes);
        if (fetchedAppts.length) setAppointments(fetchedAppts);
      }
    } catch (e) {
      console.warn("Backend not configured or failed, using local mock data:", e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeRole]);

  useEffect(() => {
    if (activeRole === 'therapist' && selectedApptId) {
      setIsFetchingPatientData(true);
      // Hardcoded ID for demo
      getTherapistPatientData('11111111-1111-1111-1111-111111111111').then(data => {
        setTherapistPatientData(data);
        setIsFetchingPatientData(false);
      }).catch(err => {
        console.error("Failed to fetch patient data:", err);
        setIsFetchingPatientData(false);
      });
    }
  }, [selectedApptId, activeRole]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const today = () => new Date().toISOString().split('T')[0];

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const logMood = async (score: number, emoji: string, label: string) => {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setMoodLogs(prev => [...prev, { date, score, emoji, label }]);
    
    try {
      await addMoodLog('11111111-1111-1111-1111-111111111111', score, emoji, label);
    } catch (e) {
      console.warn("Could not save mood to backend:", e);
    }

    if (score <= 2) {
      setTimeout(() => {
        setAuraTyping(true);
        setTimeout(async () => {
          const text = `I see you're feeling ${label.toLowerCase()} ${emoji}. That's completely okay. I'm here with you. Would you like to try a quick breathing exercise or talk about what's on your mind?`;
          setChatMessages(prev => [...prev, {
            id: Date.now(), sender: "aura", text, timestamp: now()
          }]);
          setAuraTyping(false);
          try {
            await sendChatMessage('11111111-1111-1111-1111-111111111111', text, 'aura', now());
          } catch (e) {}
        }, 1200);
      }, 300);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "user", text, timestamp: now() }]);
    setChatInput("");
    
    try {
      await sendChatMessage('11111111-1111-1111-1111-111111111111', text, 'user', now());
    } catch (e) {
      console.warn("Could not save user message to backend:", e);
    }

    setAuraTyping(true);
    setTimeout(async () => {
      const key = Object.keys(AURA_RESPONSES).find(k => text.toLowerCase().includes(k)) || 'default';
      const responseText = AURA_RESPONSES[key];
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: "aura", text: responseText, timestamp: now() }]);
      setAuraTyping(false);
      try {
        await sendChatMessage('11111111-1111-1111-1111-111111111111', responseText, 'aura', now());
      } catch (e) {}
    }, 1300);
  };

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) return;
    const tempId = Date.now();
    setAppointments(prev => [{ id: tempId, date: bookingDate, time: "10:00", therapist: bookingTherapist, status: "pending", email: bookingEmail }, ...prev]);
    setSelectedApptId(tempId);
    
    try {
      await bookAppointmentServer('11111111-1111-1111-1111-111111111111', bookingTherapist, bookingDate, "10:00", bookingEmail);
      await refreshData();
    } catch (e) {
      console.warn("Could not save appointment to backend:", e);
    }
    
    setBookingDate("");
  };

  const updateAppt = async (id: number, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await updateAppointmentStatus(id, status);
    } catch (e) {
      console.warn("Could not update appointment status in backend:", e);
    }
  };

  // Admin login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    // Simulated auth delay
    setTimeout(() => {
      if (loginEmail === 'admin@mindcare.com' && loginPassword === 'admin123') {
        setAdminAuthenticated(true);
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
        setLoginLoading(false);
      } else {
        setLoginError('Invalid email or password. Please try again.');
        setLoginShake(true);
        setLoginLoading(false);
        setTimeout(() => setLoginShake(false), 600);
      }
    }, 800);
  };

  // Role change — reset admin auth when leaving admin
  const handleRoleChange = (role: Role) => {
    if (activeRole === 'admin' && role !== 'admin') {
      setAdminAuthenticated(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
    }
    setActiveRole(role);
    setMobileMenuOpen(false);
  };

// ─── Shared Components ──────────────────────────────────────────────────────
const Section = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={`w-full ${className}`}>
    {children}
  </motion.section>
);

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const map = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    confirmed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${map[status]}`}>{status}</span>;
};

const MoodChart = ({ moodLogs }: { moodLogs: MoodLog[] }) => {
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

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">

      {isVideoSessionActive && (
        <VideoSessionModule 
          remoteName={videoRemoteName} 
          onEndCall={() => setIsVideoSessionActive(false)} 
        />
      )}

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => handleRoleChange('landing')} className="flex items-center gap-3">
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
            {currentUser ? (
               <div className="px-4 py-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
                 Logged in as: {currentUser.username} ({currentUser.role})
               </div>
            ) : (
              ([
                { key: 'landing', label: 'Home' },
                { key: 'patient', label: '💙 Patient Space' },
                { key: 'therapist', label: '🩺 Therapist' },
                { key: 'admin', label: '⚙️ Admin Panel' },
              ] as { key: Role; label: string }[]).map(tab => (
                <button key={tab.key} onClick={() => handleRoleChange(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeRole === tab.key
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-purple-600 dark:text-purple-300'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}>
                  {tab.label}
                </button>
              ))
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-lg">
              {isDark ? '☀️' : '🌙'}
            </button>
            {currentUser ? (
              <button onClick={() => {
                  localStorage.removeItem('currentUser');
                  window.location.href = '/login';
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <LogOut className="w-4 h-4 text-red-500" />
                Sign Out
              </button>
            ) : activeRole !== 'landing' && (
              <button onClick={() => handleRoleChange('landing')}
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
            {currentUser ? (
               <div className="px-4 py-3 text-base font-semibold text-purple-600 dark:text-purple-300">
                 Logged in as: {currentUser.username} ({currentUser.role})
               </div>
            ) : (
              ([
                { key: 'landing', label: 'Home' },
                { key: 'patient', label: 'Patient Space' },
                { key: 'therapist', label: 'Therapist' },
                { key: 'admin', label: 'Admin Panel' },
              ] as { key: Role; label: string }[]).map(tab => (
                <button key={tab.key} onClick={() => handleRoleChange(tab.key)}
                  className="text-left px-4 py-3 rounded-xl text-base font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  {tab.label}
                </button>
              ))
            )}
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
               <LandingPageModule onRoleSelect={(role) => handleRoleChange(role)} />
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
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">Track your mood, chat with MindCare, and manage your sessions.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button onClick={() => { setVideoRemoteName("Dr. Sarah Jenkins"); setIsVideoSessionActive(true); }} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                    <Video className="w-4 h-4" /> Join Video Session
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    MindCare AI Online
                  </div>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {[
                  { id: 'overview', label: 'Overview', icon: Brain },
                  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                  { id: 'assessments', label: 'Assessments', icon: FileText },
                  { id: 'journal', label: 'Journal', icon: BookOpen },
                  { id: 'activities', label: 'Activities', icon: Heart },
                  { id: 'goals', label: 'Goals', icon: Award },
                  { id: 'emergency', label: 'SOS Support', icon: AlertTriangle, color: 'text-red-500' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setPatientTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                      patientTab === tab.id 
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg' 
                        : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}>
                    <tab.icon className={`w-4 h-4 ${tab.color || ''}`} />
                    <span className={tab.color || ''}>{tab.label}</span>
                  </button>
                ))}
              </div>

              {patientTab === 'overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                      <MoodChart moodLogs={moodLogs} />
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
                          <div className="text-white font-black text-base">MindCare AI Assistant</div>
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
              )}

              {patientTab === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdvancedDashboardModule 
                    moodLogs={moodLogs} 
                    assessments={assessments} 
                    entries={journalEntries} 
                    goals={goals} 
                    activityLogs={activityLogs} 
                  />
                </div>
              )}

              {patientTab === 'assessments' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AssessmentsModule 
                    userId="11111111-1111-1111-1111-111111111111"
                    assessments={assessments}
                    onAddAssessment={async (type, score, answers) => {
                      const res = await addAssessment("11111111-1111-1111-1111-111111111111", type, score, answers);
                      setAssessments(prev => [res, ...prev]);
                    }}
                  />
                </div>
              )}

              {patientTab === 'journal' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <WellnessJournalModule 
                    userId="11111111-1111-1111-1111-111111111111"
                    entries={journalEntries}
                    onAddEntry={async (title, content, mood, isVoice) => {
                      const res = await addJournalEntry("11111111-1111-1111-1111-111111111111", title, content, mood, isVoice);
                      setJournalEntries(prev => [res, ...prev]);
                    }}
                  />
                </div>
              )}

              {patientTab === 'activities' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <GuidedActivitiesModule 
                    userId="11111111-1111-1111-1111-111111111111"
                    logs={activityLogs}
                    onAddLog={async (type, duration) => {
                      const res = await addActivityLog("11111111-1111-1111-1111-111111111111", type, duration);
                      setActivityLogs(prev => [res, ...prev]);
                    }}
                  />
                </div>
              )}

              {patientTab === 'goals' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <GoalsHabitsModule 
                    userId="11111111-1111-1111-1111-111111111111"
                    goals={goals}
                    habits={habits}
                    onAddGoal={async (title, target) => {
                      const res = await addGoal("11111111-1111-1111-1111-111111111111", title, target);
                      setGoals(prev => [res, ...prev]);
                    }}
                    onUpdateGoal={async (id, current, status) => {
                      const res = await updateGoalStatus(id, current, status);
                      setGoals(prev => prev.map(g => g.id === id ? res : g));
                    }}
                    onAddHabit={async (title) => {
                      const res = await addHabit("11111111-1111-1111-1111-111111111111", title);
                      setHabits(prev => [res, ...prev]);
                    }}
                    onIncrementHabit={async (id) => {
                      const res = await incrementHabitStreak(id);
                      setHabits(prev => prev.map(h => h.id === id ? res : h));
                    }}
                  />
                </div>
              )}

              {patientTab === 'emergency' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <EmergencySupportModule />
                </div>
              )}

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
                  {isFetchingPatientData ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center h-full min-h-[500px]">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-zinc-500 font-bold">Loading patient profile securely...</p>
                    </div>
                  ) : selectedApptId && therapistPatientData ? (() => {
                    const appt = appointments.find(a => a.id === selectedApptId);
                    if (!appt) return null;
                    return (
                      <div className="h-full min-h-[700px]">
                        <TherapistPatientProfileModule 
                          appt={appt}
                          data={therapistPatientData}
                          onUpdateAppt={async (id, status) => {
                            await updateAppt(id, status as any);
                          }}
                          onJoinVideoCall={() => {
                            setVideoRemoteName(therapistPatientData?.profile?.full_name || appt.email);
                            setIsVideoSessionActive(true);
                          }}
                        />
                      </div>
                    );
                  })() : (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center h-full min-h-[500px] text-zinc-500">
                      Select a patient from the queue to view details
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              ADMIN PANEL
          ════════════════════════════════════════════════════════════════ */}
          {activeRole === 'admin' && !adminAuthenticated && (
            <motion.div key="admin-login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex items-center justify-center min-h-[80vh] px-6 py-20">
              <div className="w-full max-w-md">

                {/* Login Card */}
                <motion.div
                  animate={loginShake ? { x: [-12, 12, -10, 10, -6, 6, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-teal-600 px-8 py-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
                    <p className="text-base text-white/70">Secure access to the MindCare control panel</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAdminLogin} className="p-8 flex flex-col gap-5">
                    {/* Error */}
                    {loginError && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-semibold">{loginError}</span>
                      </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                          placeholder="admin@mindcare.com" required autoFocus
                          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                          placeholder="••••••••" required
                          className="w-full pl-12 pr-12 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-zinc-900 dark:text-white"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loginLoading}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white text-lg font-black rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                      {loginLoading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in…
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-5 h-5" /> Sign In to Admin Panel
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer hint */}
                  <div className="px-8 pb-8">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                      <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Demo Credentials</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 font-mono">admin@mindcare.com / admin123</p>
                    </div>
                  </div>
                </motion.div>

                {/* Security badge */}
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-zinc-400">
                  <Lock className="w-3.5 h-3.5" />
                  256-bit SSL encrypted · HIPAA compliant
                </div>
              </div>
            </motion.div>
          )}

          {activeRole === 'admin' && adminAuthenticated && (
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
