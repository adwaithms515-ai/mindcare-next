"use client";

import React, { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Shield, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { loginUser } from "../actions"

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'therapist' | 'admin'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await loginUser(email, password);
      if (result && result.error) {
        alert("Error logging in: " + result.error);
        setIsLoading(false);
        return;
      }

      if (result.data) {
        localStorage.setItem('currentUser', JSON.stringify(result.data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  };
  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-gradient-to-br from-purple-950 via-zinc-950 to-teal-950">

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-ring" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-teal-600/20 blur-[120px] animate-pulse-ring" style={{ animationDelay: "1s" }} />
      </div>

      {/* LEFT PANE - Visual/Branding */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 z-10">
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl">
            <Heart className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">
            Your Journey to <br /> Better Mental Health.
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed mb-12">
            MindCare connects you with licensed therapists, AI-guided tools, and structured pathways in one premium platform.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-semibold text-zinc-200 text-lg">100% Secure & Private</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <span className="font-semibold text-zinc-200 text-lg">Licensed Professionals Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">

        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-3 text-white">
              {role === 'patient' ? 'Welcome Back' : role === 'therapist' ? 'Therapist Portal' : 'Admin Portal'}
            </h2>
            <p className="text-zinc-300 text-base font-medium">
              {role === 'patient' ? 'Please enter your details to sign in to your account.' : 'Enter your professional credentials to continue.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'patient', label: 'Patient', icon: Heart },
                  { id: 'therapist', label: 'Therapist', icon: User },
                  { id: 'admin', label: 'Admin', icon: Shield },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as 'patient' | 'therapist' | 'admin')}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${role === r.id
                        ? 'border-purple-400 bg-purple-500/20 text-white shadow-sm scale-[1.02]'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/30 hover:bg-white/10 hover:scale-[1.02]'
                      }`}
                  >
                    <r.icon className="w-5 h-5" />
                    <span className="text-sm font-bold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/50">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="flex h-12 w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2 pl-12 text-base font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-bold text-teal-300 hover:text-teal-200 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/50">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="flex h-12 w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2 pl-12 text-base font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-400 hover:to-teal-400 text-white rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center text-base font-medium text-zinc-300">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-purple-300 hover:text-purple-200 underline-offset-4 hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
