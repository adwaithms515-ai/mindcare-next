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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background ambient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse-ring" />
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px] animate-pulse-ring" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md px-4 sm:px-6 z-10 relative">

        <div className="bg-glass border-glass rounded-2xl p-8 shadow-glow-purple backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-glow-purple">
              {role === 'patient' ? 'Welcome to MindCare' : 
               role === 'therapist' ? 'Therapist Portal' : 'Admin Portal'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {role === 'patient' ? 'Sign in to manage your appointments, view your progress, and connect with your therapist securely.' : 
               'Enter your credentials to access your account.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none text-foreground">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'patient', label: 'Patient', icon: Heart },
                  { id: 'therapist', label: 'Therapist', icon: User },
                  { id: 'admin', label: 'Admin', icon: Shield },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as 'patient' | 'therapist' | 'admin')}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${
                      role === r.id 
                        ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 shadow-glow-purple' 
                        : 'border-glass bg-background/50 text-muted-foreground hover:bg-background'
                    }`}
                  >
                    <r.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-glass focus:bg-background"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-purple-500 hover:text-purple-400">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-glass focus:bg-background"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300">
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-purple-500 hover:text-purple-400 underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>

          {role === 'patient' && (
            <div className="mt-8 border-t border-glass pt-6">
              <h3 className="text-sm font-medium text-foreground mb-4 text-center">Why choose MindCare?</h3>
              <ul className="space-y-3 text-xs text-muted-foreground text-left">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Access to a network of certified therapists and mental health professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Secure, private, and confidential messaging and video sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Personalized progress tracking and wellness resources at your fingertips</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
