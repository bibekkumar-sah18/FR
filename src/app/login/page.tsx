"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Fingerprint, Lock, ShieldCheck, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("bibek@example.com");
  const [password, setPassword] = useState("password123");

  const handleLogin = () => {
    setLoading(true);
    // In a real app, validate credentials here
    setTimeout(() => {
      // Use replace so user can't go back to login with back button
      router.replace("/dashboard");
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="pt-16 pb-8">
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-foreground/60 text-center flex items-center justify-center gap-1 text-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            End-to-End Encrypted Session
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1"
      >
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-secondary/30 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground/40"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password or PIN" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-secondary/30 border border-border rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </button>
          </div>
        </div>

        <button
          id="login-btn"
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="mt-10 flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-px bg-border flex-1" />
            <span className="text-foreground/40 text-sm font-medium">Or log in with</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <button 
            id="biometric-login-btn"
            onClick={handleLogin}
            className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary/50 transition-colors shadow-lg group relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Fingerprint className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
          </button>
          <p className="mt-4 text-sm text-foreground/60">Biometric Login</p>
        </div>
      </motion.div>
    </div>
  );
}
