"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, Sparkles, Target, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Spending", href: "/dashboard/spending", icon: PieChart },
    { name: "Advisor", href: "/dashboard/advisor", icon: Sparkles, primary: true },
    { name: "Goals", href: "/dashboard/goals", icon: Target },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-2 flex items-center justify-between pointer-events-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.primary) {
            return (
              <Link href={item.href} key={item.name} className="relative -top-6">
                <div className="w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-background/50 backdrop-blur-md">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
                isActive ? "text-primary bg-primary/10" : "text-foreground/50 hover:text-foreground/80 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
