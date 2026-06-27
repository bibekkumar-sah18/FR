"use client";

import { useState } from "react";
import { User, ShieldCheck, CreditCard, Settings, Fingerprint, LogOut, ChevronRight, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    // Clear any session/auth data
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    setTimeout(() => {
      // Use replace so user can't press back to return to dashboard
      router.replace("/login");
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* User Card */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-full p-0.5">
          <div className="w-full h-full bg-background rounded-full border-2 border-background overflow-hidden flex items-center justify-center">
            <User className="w-8 h-8 text-foreground/50" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Bibek</h2>
          <p className="text-sm text-foreground/60">bibek@example.com</p>
          <div className="flex items-center gap-1 mt-1 bg-success/10 text-success px-2 py-0.5 rounded-md w-max">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">KYC Verified</span>
          </div>
        </div>
      </div>

      {/* Security Score */}
      <div className="bg-gradient-to-r from-success/20 to-success/5 border border-success/30 rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-success mb-1">Security Score</h3>
          <p className="text-xs text-foreground/70">Your account is highly secure.</p>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-success flex items-center justify-center font-bold text-success">
          98
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-2">
        <h3 className="font-semibold px-2 mb-2 text-foreground/80">Account & Security</h3>
        
        {[
          { name: "Linked Bank Accounts", icon: CreditCard, value: "2 Accounts" },
          { name: "Biometric Login", icon: Fingerprint, value: "Enabled" },
          { name: "Privacy Settings", icon: ShieldCheck, value: "" },
          { name: "App Settings", icon: Settings, value: "" },
        ].map((item, i) => (
          <Link key={i} href="#" className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-foreground/80" />
              </div>
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-xs text-foreground/50">{item.value}</span>}
              <ChevronRight className="w-4 h-4 text-foreground/40" />
            </div>
          </Link>
        ))}
      </div>

      <button 
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full py-4 rounded-2xl border border-danger/30 text-danger font-semibold flex items-center justify-center gap-2 hover:bg-danger/10 transition-colors mt-8"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-danger/10 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-danger" />
                </div>
                <button onClick={() => setShowLogoutConfirm(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>
              <h3 className="text-lg font-bold mb-1">Log Out?</h3>
              <p className="text-sm text-foreground/60 mb-6">You will be redirected to the login screen. Your data is safely stored.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-secondary/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex-1 py-3 rounded-xl bg-danger text-white font-semibold text-sm hover:bg-danger/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loggingOut ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
