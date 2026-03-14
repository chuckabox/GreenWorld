import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight } from "lucide-react";

interface SignUpPayload {
  email: string;
  name: string;
  password: string;
  role: string;
  suburb: string;
  team: string;
}

export const SignUpPage = ({
  onSignUp,
}: {
  onSignUp?: (payload: SignUpPayload) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [suburb, setSuburb] = useState("");
  const [team, setTeam] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (onSignUp) {
      onSignUp({ email, name, password, role, suburb, team });
    }
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      {/* ── Left Column — Form ── */}
      <div className="w-full lg:w-[45%] flex flex-col overflow-y-auto relative z-10">
        <div className="w-full max-w-[480px] mx-auto flex flex-col min-h-full px-5 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 mb-8 sm:mb-12 lg:mb-16 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Leaf size={18} className="fill-current" />
            </div>
            <span className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
              Sustainability
              <br />
              Impact Award
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-7 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3 sm:mb-4 text-slate-900 tracking-tight">
              Join the
              <br />
              Movement
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
              Create your account to start your journey towards environmental
              excellence and campus leadership.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSignUp}
            className="space-y-5 sm:space-y-6 flex-1"
          >
            {/* Full Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                University Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Role + Suburb — side by side on sm+, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-sm font-bold text-slate-800 block">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="community">Community Member</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-sm font-bold text-slate-800 block">
                  Suburb
                </label>
                <input
                  type="text"
                  required
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="South Brisbane"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Team */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                Team or Organization
              </label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="UQ Sustainability Club"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <p className="text-[12px] sm:text-[13px] text-slate-500 mt-1">
                Must be at least 8 characters with one number.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-bold text-slate-800 block">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-400"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1 pb-2">
              <div className="pt-0.5 shrink-0">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 leading-snug select-none"
              >
                I agree to the{" "}
                <a href="#" className="font-bold text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-bold text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0cb80f] hover:bg-[#0ba60d] active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-between px-5 sm:px-6 transition-all shadow-[0_4px_14px_0_rgba(12,184,15,0.39)] hover:shadow-[0_6px_20px_rgba(12,184,15,0.3)] hover:-translate-y-0.5"
            >
              <span>Join the Movement</span>
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 sm:mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Log in
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center text-xs font-bold text-slate-400 tracking-wider uppercase pb-2">
            © 2024 Sustainability Impact Award
          </div>
        </div>
      </div>

      {/* ── Right Column — Image & Quote (lg+ only) ── */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <img
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop"
            alt="Forest from above"
            className="w-full h-full object-cover object-center opacity-90 mix-blend-luminosity brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0cb80f]/40 via-transparent to-transparent mix-blend-multiply" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-8 xl:p-12 z-10">
          <div className="w-full max-w-lg glass bg-white/10 backdrop-blur-xl border border-white/20 p-8 xl:p-10 rounded-[2rem] shadow-2xl">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 xl:mb-8 shadow-lg shadow-primary/30">
              <Leaf size={24} className="fill-current" />
            </div>

            <h2 className="text-3xl xl:text-4xl font-display font-bold text-white mb-5 xl:mb-6 leading-tight drop-shadow-sm">
              Every Action
              <br />
              Counts.
            </h2>

            <p className="text-lg xl:text-xl text-white/90 leading-relaxed font-medium mb-6 xl:mb-8 drop-shadow-sm">
              "The greatest threat to our planet is the belief that someone else
              will save it."
            </p>

            <div className="flex items-center gap-4 text-white/80 font-medium">
              <div className="h-0.5 w-6 bg-white/40" />
              <span>Robert Swan</span>
            </div>

            <div className="mt-8 xl:mt-12 flex items-center gap-4 pt-6 xl:pt-8 border-t border-white/10">
              <div className="flex -space-x-3 shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                  className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border-2 border-white/20 bg-emerald-100"
                />
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                  alt="User"
                  className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border-2 border-white/20 bg-rose-100"
                />
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"
                  alt="User"
                  className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border-2 border-white/20 bg-blue-100"
                />
              </div>
              <p className="text-sm text-white/90 font-medium leading-tight">
                Join 5,000+ students
                <br />
                taking action
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
