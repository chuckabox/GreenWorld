import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff, LogIn, Globe, Sparkles } from 'lucide-react';
import { StoredUser } from '../types';
import demoAccounts from '../data/demoAccounts.json';

export const LoginPage = ({ onLogin }: { onLogin?: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
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
      localStorage.setItem('users', JSON.stringify(users));
    }

    const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setError('No account found for that email. Please sign up first.');
      return;
    }

    if (user.password && user.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    if (onLogin) onLogin(email);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    const demoUser = demoAccounts[0];
    localStorage.setItem('userEmail', demoUser.email);
    if (onLogin) onLogin(demoUser.email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans flex flex-col relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute -bottom-48 -right-48 text-primary opacity-[0.1] -z-0 pointer-events-none transform rotate-[-25deg]">
        <Leaf strokeWidth={0} fill="currentColor" size={600} />
      </div>

      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
            <Leaf size={18} />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 tracking-tight">GreenWorld</span>
        </Link>
        {/* <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Program Info</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Resources</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
        </div> */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 relative z-10 w-full mb-12">
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 text-slate-900">Welcome Back</h1>
            <p className="text-primary font-semibold mb-6">Log in to your impact dashboard</p>
            
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all group"
            >
              <div className="flex items-center gap-2 text-sm">
                <Sparkles size={16} className="text-primary group-hover:scale-110 transition-transform" />
                <span>Too lazy? Use our demo account</span>
              </div>
              <span className="text-[10px] opacity-70 font-medium italic">See the rest of the site instantly</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 block">University Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800">Password</label>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium tracking-widest placeholder:tracking-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 pb-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember" className="text-sm text-slate-500 font-medium">Remember this device</label>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              Welcome Back <LogIn size={18} />
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-slate-500">
            New to the program?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-6 relative z-10 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-slate-500 mt-auto">
        <div className="flex gap-4 md:gap-6 items-center">
          <span>© 2026 GreenWorld</span>
          <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Globe size={14} className="text-slate-400" />
          <span>Together for a greener future</span>
        </div>
      </footer>
    </div>
  );
};
