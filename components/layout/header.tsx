"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Diamond, Hexagon } from "lucide-react";

const navItems = [
  { href: "/", label: "ENTRÉES", color: "#00f5ff" },
  { href: "/writings", label: "RÉFLEXIONS", color: "#b829dd" },
  { href: "/objectifs", label: "OBJECTIFS", color: "#ff006e" },
  { href: "/stats", label: "STATISTIQUES", color: "#ffbe0b" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20">
      <div className="h-full mx-6 mt-4">
        <div className="glass-crystal h-full rounded-2xl px-6 flex items-center justify-between relative overflow-hidden">
          {/* Animated gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.5)] to-transparent" />
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00f5ff] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <Hexagon className="w-8 h-8 text-[#00f5ff] relative z-10 stroke-[1.5]" />
              <Diamond className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[0.2em] text-white">
                VOID
              </span>
              <span className="text-[10px] text-[rgba(0,245,255,0.6)] tracking-[0.3em] uppercase">
                Journal 2026
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-xs font-medium tracking-[0.15em] transition-all duration-500 rounded-lg group",
                    isActive ? "text-white" : "text-[rgba(255,255,255,0.4)] hover:text-white"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span 
                      className="absolute inset-0 rounded-lg opacity-20"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  
                  {/* Bottom glow line */}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300",
                      isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50"
                    )}
                    style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                  />
                  
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Time Display */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse shadow-[0_0_10px_#00f5ff]" />
            <span className="font-[family-name:var(--font-mono)] text-xs text-[rgba(255,255,255,0.5)] tracking-wider">
              {new Date().toLocaleTimeString("fr-FR", { 
                hour: "2-digit", 
                minute: "2-digit",
                hour12: false 
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
