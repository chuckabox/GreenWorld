import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Leaf, Award, CheckCircle2, Trophy, Globe, Target, Calendar } from "lucide-react";
import { motion } from "motion/react";

import heroBg from "../assets/hero_background.png";
import tasksAndEventsData from "../data/tasksAndEvents.json";
import reforestationImg from "../assets/reforestation.png";
import universityImg from "../assets/university_recognition.png";
import analyticsImg from "../assets/impact_analytics.png";

export const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setIsLoggedIn(true);
    }
  }, []);

  const authPath = isLoggedIn ? "/dashboard" : "/login";
  const authText = isLoggedIn ? "Go to Dashboard" : "Join Now";
  const heroBtnText = isLoggedIn ? "Back to Dashboard" : "Get Started Today";
  const ctaBtnText = isLoggedIn ? "Return to Dashboard" : "Join the Movement Now";

  const tasks = useMemo(() => (tasksAndEventsData as { id: string; type: string; title: string; description?: string; pointsReward?: number }[]).filter((t) => t.type === "task"), []);
  const events = useMemo(() => (tasksAndEventsData as { id: string; type: string; title: string; date?: string; location?: string }[]).filter((t) => t.type === "event"), []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Leaf className="text-primary fill-primary" size={24} />
            <span className="font-display font-bold text-xl tracking-tight">EcoImpact</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#levels" className="hover:text-primary transition-colors">Levels</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#events-tasks" className="hover:text-primary transition-colors">Events & tasks</a>
          </div>
          <Link to={authPath} className="btn-primary text-sm shadow-md shadow-primary/20">{authText}</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900/60 z-10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80 z-10"></div>
          <img src={heroBg} alt="Students planting tree" className="w-full h-full object-cover object-center" />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light rounded-full text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
              AI-Powered Eco Verification
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4 drop-shadow-lg">
              Lead the Change.<br />
              <span className="text-primary drop-shadow-md">Earn the Award.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow">
              Log your eco actions, get them AI-verified, and earn impact points. Track your CO₂ savings, climb the leaderboard, and unlock badges that prove your commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={authPath} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">
                {heroBtnText}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Award Levels */}
      <section id="levels" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Badge Levels</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Bronze */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-orange-500/10 shadow-lg">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Eco Beginner 🌱</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Start your green journey. Log your first eco actions — any recycling, energy saving or clean-up counts.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>0 Points to unlock</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>AI-verified activity log</span>
                </div>
              </div>
            </motion.div>

            {/* Silver */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-md border-2 border-primary/20 relative overflow-hidden group transform md:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">Popular</span>
              </div>
              <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-slate-500/10 shadow-lg">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Tree Guardian 🌳</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                You're making a real difference. Lead biodiversity actions, organize clean-up drives and inspire your community.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>300 Points to unlock</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Community leaderboard ranking</span>
                </div>
              </div>
            </motion.div>

            {/* Gold */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-yellow-500/10 shadow-lg">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Climate Action Hero 🌍</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Our highest tier. You've built habits, led your community, and your CO₂ savings are measurable and verified.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>800 Points to unlock</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Portfolio showcase + AI insights</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">How Your Journey<br />to Impact Works</h2>
            <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
              We've simplified the path to making a difference. Follow our evidence-based framework to build sustainable habits and scale your influence.
            </p>
            <button className="btn-primary">Learn More About Scoring</button>
          </div>

          <div className="space-y-8">
            {[
              { num: "1", title: "Log Your Actions", desc: "Use our mobile app to record daily sustainable choices—from composting to commuting green." },
              { num: "2", title: "Earn Impact Points", desc: "Watch your dashboard grow as you collect points for every eco-friendly milestone you hit." },
              { num: "3", title: "Lead Your Community", desc: "Unlock project funding and mentorship as you transition from local action to leadership." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-primary/20">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Cards */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: reforestationImg, title: "AI-Verified Actions", desc: "Upload a photo of your eco action. Our Gemini-powered AI checks the evidence, scores the impact, and awards points automatically." },
              { img: universityImg, title: "Community Leaderboard", desc: "See how your suburb, team, and school rank. Every verified action moves you up and earns you recognition." },
              { img: analyticsImg, title: "Impact Analytics", desc: "Track your total CO₂ saved, plastic reduced, and water conserved — updated every time an action is verified." }
            ].map((card, i) => (
              <motion.div whileHover={{ y: -5 }} key={i} className="group">
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-md relative">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="text-lg font-bold mb-2">{card.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current events & tasks */}
      <section id="events-tasks" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">Current events & tasks</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Join challenges and events. Use AI Supervisor to see if a task fits your awareness.</p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target size={22} className="text-primary" />
                Active tasks
              </h3>
              <ul className="space-y-3">
                {tasks.slice(0, 4).map((t) => (
                  <li key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-900">{t.title}</p>
                    {t.pointsReward != null && <span className="text-sm font-semibold text-primary">{t.pointsReward} pts</span>}
                  </li>
                ))}
              </ul>
              <Link to={authPath} className="mt-4 inline-block text-primary font-semibold text-sm hover:underline">
                Join to take part →
              </Link>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar size={22} className="text-primary" />
                Upcoming events
              </h3>
              <ul className="space-y-3">
                {events.slice(0, 4).map((e) => (
                  <li key={e.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{e.date}</p>
                    <p className="font-bold text-slate-900 mt-1">{e.title}</p>
                    <p className="text-sm text-slate-500">{e.location}</p>
                  </li>
                ))}
              </ul>
              <Link to={authPath} className="mt-4 inline-block text-primary font-semibold text-sm hover:underline">
                Join to attend →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Grid */}
      <section className="py-24 bg-primary-light/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-slate-900 text-white rounded-[2rem] p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to make your mark?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
              Log real actions, earn AI-verified points, and track your community's CO₂ impact — one eco choice at a time.
            </p>
            <Link to={authPath} className="inline-block bg-primary hover:bg-primary-dark text-white text-lg px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20">
              {ctaBtnText}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="text-primary fill-primary" size={24} />
                <span className="font-display font-bold text-xl tracking-tight">EcoImpact</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
                AI-powered sustainability tracking. Log eco actions, earn verified impact points, and build a greener community.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Action Guides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Social</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <span className="font-bold">X</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Globe size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <span className="font-bold">in</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
            © 2026 EcoImpact. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
