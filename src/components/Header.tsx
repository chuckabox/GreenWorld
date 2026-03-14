import React, { useState } from "react";
import { Bell, Menu, X, LayoutDashboard, Sparkles, BookOpen, MessageCircle, Trophy, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export const Header = ({ 
  title, 
  isSidebarOpen, 
  onMenuClick 
}: { 
  title: string; 
  isSidebarOpen: boolean;
  onMenuClick: () => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "AI Advisor", path: "/ai-supervisor", icon: Sparkles },
    { name: "Green Hub", path: "/learning", icon: BookOpen },
    { name: "Community", path: "/community", icon: MessageCircle },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
          >
            {window.innerWidth < 768 && isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-display font-bold text-slate-900 select-none cursor-default">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-sm pt-16 h-screen" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border-b border-slate-200 p-4 space-y-1 shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary-light text-primary font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon size={20} className={cn(isActive ? "text-primary" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
