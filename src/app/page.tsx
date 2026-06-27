/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, PieChart, TrendingUp, ShieldCheck, ArrowRight,
  Lock, Mail, Fingerprint, Eye, EyeOff,
  Home, Target, User, Sparkles, Bell,
  ArrowUpRight, ArrowDownRight, Bot, Mic, Send, Globe,
  StopCircle, Volume2, AlertCircle, ChevronRight,
  CreditCard, Settings, LogOut, X, AlertTriangle, ArrowLeft,
  Camera, Check, TrendingDown, Gift, Shield
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "splash" | "onboarding" | "login" | "dashboard" | "advisor" | "profile";
type Message = { id: number; text: string; sender: "user" | "ai"; isVoice?: boolean };

// ─── Data ─────────────────────────────────────────────────────────────────────
const onboardingSteps = [
  {
    title: "Track your spending",
    description: "Get real-time insights into your expenses with AI-powered categorization.",
    icon: PieChart,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Grow your wealth with AI",
    description: "Personalized investment strategies tailored for your financial goals.",
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Plan your financial goals",
    description: "Set targets, automate savings, and track your progress seamlessly.",
    icon: ShieldCheck,
    color: "text-success",
    bg: "bg-success/10",
  },
];

const portfolioData = [
  { name: "Mon", value: 12400 },
  { name: "Tue", value: 12500 },
  { name: "Wed", value: 12800 },
  { name: "Thu", value: 12750 },
  { name: "Fri", value: 13200 },
  { name: "Sat", value: 13450 },
  { name: "Sun", value: 13800 },
];

const indianLanguages = [
  { code: "en-IN", name: "English (IN)" },
  { code: "hi-IN", name: "Hindi (हिंदी)" },
  { code: "bn-IN", name: "Bengali (বাংলা)" },
  { code: "ta-IN", name: "Tamil (தமிழ்)" },
  { code: "te-IN", name: "Telugu (తెలుగు)" },
  { code: "mr-IN", name: "Marathi (मराठी)" },
  { code: "gu-IN", name: "Gujarati (ગુજરાતી)" },
  { code: "kn-IN", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml-IN", name: "Malayalam (മലയാളം)" },
  { code: "pa-IN", name: "Punjabi (ਪੰਜਾਬੀ)" },
];

// ─── AI Response Engine ───────────────────────────────────────────────────────
const generateAIResponse = (input: string): string => {
  const lower = input.toLowerCase();

  if (lower.match(/\b(10k|10000|10,000)\b/))
    return "With ₹10,000, I'd suggest starting an SIP in a Nifty 50 Index Fund for stable long-term growth, and allocating 20% to digital gold for diversification. Would you like to see the expected returns?";
  if (lower.match(/\b(sector|sectors|industry|industries)\b/))
    return "Currently, IT and Renewable Energy sectors are showing strong growth potential. Given your aggressive risk profile, allocating 15% to a Tech Sector Mutual Fund could be highly beneficial. Want to see top-performing funds?";
  if (lower.match(/\b(loan|emi|afford|borrow|debt)\b/) || lower.includes("लोन") || lower.includes("ऋण"))
    return "Based on your monthly income of ₹85,000 and current expenses, you can comfortably afford an EMI of up to ₹25,000. Should we explore options with the lowest interest rates?";
  if (lower.match(/\b(save|saving|savings|monthly)\b/) || lower.includes("बचत"))
    return "You're saving around ₹52,600 monthly. I recommend automating 20% directly into a high-yield emergency fund until it reaches a solid ₹3 Lakhs baseline.";
  if (lower.match(/\b(expense|spend|spending|budget)\b/) || lower.includes("खर्च"))
    return "I noticed your entertainment expenses are up this week. Cutting back slightly could help you reach your 'Dream Home' goal 2 months faster! Want me to set a smart budget?";
  if (lower.match(/\b(hi|hello|hey|namaste)\b/) || lower.includes("नमस्ते"))
    return "Hello! I'm your AI Wealth Advisor. I can help you analyze spending, recommend investments, or track your goals. What would you like to focus on today?";
  if (lower.match(/\b(invest|investing|investment|portfolio)\b/) || lower.includes("निवेश"))
    return "Based on your 'Aggressive' risk profile, I recommend 70% Equity (large & mid-caps), 20% Debt for stability, and 10% Alternative assets. Shall we review your current allocation?";

  const fallbacks = [
    "That's a great question. To give accurate advice, could you share your timeline and risk appetite for this goal?",
    "I'm analyzing your portfolio against current market trends... Maintaining your SIPs while keeping cash ready for market dips looks like the best strategy right now.",
    "Diversification is key here. Adding some exposure to international markets could reduce your overall portfolio risk significantly.",
    "Let me cross-reference that with top-performing funds. It looks viable, but we should keep an eye on expense ratios.",
    "My recommendation is a calculated approach — always prioritize emergency fund liquidity before taking on aggressive market positions.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// ─── Notifications Data ───────────────────────────────────────────────────────
const notificationsData = [
  {
    id: 1, type: "gain", title: "Portfolio Up!",
    body: "Your portfolio gained ₹2,300 today (+1.8%)",
    time: "2 min ago", read: false,
  },
  {
    id: 2, type: "alert", title: "SIP Reminder",
    body: "Your monthly SIP of ₹5,000 is due tomorrow.",
    time: "1 hr ago", read: false,
  },
  {
    id: 3, type: "security", title: "Login Detected",
    body: "New login from Windows PC in Delhi.",
    time: "3 hr ago", read: true,
  },
  {
    id: 4, type: "offer", title: "Exclusive Offer",
    body: "Zero brokerage on your next 5 trades. Valid till Sunday.",
    time: "Yesterday", read: true,
  },
  {
    id: 5, type: "loss", title: "Market Dip",
    body: "Sensex fell 1.2% today. Consider buying the dip!",
    time: "Yesterday", read: true,
  },
];


export default function AssistIQApp() {
  const [screen, setScreen] = useState<Screen>("splash");

  // Floating AI Avatar Chat Overlay States
  const [showAIAvatarOverlay, setShowAIAvatarOverlay] = useState(false);
  const [avatarMessages, setAvatarMessages] = useState<Message[]>([
    { id: 1, text: "Hello Bibek! 👋 I am your AI Wealth Advisor. Ask me anything about your balance, investments, savings, goals, or budgets!", sender: "ai" },
  ]);
  const [avatarInput, setAvatarInput] = useState("");
  const [avatarIsTyping, setAvatarIsTyping] = useState(false);
  const [avatarMuted, setAvatarMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const avatarMessagesEndRef = useRef<HTMLDivElement>(null);

  const speakResponse = (text: string) => {
    if (avatarMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendAvatarMessage = (text: string) => {
    if (!text.trim()) return;
    setAvatarMessages((prev) => [...prev, { id: Date.now(), text, sender: "user" }]);
    setAvatarInput("");
    setAvatarIsTyping(true);
    setIsSpeaking(false);

    setTimeout(() => {
      const response = generateAIResponse(text);
      setAvatarMessages((prev) => [...prev, { id: Date.now() + 1, text: response, sender: "ai" }]);
      setAvatarIsTyping(false);
      speakResponse(response);
    }, 1200);
  };

  const handleMicSimulate = () => {
    if (isListening) return;
    setIsListening(true);
    setIsSpeaking(false);

    setTimeout(() => {
      setIsListening(false);
      handleSendAvatarMessage("Analyze my monthly budget spending");
    }, 2500);
  };

  useEffect(() => {
    avatarMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [avatarMessages, avatarIsTyping]);

  const renderMessageAddons = (text: string) => {
    const lower = text.toLowerCase();
    
    // Asset Allocation Chart
    if (lower.includes("equity") || lower.includes("diversification") || lower.includes("allocating") || lower.includes("portfolio") || lower.includes("invest")) {
      return (
        <div className="mt-2.5 space-y-2 border border-white/5 bg-slate-950/60 p-2.5 rounded-2xl text-[10px] w-full min-w-[220px]">
          <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">Asset Allocation</span>
          <div className="flex rounded-full overflow-hidden h-2 bg-slate-950 border border-white/10">
            <div style={{ width: '70%' }} className="bg-primary" title="Equity: 70%" />
            <div style={{ width: '20%' }} className="bg-[#eab308]" title="Debt: 20%" />
            <div style={{ width: '10%' }} className="bg-[#a855f7]" title="Alternatives: 10%" />
          </div>
          <div className="flex justify-between text-slate-500 font-bold text-[9px]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Eq: 70%</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" /> Db: 20%</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" /> Alt: 10%</span>
          </div>
        </div>
      );
    }

    // Budget Progress Tracker
    if (lower.includes("saving") || lower.includes("save") || lower.includes("expense") || lower.includes("budget")) {
      return (
        <div className="mt-2.5 space-y-2 border border-white/5 bg-slate-950/60 p-2.5 rounded-2xl text-[10px] w-full min-w-[220px]">
          <div className="flex justify-between font-bold text-slate-400 text-[8px] uppercase tracking-wider">
            <span>Expenses vs Budget</span>
            <span className="text-white">₹32,400 / ₹40,000</span>
          </div>
          <div className="w-full bg-slate-950 border border-white/10 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full" style={{ width: '81%' }} />
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block">You have ₹7,600 remaining this month</span>
        </div>
      );
    }

    // Wealth Summary Widget
    if (lower.includes("wealth") || lower.includes("balance")) {
      return (
        <div className="mt-2.5 grid grid-cols-2 gap-2 border border-white/5 bg-slate-950/60 p-2 rounded-2xl text-[10px] w-full min-w-[220px]">
          <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-slate-500 block font-bold text-[8px] uppercase tracking-wider">Total Balance</span>
            <span className="text-white font-extrabold text-xs">₹4,28,500</span>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-slate-500 block font-bold text-[8px] uppercase tracking-wider">Wealth Score</span>
            <span className="text-success font-extrabold text-xs">85/100</span>
          </div>
        </div>
      );
    }

    // EMI Affordability Widget
    if (lower.includes("emi") || lower.includes("loan") || lower.includes("comfortably afford")) {
      return (
        <div className="mt-2.5 space-y-2 border border-white/5 bg-slate-950/60 p-2.5 rounded-2xl text-[10px] w-full min-w-[220px]">
          <div className="flex justify-between font-bold text-slate-400 text-[8px] uppercase tracking-wider">
            <span>EMI Comfort Limit</span>
            <span className="text-white">₹25,000 / month</span>
          </div>
          <div className="w-full bg-slate-950 border border-white/10 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full" style={{ width: '65%' }} />
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block">Safe limit based on ₹85,000 income</span>
        </div>
      );
    }

    return null;
  };
  const [onboardStep, setOnboardStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [privacyToggles, setPrivacyToggles] = useState({
    analyticsSharing: true,
    transactionAlerts: true,
    marketingEmails: false,
    twoFactorAuth: true,
    locationAccess: false,
  });
  const [appSettings, setAppSettings] = useState({
    darkMode: true,
    pushNotifications: true,
    soundEffects: false,
    inrCurrency: true,
    compactView: false,
  });
  // Advisor state
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi Bibek! I'm your AI Wealth Advisor. I support multiple Indian languages! How can I help you grow your portfolio today?", sender: "ai" },
  ]);
  const [advisorInput, setAdvisorInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [micError, setMicError] = useState("");
  const [selectedLang, setSelectedLang] = useState("en-IN");
  const recognitionRef = useRef<any>(null);
  const simulationRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helpers
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Splash screen timer
  useEffect(() => {
    const t = setTimeout(() => setScreen("onboarding"), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, transcript]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) { } }
      if (simulationRef.current) clearTimeout(simulationRef.current);
    };
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setScreen("dashboard");
      setActiveTab("home");
    }, 1500);
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
      setScreen("onboarding");
      setOnboardStep(0);
      setMessages([{ id: 1, text: "Hi Bibek! I'm your AI Wealth Advisor. I support multiple Indian languages! How can I help you grow your portfolio today?", sender: "ai" }]);
    }, 800);
  };

  // ─── AI Advisor ─────────────────────────────────────────────────────────────
  const handleSend = (text: string, isVoice = false) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), text, sender: "user", isVoice }]);
    setAdvisorInput("");
    setTranscript("");
    setIsTyping(true);
    setMicError("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: generateAIResponse(text), sender: "ai" }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 800);
  };

  const simulateRecording = () => {
    setIsRecording(true);
    let mockText = "investing on which sector will be better for me";
    if (selectedLang === "hi-IN") mockText = "मुझे किस सेक्टर में निवेश करना चाहिए?";
    if (selectedLang === "mr-IN") mockText = "मी कोणत्या सेक्टर मध्ये गुंतवणूक करू?";
    setTranscript(`Simulated voice... ${mockText}`);
    simulationRef.current = setTimeout(() => {
      setIsRecording(false);
      handleSend(mockText, true);
    }, 3500);
  };

  const startRecording = () => {
    setMicError("");
    setTranscript("");
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Speech API unsupported. Using simulation mode...");
      simulateRecording();
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        let cur = "";
        for (let i = 0; i < e.results.length; i++) cur += e.results[i][0].transcript;
        setTranscript(cur);
      };
      recognition.onerror = (e: any) => {
        if (e.error === "network") {
          setMicError("Browser speech service unavailable. Falling back to simulation...");
          simulateRecording();
        } else if (e.error === "not-allowed") {
          setMicError("Mic access denied. Using simulation mode...");
          simulateRecording();
        } else if (e.error === "no-speech") {
          setMicError("No speech detected. Please try again.");
          setIsRecording(false);
        } else {
          setMicError(`Mic error (${e.error}). Using simulation mode...`);
          simulateRecording();
        }
      };
      recognition.onend = () => { if (!simulationRef.current) setIsRecording(false); };
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setMicError("Failed to access mic. Using simulation mode...");
      simulateRecording();
    }
  };

  const stopRecording = () => {
    if (simulationRef.current) { clearTimeout(simulationRef.current); simulationRef.current = null; }
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) { } }
    setIsRecording(false);
    let final = transcript.includes("Simulated voice...") ? transcript.replace("Simulated voice... ", "") : transcript;
    if (final.trim()) handleSend(final, true);
  };

  // ─── Render Screens ──────────────────────────────────────────────────────────

  // SPLASH
  if (screen === "splash") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-accent/20" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] mb-6">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Assist IQ</h1>
          <p className="text-primary/80 font-medium tracking-widest uppercase text-sm">AI Wealth Advisor</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-sm text-foreground/60">Securing connection...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ONBOARDING
  if (screen === "onboarding") {
    const step = onboardingSteps[onboardStep];
    const Icon = step.icon;
    return (
      <div className="flex flex-col min-h-screen p-6 relative">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="flex-1 flex flex-col items-center justify-center pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={onboardStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center max-w-sm"
            >
              <div className={`mb-12 w-36 h-36 ${step.bg} rounded-full flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Icon className={`w-20 h-20 ${step.color} relative z-10`} />
              </div>
              <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
              <p className="text-foreground/70 leading-relaxed">{step.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pb-10 pt-6">
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === onboardStep ? "w-6 bg-primary" : "w-1.5 bg-foreground/20"}`}
              />
            ))}
          </div>
          <button
            onClick={() => {
              if (onboardStep < onboardingSteps.length - 1) setOnboardStep(onboardStep + 1);
              else setScreen("login");
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            {onboardStep === onboardingSteps.length - 1 ? "Get Started" : "Continue"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // LOGIN
  if (screen === "login") {
    return (
      <div className="flex flex-col min-h-screen p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="pt-16 pb-8">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-foreground/60 text-center flex items-center justify-center gap-1 text-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            End-to-End Encrypted Session
          </p>
        </div>

        <div className="flex-1">
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="email"
                placeholder="Email address"
                defaultValue="bibek@example.com"
                className="w-full bg-secondary/30 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground/40"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password or PIN"
                defaultValue="password123"
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
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">Forgot password?</button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
          >
            {loginLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-5 h-5" /></>
            )}
          </button>

          <div className="mt-10 flex flex-col items-center">
            <div className="flex items-center gap-4 w-full mb-8">
              <div className="h-px bg-border flex-1" />
              <span className="text-foreground/40 text-sm font-medium">Or log in with</span>
              <div className="h-px bg-border flex-1" />
            </div>
            <button
              onClick={handleLogin}
              className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary/50 transition-colors shadow-lg group relative"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Fingerprint className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
            </button>
            <p className="mt-4 text-sm text-foreground/60">Biometric Login</p>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD (Home, Advisor, Profile tabs)
  const navItems = [
    { id: "home", name: "Home", icon: Home },
    { id: "spending", name: "Spending", icon: PieChart },
    { id: "advisor", name: "Advisor", icon: Sparkles, primary: true },
    { id: "goals", name: "Goals", icon: Target },
    { id: "profile", name: "Profile", icon: User },
  ];

  const renderTab = () => {
    // ── HOME ──
    if (activeTab === "home") {
      return (
        <div className="p-6 space-y-6 pb-32">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Good Morning, Bibek 👋</h1>
              <p className="text-sm text-foreground/60">Your wealth is growing steadily.</p>
            </div>
            <button
              onClick={() => setShowNotifications(true)}
              className="relative w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-secondary/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground/80" />
              {unreadCount > 0 && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-background" />
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-primary/90 to-accent/90 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Total Balance</p>
                <h2 className="text-4xl font-bold tracking-tight">₹4,28,500</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">+12.5%</span>
              </div>
            </div>
            <div className="flex gap-6 mt-8 relative z-10">
              <div>
                <p className="text-white/60 text-xs mb-1">Monthly Income</p>
                <p className="font-semibold flex items-center gap-1"><ArrowUpRight className="w-4 h-4 text-green-300" /> ₹85,000</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Monthly Expenses</p>
                <p className="font-semibold flex items-center gap-1"><ArrowDownRight className="w-4 h-4 text-red-300" /> ₹32,400</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { name: "Invest", icon: TrendingUp, tab: "invest" },
              { name: "Save", icon: Wallet, tab: "spending" },
              { name: "Goal", icon: Target, tab: "goals" },
              { name: "AI", icon: Sparkles, tab: "advisor" },
            ].map((a) => (
              <button key={a.name} onClick={() => setActiveTab(a.tab)} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center hover:bg-secondary/50 transition-colors shadow-sm active:scale-95">
                  <a.icon className={`w-6 h-6 ${a.name === "AI" ? "text-accent" : "text-primary"}`} />
                </div>
                <span className="text-xs font-medium text-foreground/80">{a.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Portfolio Growth</h3>
              <span className="text-xs text-foreground/60">This Week</span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#cg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-success/5" />
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-border" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="45" className="text-success drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">85</span>
              </div>
              <span className="text-xs font-medium text-foreground/60 mt-2">Wealth Score</span>
            </div>
            <div className="bg-card border border-border rounded-3xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-16 h-16 bg-primary/10 blur-xl" />
              <ShieldCheck className="w-8 h-8 text-primary mb-2" />
              <div>
                <h3 className="font-semibold text-sm">Protected</h3>
                <p className="text-xs text-foreground/50">256-bit encryption active</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── INVEST ──
    if (activeTab === "invest") {
      const funds = [
        { name: "Nifty 50 Index Fund", category: "Large Cap", returns: "+18.4%", risk: "Low", amount: "₹1,20,000", color: "text-success" },
        { name: "Mirae Asset Emerging", category: "Mid Cap", returns: "+24.1%", risk: "Medium", amount: "₹85,000", color: "text-warning" },
        { name: "HDFC Small Cap Fund", category: "Small Cap", returns: "+31.6%", risk: "High", amount: "₹45,000", color: "text-danger" },
        { name: "SBI Gold ETF", category: "Commodity", returns: "+12.3%", risk: "Low", amount: "₹28,000", color: "text-success" },
      ];
      return (
        <div className="p-6 space-y-5 pb-32">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setActiveTab("home")} className="p-2 bg-card rounded-full border border-border"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold">Investments</h1>
              <p className="text-xs text-foreground/60">Your active portfolio</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-3xl p-5">
            <p className="text-sm text-foreground/60 mb-1">Total Invested</p>
            <h2 className="text-3xl font-bold mb-3">₹2,78,000</h2>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/5 rounded-2xl p-3">
                <p className="text-xs text-foreground/50 mb-1">Current Value</p>
                <p className="font-bold text-success">₹3,41,250</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-2xl p-3">
                <p className="text-xs text-foreground/50 mb-1">Total Gain</p>
                <p className="font-bold text-success flex items-center gap-1"><ArrowUpRight className="w-4 h-4" />+₹63,250</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Your Funds</h3>
            <div className="space-y-3">
              {funds.map((f, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{f.name}</p>
                      <p className="text-xs text-foreground/50">{f.category} · Risk: {f.risk}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${f.color}`}>{f.returns}</p>
                    <p className="text-xs text-foreground/50">{f.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActiveTab("advisor")} className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
            <Sparkles className="w-5 h-5" />
            Get AI Investment Advice
          </button>
        </div>
      );
    }

    // ── SPENDING / SAVE ──
    if (activeTab === "spending") {
      const transactions = [
        { label: "Swiggy Order", cat: "Food", amount: "-₹340", time: "Today, 1:30 PM", icon: "🍔" },
        { label: "Salary Credit", cat: "Income", amount: "+₹85,000", time: "Today, 9:00 AM", icon: "💰" },
        { label: "Uber Ride", cat: "Travel", amount: "-₹220", time: "Yesterday", icon: "🚗" },
        { label: "Netflix", cat: "Entertainment", amount: "-₹649", time: "Jun 22", icon: "🎬" },
        { label: "Electricity Bill", cat: "Utilities", amount: "-₹1,450", time: "Jun 21", icon: "⚡" },
      ];
      return (
        <div className="p-6 space-y-5 pb-32">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setActiveTab("home")} className="p-2 bg-card rounded-full border border-border"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold">Spending & Save</h1>
              <p className="text-xs text-foreground/60">Track your monthly expenses</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
              <p className="text-xs text-foreground/60 mb-1">This Month Saved</p>
              <p className="text-2xl font-bold text-success">₹52,600</p>
              <p className="text-xs text-success mt-1">↑ 8% vs last month</p>
            </div>
            <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4">
              <p className="text-xs text-foreground/60 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-danger">₹32,400</p>
              <p className="text-xs text-danger mt-1">↑ 3% vs last month</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-sm">Monthly Budget</p>
              <p className="text-xs text-foreground/50">₹32,400 / ₹40,000</p>
            </div>
            <div className="w-full bg-border rounded-full h-2.5">
              <div className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full" style={{ width: "81%" }} />
            </div>
            <p className="text-xs text-foreground/50 mt-2">₹7,600 remaining this month</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {transactions.map((t, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-lg">{t.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{t.label}</p>
                      <p className="text-xs text-foreground/50">{t.cat} · {t.time}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${t.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>{t.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── GOALS ──
    if (activeTab === "goals") {
      const goals = [
        { name: "Dream Home 🏡", target: "₹50,00,000", saved: "₹18,50,000", pct: 37, color: "#3b82f6" },
        { name: "Emergency Fund 🛡️", target: "₹3,00,000", saved: "₹2,64,000", pct: 88, color: "#10b981" },
        { name: "Europe Trip ✈️", target: "₹2,00,000", saved: "₹72,000", pct: 36, color: "#8b5cf6" },
        { name: "New Car 🚗", target: "₹8,00,000", saved: "₹1,20,000", pct: 15, color: "#f59e0b" },
      ];
      return (
        <div className="p-6 space-y-5 pb-32">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setActiveTab("home")} className="p-2 bg-card rounded-full border border-border"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold">My Goals</h1>
              <p className="text-xs text-foreground/60">Track your financial milestones</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/20 rounded-3xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Total Goal Progress</p>
              <p className="text-3xl font-bold">44%</p>
              <p className="text-xs text-foreground/50 mt-1">Across 4 active goals</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-border" />
                <circle cx="32" cy="32" r="28" stroke="#8b5cf6" strokeWidth="6" fill="transparent" strokeDasharray="176" strokeDashoffset="99" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {goals.map((g, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-sm">{g.name}</p>
                    <p className="text-xs text-foreground/50">{g.saved} of {g.target}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: g.color }}>{g.pct}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setActiveTab("advisor")} className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-accent/25">
            <Sparkles className="w-5 h-5" />
            Ask AI to Optimize Goals
          </button>
        </div>
      );
    }

    // ── ADVISOR ──
    if (activeTab === "advisor") {
      const suggestedPrompts = ["Where should I invest ₹10k?", "Can I afford a home loan?", "How much should I save monthly?"];
      return (
        <div className="flex flex-col h-[calc(100vh-80px)] relative">
          <div className="p-4 pb-2 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab("home")} className="p-2 bg-card rounded-full border border-border">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30 relative shrink-0">
                    <Bot className="w-6 h-6 text-accent" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">AI Advisor</h1>
                    <p className="text-xs text-success">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-secondary/50 rounded-full pl-2 pr-1 py-1 border border-border text-xs">
                <Globe className="w-3 h-3 text-foreground/50 mr-1 shrink-0" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-transparent text-foreground/80 focus:outline-none cursor-pointer appearance-none outline-none max-w-[65px]"
                >
                  {indianLanguages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-card text-foreground">{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-20 h-20 relative mb-3">
                <div className={`absolute inset-0 bg-accent/20 rounded-full opacity-75 ${isRecording || isTyping ? "animate-ping" : ""}`} />
                <div className={`absolute inset-2 bg-accent/40 rounded-full ${isRecording || isTyping ? "animate-pulse" : ""}`} />
                <div className="absolute inset-3 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg shadow-accent/50 z-10">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-foreground/60 text-xs">
                {isRecording ? "Listening to you..." : isTyping ? "AI is analyzing..." : "End-to-End Encrypted"}
              </p>
            </div>

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-primary" : "bg-card border border-border"}`}>
                    {msg.sender === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-accent" />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-secondary border border-border rounded-tl-sm text-foreground/90"}`}>
                    <div className="flex items-start gap-2">
                      {msg.isVoice && <Volume2 className="w-4 h-4 opacity-70 shrink-0 mt-0.5" />}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-secondary border border-border p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-150" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-16 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border/50 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            {!isRecording && messages.length === 1 && (
              <div className="flex gap-2 overflow-x-auto pb-3">
                {suggestedPrompts.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p)} className="whitespace-nowrap px-4 py-2 bg-card border border-border rounded-full text-xs hover:border-primary/50 transition-colors shrink-0">
                    {p}
                  </button>
                ))}
              </div>
            )}
            {micError && (
              <div className="mb-3 px-4 py-2 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2 text-warning text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{micError}</p>
              </div>
            )}
            {isRecording ? (
              <div className="flex flex-col gap-3">
                <div className="bg-secondary/30 border border-border rounded-xl p-3 min-h-12 max-h-24 overflow-y-auto">
                  <p className="text-sm text-foreground/80 italic">
                    {transcript || `Speak now in ${indianLanguages.find((l) => l.code === selectedLang)?.name}...`}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-danger/10 border border-danger/30 rounded-full py-2 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-danger rounded-full animate-pulse" />
                    <span className="text-foreground/70 text-sm font-medium">Recording...</span>
                  </div>
                  <button onClick={stopRecording} className="w-10 h-10 bg-danger rounded-full flex items-center justify-center text-white hover:bg-danger/90 transition-colors">
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={advisorInput}
                  onChange={(e) => setAdvisorInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(advisorInput)}
                  placeholder="Ask or say something..."
                  className="w-full bg-secondary/50 border border-border rounded-full py-3 pl-4 pr-24 focus:outline-none focus:border-primary/50 text-sm"
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  <button onClick={startRecording} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-card transition-colors group">
                    <Mic className="w-5 h-5 text-foreground/60 group-hover:text-danger transition-colors" />
                  </button>
                  <button onClick={() => handleSend(advisorInput)} disabled={!advisorInput.trim()} className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── PROFILE ──
    if (activeTab === "profile") {
      return (
        <div className="p-6 space-y-6 pb-32">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex items-center gap-4">
            {/* Profile avatar with upload */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-full p-0.5">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage
                    ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    : <User className="w-8 h-8 text-foreground/50" />
                  }
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">Bibek</h2>
              <p className="text-sm text-foreground/60">bibek@example.com</p>
              <div className="flex items-center gap-1 mt-1 bg-success/10 text-success px-2 py-0.5 rounded-md w-max">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">KYC Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-success/20 to-success/5 border border-success/30 rounded-3xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-success mb-1">Security Score</h3>
              <p className="text-xs text-foreground/70">Your account is highly secure.</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-success flex items-center justify-center font-bold text-success">98</div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold px-2 mb-2 text-foreground/80">Account & Security</h3>
            {[
              { name: "Linked Bank Accounts", icon: CreditCard, value: "2 Accounts", key: "banks" },
              { name: "Biometric Login", icon: Fingerprint, value: biometricEnabled ? "Enabled" : "Disabled", key: "biometric" },
              { name: "Privacy Settings", icon: ShieldCheck, value: "", key: "privacy" },
              { name: "App Settings", icon: Settings, value: "", key: "appsettings" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveModal(item.key)}
                className="w-full bg-card border border-border rounded-2xl p-4 flex items-center justify-between hover:bg-secondary/40 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-foreground/80" />
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className={`text-xs font-medium ${item.key === "biometric" ? (biometricEnabled ? "text-success" : "text-danger/70") : "text-foreground/50"}`}>{item.value}</span>}
                  <ChevronRight className="w-4 h-4 text-foreground/40" />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-4 rounded-2xl border border-danger/30 text-danger font-semibold flex items-center justify-center gap-2 hover:bg-danger/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      );
    }

    return null;
  };

  // MAIN DASHBOARD WRAPPER with Bottom Nav
  return (
    <div className="flex flex-col min-h-screen relative pb-20">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderTab()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 px-4 pointer-events-none">
        <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-2 flex items-center justify-between pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            if (item.primary) {
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className="relative -top-5">
                  <div className={`w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-background/50 backdrop-blur-md transition-transform ${isActive ? "scale-110" : "scale-100"}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${isActive ? "text-primary bg-primary/10" : "text-foreground/50 hover:text-foreground/80 hover:bg-white/5"}`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Confirmation Modal — rendered at top level to escape overflow clipping */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-background/80 backdrop-blur-sm"
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
              <p className="text-sm text-foreground/60 mb-6">You will be redirected to the onboarding screen. Your data is safely stored.</p>
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
                  {loggingOut
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><LogOut className="w-4 h-4" /> Log Out</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Account Modals — all rendered at top level ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── LINKED BANK ACCOUNTS ── */}
              {activeModal === "banks" && (
                <div>
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-lg font-bold">Linked Bank Accounts</h2>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <X className="w-5 h-5 text-foreground/60" />
                    </button>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    {[
                      { bank: "HDFC Bank", type: "Savings Account", no: "••••  ••••  4821", balance: "₹1,84,200", color: "from-blue-600 to-blue-800" },
                      { bank: "SBI Bank", type: "Current Account", no: "••••  ••••  9034", balance: "₹2,44,300", color: "from-indigo-600 to-purple-700" },
                    ].map((acc, i) => (
                      <div key={i} className={`bg-gradient-to-br ${acc.color} rounded-2xl p-4 text-white relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-4 translate-x-4" />
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div>
                            <p className="text-white/70 text-xs font-medium">{acc.type}</p>
                            <p className="font-bold text-base">{acc.bank}</p>
                          </div>
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-white/60 text-xs mb-1 relative z-10">{acc.no}</p>
                        <div className="flex items-center justify-between relative z-10">
                          <p className="font-bold text-xl">{acc.balance}</p>
                          <button className="text-xs text-white/60 hover:text-white/90 border border-white/30 rounded-full px-3 py-1 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-border rounded-2xl text-sm text-foreground/50 hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2 mt-2">
                      + Add New Account
                    </button>
                  </div>
                  <div className="px-6 pb-6" />
                </div>
              )}

              {/* ── BIOMETRIC LOGIN ── */}
              {activeModal === "biometric" && (
                <div>
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center">
                        <Fingerprint className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-lg font-bold">Biometric Login</h2>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <X className="w-5 h-5 text-foreground/60" />
                    </button>
                  </div>
                  <div className="px-6 py-8 flex flex-col items-center gap-6">
                    <motion.div
                      animate={{ scale: biometricEnabled ? [1, 1.05, 1] : 1 }}
                      transition={{ repeat: biometricEnabled ? Infinity : 0, duration: 2 }}
                      className={`w-28 h-28 rounded-full flex items-center justify-center border-4 ${biometricEnabled ? "border-success bg-success/10" : "border-border bg-secondary"}`}
                    >
                      <Fingerprint className={`w-14 h-14 ${biometricEnabled ? "text-success" : "text-foreground/40"}`} />
                    </motion.div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${biometricEnabled ? "text-success" : "text-foreground/60"}`}>
                        {biometricEnabled ? "Biometric Active" : "Biometric Disabled"}
                      </p>
                      <p className="text-sm text-foreground/50 mt-1">
                        {biometricEnabled ? "Your fingerprint is used to secure this app." : "Enable to use fingerprint login."}
                      </p>
                    </div>
                    <button
                      onClick={() => setBiometricEnabled((v) => !v)}
                      className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${biometricEnabled ? "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20" : "bg-success text-white hover:bg-success/90"}`}
                    >
                      {biometricEnabled ? "Disable Biometric" : "Enable Biometric"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── PRIVACY SETTINGS ── */}
              {activeModal === "privacy" && (
                <div>
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-success" />
                      </div>
                      <h2 className="text-lg font-bold">Privacy Settings</h2>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <X className="w-5 h-5 text-foreground/60" />
                    </button>
                  </div>
                  <div className="px-6 py-4 space-y-1">
                    {([
                      { key: "twoFactorAuth", label: "Two-Factor Auth", sub: "Require OTP on every login" },
                      { key: "transactionAlerts", label: "Transaction Alerts", sub: "Get notified on every debit/credit" },
                      { key: "analyticsSharing", label: "Analytics Sharing", sub: "Help improve Assist IQ with usage data" },
                      { key: "locationAccess", label: "Location Access", sub: "Personalize offers by your region" },
                      { key: "marketingEmails", label: "Marketing Emails", sub: "Receive offers and newsletters" },
                    ] as { key: keyof typeof privacyToggles; label: string; sub: string }[]).map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-foreground/50">{item.sub}</p>
                        </div>
                        <button
                          onClick={() => setPrivacyToggles((p) => ({ ...p, [item.key]: !p[item.key] }))}
                          className={`relative w-12 h-6 rounded-full transition-colors ${privacyToggles[item.key] ? "bg-success" : "bg-secondary border border-border"}`}
                        >
                          <motion.div
                            animate={{ x: privacyToggles[item.key] ? 24 : 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 pb-6" />
                </div>
              )}

              {/* ── APP SETTINGS ── */}
              {activeModal === "appsettings" && (
                <div>
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warning/10 rounded-2xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-warning" />
                      </div>
                      <h2 className="text-lg font-bold">App Settings</h2>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <X className="w-5 h-5 text-foreground/60" />
                    </button>
                  </div>
                  <div className="px-6 py-4 space-y-1">
                    {([
                      { key: "darkMode", label: "Dark Mode", sub: "Use dark theme across the app" },
                      { key: "pushNotifications", label: "Push Notifications", sub: "Alerts for goals & market updates" },
                      { key: "soundEffects", label: "Sound Effects", sub: "Play sounds for transactions" },
                      { key: "inrCurrency", label: "Show INR (₹)", sub: "Display amounts in Indian Rupees" },
                      { key: "compactView", label: "Compact View", sub: "Reduce spacing for more content" },
                    ] as { key: keyof typeof appSettings; label: string; sub: string }[]).map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-foreground/50">{item.sub}</p>
                        </div>
                        <button
                          onClick={() => setAppSettings((s) => ({ ...s, [item.key]: !s[item.key] }))}
                          className={`relative w-12 h-6 rounded-full transition-colors ${appSettings[item.key] ? "bg-primary" : "bg-secondary border border-border"}`}
                        >
                          <motion.div
                            animate={{ x: appSettings[item.key] ? 24 : 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 pb-4 pt-2 border-t border-border/30 mt-2">
                    <p className="text-xs text-center text-foreground/30">Assist IQ v1.0.0 · Built with ❤️ for India</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel — rendered at top level */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="w-full max-w-md bg-card border border-border rounded-b-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>
              </div>

              {/* Notification Items */}
              <div className="max-h-[70vh] overflow-y-auto divide-y divide-border/30">
                {notifications.map((n) => {
                  const iconMap: Record<string, { icon: any; color: string; bg: string }> = {
                    gain: { icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
                    loss: { icon: TrendingDown, color: "text-danger", bg: "bg-danger/10" },
                    alert: { icon: Bell, color: "text-warning", bg: "bg-warning/10" },
                    security: { icon: Shield, color: "text-primary", bg: "bg-primary/10" },
                    offer: { icon: Gift, color: "text-accent", bg: "bg-accent/10" },
                  };
                  const meta = iconMap[n.type] ?? iconMap.alert;
                  const IconComp = meta.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-secondary/30 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) => item.id === n.id ? { ...item, read: true } : item)
                        )
                      }
                    >
                      <div className={`mt-0.5 w-10 h-10 rounded-2xl ${meta.bg} flex items-center justify-center shrink-0`}>
                        <IconComp className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-foreground/70"}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-foreground/40 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">{n.body}</p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border/50 text-center">
                <button className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors">
                  View all activity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Agent Avatar Button (Sparkles FAB) */}
      {screen === "dashboard" && (
        <div className="fixed bottom-24 right-4 z-40">
          <button
            onClick={() => setShowAIAvatarOverlay(true)}
            className="w-12 h-12 bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(124,58,237,0.4)] border border-white/20 active:scale-95 transition-transform cursor-pointer relative group"
            aria-label="Ask AI Advisor"
          >
            <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* AI Agent Avatar Chat Overlay Panel */}
      <AnimatePresence>
        {showAIAvatarOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAIAvatarOverlay(false)}
          >
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="w-full max-w-sm bg-[#0a0f1d]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[65vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] p-[1px] shrink-0">
                    <div className="w-full h-full bg-[#070b13] rounded-full overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/avatar.png" alt="AI Agent Avatar" className="w-full h-full object-cover scale-110" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a0f1d]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">AI Wealth Advisor</h3>
                    <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Online
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAvatarMuted(!avatarMuted)}
                    className={`p-1.5 rounded-full hover:bg-slate-800 transition-colors ${!avatarMuted ? "text-primary" : "text-slate-500"}`}
                  >
                    {!avatarMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setShowAIAvatarOverlay(false)}
                    className="p-1.5 hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground/60" />
                  </button>
                </div>
              </div>

              {/* Central AI Avatar Space */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Listening Ripple Wave animation */}
                {isListening && (
                  <>
                    <div className="absolute w-44 h-44 rounded-full bg-primary/10 border border-primary/20 animate-ping duration-1000" />
                    <div className="absolute w-52 h-52 rounded-full bg-accent/5 border border-accent/10 animate-ping duration-1000 delay-300" />
                  </>
                )}

                {/* Main Centered Circular Avatar with glowing halo */}
                <div className={`relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] transition-all duration-300 ${
                  isSpeaking ? "scale-105 shadow-[0_0_35px_rgba(124,58,237,0.7)]" : "shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                }`}>
                  {/* Rotating border when speaking */}
                  {isSpeaking && (
                    <span className="absolute inset-0 rounded-full border-[3px] border-dotted border-white/60 animate-spin" style={{ animationDuration: '6s' }} />
                  )}

                  <div className="w-full h-full bg-[#070b13] rounded-full overflow-hidden flex items-center justify-center relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/avatar.png"
                      alt="AI Agent Avatar"
                      className={`w-full h-full object-cover scale-110 transition-transform ${isSpeaking ? "animate-pulse" : ""}`}
                    />
                    {/* Hologram scanline bounce */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent w-full h-1/2 animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>

                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0f1d]" />
                </div>

                {/* Animated Speech waves */}
                {isSpeaking && (
                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                      const heights = ['h-2.5', 'h-4', 'h-5.5', 'h-3.5', 'h-6', 'h-4.5', 'h-2.5'];
                      return (
                        <div
                          key={bar}
                          className="w-1 bg-gradient-to-t from-primary to-accent rounded-full animate-pulse"
                          style={{
                            height: heights[bar - 1],
                            animationDelay: `${bar * 80}ms`,
                            animationDuration: '500ms'
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Output subtitles area */}
                <div className="mt-5 text-center max-w-xs px-2 flex flex-col items-center justify-center">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold mb-1">
                    {isListening ? "Listening to voice..." : isSpeaking ? "Speaking Response" : avatarIsTyping ? "Analyzing..." : "Ready to Assist"}
                  </p>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed line-clamp-3 min-h-[40px]">
                    {avatarMessages[avatarMessages.length - 1]?.text}
                  </p>
                  
                  {/* Inline interactive cards/charts widgets based on AI answer content */}
                  <div className="mt-3 flex justify-center">
                    {renderMessageAddons(avatarMessages[avatarMessages.length - 1]?.text || "")}
                  </div>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex gap-2 overflow-x-auto px-4 py-2 border-t border-white/5 bg-slate-950/40 scrollbar-none shrink-0">
                {[
                  { label: "Analyze Portfolio", prompt: "Based on my risk profile, how should I invest?" },
                  { label: "Optimize Budget", prompt: "How much should I save monthly?" },
                  { label: "Home Loan EMI", prompt: "Can I afford a home loan?" },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAvatarMessage(chip.prompt)}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-primary/45 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Input Area with microphone control */}
              <div className="p-3 border-t border-white/5 bg-slate-900/20">
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={handleMicSimulate}
                    disabled={isListening || isSpeaking}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                        : "bg-slate-900 hover:bg-slate-800 border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    }`}
                    title="Speak to Advisor"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAvatarMessage(avatarInput)}
                    placeholder={isListening ? "Listening..." : "Ask me anything..."}
                    disabled={isListening}
                    className="flex-1 bg-slate-900/50 border border-white/5 rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:border-primary/50 text-xs placeholder:text-foreground/30 font-semibold"
                  />
                  <div className="absolute right-1 top-1">
                    <button
                      onClick={() => handleSendAvatarMessage(avatarInput)}
                      disabled={!avatarInput.trim() || isListening}
                      className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white hover:opacity-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
