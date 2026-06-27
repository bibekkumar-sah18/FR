"use client";

import { Target, Plus, Car, Home, Plane, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

const goals = [
  { name: "Dream Home", icon: Home, current: 1500000, target: 5000000, date: "Dec 2028", color: "#3b82f6" },
  { name: "New Car", icon: Car, current: 400000, target: 1200000, date: "Jun 2026", color: "#8b5cf6" },
  { name: "Euro Trip", icon: Plane, current: 50000, target: 300000, date: "Oct 2025", color: "#10b981" },
];

export default function GoalPlanning() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-card rounded-full border border-border">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Goal Planning</h1>
        </div>
        <button className="p-2 bg-primary rounded-full text-white shadow-lg shadow-primary/30">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-sm text-foreground/60 mb-1">Total Goals Value</p>
            <h2 className="text-3xl font-bold">₹65.0L</h2>
          </div>
          <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <p className="text-sm text-foreground/80">You are <span className="text-success font-bold">12%</span> ahead of your monthly targets!</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Your Goals</h3>
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={goal.name} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${goal.color}20` }}>
                  <goal.icon className="w-6 h-6" style={{ color: goal.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{goal.name}</h4>
                  <p className="text-xs text-foreground/50">Target: {goal.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{(goal.current / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-foreground/50">of ₹{(goal.target / 100000).toFixed(1)}L</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-foreground/60">
                  <span>{progress.toFixed(0)}% Achieved</span>
                  <span>₹{(goal.target - goal.current).toLocaleString()} left</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
