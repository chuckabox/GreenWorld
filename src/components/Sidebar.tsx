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
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "../lib/utils";
import { UserData } from "../types";

type NavItem = { name: string; path: string; icon: React.ComponentType<{ size?: number; className?: string }> };
type NavGroup = { label: string; items: NavItem[] };

export const Sidebar = ({ 
  user, 
  isOpen, 
  onToggle 
}: { 
  user: UserData; 
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "AI Advisor", path: "/ai-supervisor", icon: Sparkles },
    { name: "Green Hub", path: "/learning", icon: BookOpen },
    { name: "Community", path: "/community", icon: MessageCircle },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
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
    <div
      className={cn(
        "hidden md:flex bg-white border-r border-slate-200 h-screen sticky top-0 flex-col transition-all duration-300 ease-in-out z-20 overflow-hidden",
        isOpen ? "md:w-64" : "md:w-16",
      )}
    >
      {isOpen ? (
        <div className="min-w-[256px] flex flex-col h-full bg-white">
          <div className="h-16 px-6 flex items-center justify-between gap-2 overflow-hidden whitespace-nowrap">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
                <Leaf size={24} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">GreenWorld</span>
            </Link>
            <button
              onClick={onToggle}
              className="p-2 -mr-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

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
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <Icon
                          size={20}
                          className={cn(
                            isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600",
                          )}
                        />
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
                  navigate("/");
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between h-full py-3 bg-white">
          <button
            type="button"
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
            aria-label="Expand sidebar"
          >
            <Menu size={20} />
          </button>
          <nav className="flex-1 flex flex-col items-center gap-4 mt-4 text-slate-400">
            {navGroups.flatMap((group) => group.items).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "p-2.5 rounded-xl transition-colors",
                    isActive
                      ? "bg-primary-light text-primary"
                      : "hover:bg-slate-50 hover:text-slate-700",
                  )}
                  title={item.name}
                >
                  <Icon
                    size={20}
                    className={cn(isActive ? "text-primary" : "text-slate-400")}
                  />
                </Link>
              );
            })}
          </nav>
          <button
            className="mb-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => {
              localStorage.removeItem("userEmail");
              navigate("/");
            }}
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
