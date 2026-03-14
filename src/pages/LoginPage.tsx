import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, Eye, EyeOff, LogIn, Globe } from "lucide-react";
import { StoredUser } from "../types";
import demoAccounts from "../data/demoAccounts.json";

export const LoginPage = ({
  onLogin,
}: {
  onLogin?: (email: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const storedUsers: StoredUser[] = JSON.parse(
      localStorage.getItem("users") || "[]",
    );
    const demoUsers = demoAccounts as StoredUser[];

    const usersByEmail = new Map<string, StoredUser>();
    for (const existing of storedUsers) {
      usersByEmail.set(existing.email.toLowerCase(), existing);
    }
    for (const demoUser of demoUsers) {
      const key = demoUser.email.toLowerCase();
      if (!usersByEmail.has(key)) {
        usersByEmail.set(key, demoUser);
      }
    }

    const users = Array.from(usersByEmail.values());
    if (users.length !== storedUsers.length) {
      localStorage.setItem("users", JSON.stringify(users));
    }

    const user = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      setError("No account found for that email. Please sign up first.");
      return;
    }

    if (user.password && user.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    if (onLogin) onLogin(email);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans flex flex-col relative overflow-hidden">
      {/* Background leaf — scaled down on mobile so it doesn't dominate */}
      <div className="absolute -bottom-32 -right-32 sm:-bottom-48 sm:-right-48 text-[#00c914] opacity-[0.08] -z-0 pointer-events-none transform rotate-[-25deg]">
        <Leaf
          strokeWidth={0}
          fill="currentColor"
          className="w-64 h-64 sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px]"
        />
      </div>

      {/* ── Header ── */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0"
        >
          <div className="w-8 h-8 bg-[#00c914] rounded flex items-center justify-center text-white shrink-0">
            <Leaf size={18} />
          </div>
          {/* Truncate long title on very small screens */}
          <span className="font-display font-bold text-sm sm:text-lg text-slate-900 tracking-tight truncate">
            Sustainability Impact Award
          </span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 shrink-0">
          <a href="#" className="hover:text-slate-900 transition-colors">
            Program Info
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Resources
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Support
          </a>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 relative z-10 w-full py-8 sm:py-12">
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 md:p-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1.5 sm:mb-2 text-slate-900">
              Welcome Back
            </h1>
            <p className="text-[#00c914] font-semibold text-sm sm:text-base">
              Log in to your impact dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                University Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c914]/20 focus:border-[#00c914] transition-all text-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c914]/20 focus:border-[#00c914] transition-all text-slate-900 font-medium tracking-widest placeholder:tracking-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-[#00c914] focus:ring-[#00c914]/20 shrink-0"
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-500 font-medium select-none"
              >
                Remember this device
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 font-medium -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0cb80f] hover:bg-[#0ba60d] active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(12,184,15,0.39)]"
            >
              Welcome Back <LogIn size={18} />
            </button>
          </form>

          <div className="mt-8 sm:mt-10 text-center text-sm font-medium text-slate-500">
            New to the program?{" "}
            <Link
              to="/signup"
              className="text-[#00c914] font-bold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full px-4 sm:px-8 py-5 sm:py-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500">
        {/* Links — wrap gracefully on very small screens */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 items-center">
          <span>© 2024 Sustainability Impact Award</span>
          <a href="#" className="hover:text-slate-800 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-800 transition-colors">
            Terms of Service
          </a>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={13} className="text-slate-400 shrink-0" />
          <span>Together for a greener future</span>
        </div>
      </footer>
    </div>
  );
};
