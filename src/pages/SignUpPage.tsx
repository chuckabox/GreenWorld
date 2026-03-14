import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignUpPayload {
  email: string;
  name: string;
  password: string;
  suburb: string;
}

import { motion } from 'motion/react';

export const SignUpPage = ({ onSignUp }: { onSignUp?: (payload: SignUpPayload) => void }) => {
  // ... (rest of state)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [suburb, setSuburb] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (onSignUp) {
      onSignUp({
        email,
        name,
        password,
        suburb,
      });
    }
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex min-h-screen bg-white font-sans overflow-hidden"
    >
      {/* Left Column - Form */}
      <div className="w-full lg:w-[45%] flex flex-col pt-8 p-6 lg:p-12 xl:p-20 overflow-y-auto relative z-10">
        <div className="w-full max-w-[420px] mx-auto flex flex-col focus-visible:outline-none">

          <Link to="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
              <Leaf size={20} className="fill-current" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 leading-tight">
              GreenWorld<br />
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-3 text-slate-900 tracking-tight">
              Join GreenWorld
            </h1>
            <p className="text-slate-500 leading-relaxed text-sm">
              Create your account to start your journey towards environmental excellence.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@uni.edu"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Suburb</label>
              <input
                type="text"
                required
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                placeholder="Brisbane"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600 font-medium ml-1">{error}</p>}

            <div className="flex items-center gap-3 pt-1">
              <div className="shrink-0">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-slate-500 leading-none">
                I agree to the <a href="#" className="font-bold text-primary hover:underline">Terms</a> and <a href="#" className="font-bold text-primary hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
            >
              <span>Create Account</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </div>

          <div className="mt-8 text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">
            © 2026 GreenWorld
          </div>
        </div>
      </div>

      {/* Right Column - Image & Quote */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <img
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop"
            alt="Forest from above"
            className="w-full h-full object-cover object-center opacity-90 mix-blend-luminosity brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
          <div className="w-full max-w-[440px] bg-primary p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/10">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

            <div className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/10">
              <Leaf size={24} className="fill-current" />
            </div>

            <h2 className="text-4xl font-display font-bold text-white mb-6 leading-tight drop-shadow-sm">
              Every Action<br />Counts.
            </h2>

            <p className="text-xl text-white/90 leading-relaxed font-medium mb-8 drop-shadow-sm">
              "The greatest threat to our planet is the belief that someone else will save it."
            </p>

            <div className="flex items-center gap-4 text-white/80 font-medium">
              <div className="h-0.5 w-6 bg-white/40"></div>
              <span>Robert Swan</span>
            </div>

            <div className="mt-12 flex items-center gap-4 pt-8 border-t border-white/10">
              <div className="flex -space-x-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full border-2 border-primary bg-emerald-100" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="User" className="w-10 h-10 rounded-full border-2 border-primary bg-rose-100" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" alt="User" className="w-10 h-10 rounded-full border-2 border-primary bg-blue-100" />
              </div>
              <p className="text-sm text-white/90 font-medium leading-tight">
                Join 5,000+ students<br />taking action
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

//
