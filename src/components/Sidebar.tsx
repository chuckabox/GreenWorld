import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Trophy, 
  User, 
  LogOut, 
  Leaf,
  ShieldCheck,
  Sparkles,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { UserData } from "../types";

type NavItem = { name: string; path: string; icon: React.ComponentType<{ size?: number; className?: string }> };
type NavGroup = { label: string; items: NavItem[] };

export const Sidebar = ({ user }: { user: UserData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "AI Advisor", path: "/ai-supervisor", icon: Sparkles },
    { name: "Green Hub", path: "/learning", icon: BookOpen },
    { name: "Community", path: "/community", icon: MessageCircle },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Profile", path: "/portfolio", icon: User },
  ];

  const navGroups: NavGroup[] = [
    {
      label: "Main",
      items: navItems,
    },
  ];

  if (user.role === "admin") {
    navGroups.push({
      label: "Admin",
      items: [{ name: "Admin Portal", path: "/admin", icon: ShieldCheck }],
    });
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden md:flex flex-col">
      <Link to="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <Leaf size={24} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">GreenWorld</span>
      </Link>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-primary-light text-primary font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon size={20} className={cn(isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
          </div>
          <button
            className="text-slate-400 hover:text-red-500 transition-colors"
            onClick={() => {
              localStorage.removeItem("userEmail");
              navigate("/login");
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
