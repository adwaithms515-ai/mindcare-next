"use client";

import React, { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Shield, User, Heart, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signUpUser } from "../actions"

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'therapist' | 'admin'>('patient');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signUpUser(username, email, password, role);
      if (result && result.error) {
        alert("Error creating account: " + result.error);
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

    setShowPopup(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000); // redirect after 2s of showing popup
  };
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12">
      {/* Background ambient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 blur-[120px] animate-pulse-ring" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse-ring" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md px-4 sm:px-6 z-10 relative">

        {/* Success Popup Modal */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl"
            >
              <div className="bg-white dark:bg-zinc-900 border border-teal-200 dark:border-teal-900/50 p-8 rounded-2xl shadow-xl shadow-teal-500/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-2">Account Created!</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Redirecting you to your dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-glass border-glass rounded-2xl p-8 shadow-glow-teal backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-glow-purple">Create an account</h1>
            <p className="text-muted-foreground text-sm">
              Join MindCare to start your wellness journey
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
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
                        ? 'bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-300 shadow-glow-teal' 
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
              <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-glass focus:bg-background"
                  placeholder="John Doe"
                  required
                />
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
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-glass focus:bg-background"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-glass focus:bg-background"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Choose a strong password.</p>
            </div>

            <Button 
              type="submit"
              disabled={isLoading || showPopup}
              className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/25 transition-all duration-300">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-teal-500 hover:text-teal-400 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
