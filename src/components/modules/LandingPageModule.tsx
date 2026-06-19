"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, Lock, CheckCircle, User, Users, Heart,
  MessageCircle, TrendingUp, Video, FileText, Calendar, Award,
  Activity, Shield, ChevronRight, Star, Brain, Phone, Mail
} from 'lucide-react';

type Role = 'patient' | 'therapist' | 'admin';

export default function LandingPageModule({ onRoleSelect }: { onRoleSelect?: (role: Role) => void }) {
  const handleRoleClick = (role: Role) => {
    if (onRoleSelect) {
      onRoleSelect(role);
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-full">
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
            <Link href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl text-white text-lg font-bold shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" /> Log In
            </Link>
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
          {["HIPAA Compliant", "End-to-End Encrypted", "AI-Powered Insights", "24/7 MindCare Support", "Licensed Therapists Only"].map(f => (
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
            { step: "01", icon: User, title: "Create Your Profile", desc: "Sign up in minutes. Tell us about your goals and what you're going through — everything stays private and secure.", color: "purple", btnText: "Sign Up Now", link: "/signup" },
            { step: "02", icon: Users, title: "Match With a Therapist", desc: "Our smart matching algorithm connects you with a licensed therapist that fits your needs, schedule, and preferences.", color: "pink", btnText: "Find Therapist", link: "/signup" },
            { step: "03", icon: Heart, title: "Begin Your Healing", desc: "Start sessions, log your mood daily, use MindCare AI between sessions, and track your progress with visual insights.", color: "teal", btnText: "Open Dashboard", link: "/login" },
          ].map(item => (
            <div key={item.step} className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all flex flex-col group">
              <span className="absolute top-6 right-6 text-5xl font-black text-zinc-100 dark:text-zinc-800 transition-colors group-hover:text-zinc-200 dark:group-hover:text-zinc-700">{item.step}</span>
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
                item.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' :
                item.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' :
                'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300'
              }`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1">{item.desc}</p>
              <Link href={item.link} className={`mt-auto w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                item.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:text-purple-300' :
                item.color === 'pink' ? 'bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:hover:bg-pink-900/40 dark:text-pink-300' :
                'bg-teal-50 hover:bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 dark:text-teal-300'
              }`}>
                {item.btnText} <ArrowRight className="w-4 h-4" />
              </Link>
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
              { icon: MessageCircle, title: "MindCare AI Chat", desc: "24/7 empathetic AI chat for guided coping, breathing exercises, and emotional support between therapy sessions.", tag: "AI-Powered" },
              { icon: TrendingUp, title: "Mood Tracking & Charts", desc: "Log daily moods with emoji scores. Visualize your mental wellness journey through interactive trend charts.", tag: "Analytics" },
              { icon: Video, title: "Video Therapy Sessions", desc: "Connect face-to-face with licensed therapists via secure, HIPAA-compliant video consultations.", tag: "Core Feature" },
              { icon: FileText, title: "Clinical Worksheets", desc: "Access CBT worksheets, mindfulness exercises, grounding techniques, and self-care guides.", tag: "Resources" },
              { icon: Calendar, title: "Smart Scheduling", desc: "Book sessions with your therapist, receive reminders, and track appointment status in real-time.", tag: "Scheduling" },
              { icon: Award, title: "Progress Reports", desc: "Therapists and patients receive detailed progress insights, mood trends, and session summaries.", tag: "Insights" },
            ].map(s => (
              <div key={s.title} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300">{s.tag}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1">{s.desc}</p>
                <button onClick={() => handleRoleClick('patient')} className="mt-auto text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all w-fit">
                  Explore Feature <ArrowRight className="w-4 h-4" />
                </button>
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
              desc: "Log moods, chat with MindCare AI, track your booking stepper, and access wellness resources.",
              color: "from-purple-600 to-pink-600",
              features: ["Mood Logger & SVG Chart", "MindCare AI Chat Assistant", "Booking Stepper", "Educational Resources"],
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
              onClick={() => handleRoleClick(role.key)}>
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
              { quote: "MindCare completely transformed how I manage my anxiety. The MindCare AI is genuinely helpful between sessions.", name: "Sarah M.", role: "Patient, 8 months" },
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
          <Link href="/signup"
            className="inline-block px-10 py-5 bg-white text-purple-700 rounded-2xl text-xl font-black shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all">
            Start Your Journey Today →
          </Link>
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
              { heading: "Platform", links: ["Patient Dashboard", "Therapist Portal", "Admin Panel", "MindCare AI"] },
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
    </div>
  );
}
