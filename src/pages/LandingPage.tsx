import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Leaf, Users, Award, CheckCircle2, Trophy, Globe, ChevronDown, Target, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

import heroBg from "../assets/hero_background.png";
import reforestationImg from "../assets/reforestation.png";
import universityImg from "../assets/university_recognition.png";
import analyticsImg from "../assets/impact_analytics.png";
import councilImg from "../assets/council_support.png";
import tasksAndEventsData from "../data/tasksAndEvents.json";

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

  type TaskItem = { id: string; type: string; title: string; description?: string; pointsReward?: number };
  type EventItem = { id: string; type: string; title: string; date?: string; location?: string };
  const tasks = useMemo(() => (tasksAndEventsData as (TaskItem | EventItem)[]).filter((t) => t.type === "task") as TaskItem[], []);
  const events = useMemo(() => (tasksAndEventsData as (TaskItem | EventItem)[]).filter((t) => t.type === "event") as EventItem[], []);

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
            <a href="#council" className="hover:text-primary transition-colors">Council</a>
            <a href="#levels" className="hover:text-primary transition-colors">Badges</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#events-tasks" className="hover:text-primary transition-colors">Events & tasks</a>
          </div>
          <Link to={authPath} className="btn-primary text-sm shadow-md">{authText}</Link>
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
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4 drop-shadow-lg">
              Make an impact.<br />
              <span className="text-primary drop-shadow-md">Earn the Badge.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow">
              Log your eco actions, get them AI-verified, and earn impact points. Track your CO₂ savings, climb the leaderboard, and unlock badges that prove your commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <motion.a
                href="#levels"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                <ChevronDown size={48} strokeWidth={3} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Council Support Section */}
      <section id="council" className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Supported by Brisbane City Council</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              We are proud to be supported by the Brisbane City Council in our mission to build a more sustainable future. Through this partnership, we're empowering residents to take verifiable action for our local environment.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-px w-12 bg-slate-200"></div>
              <span className="text-slate-400 font-medium text-sm">Working together for a cleaner Brisbane</span>
              <div className="h-px w-12 bg-slate-200"></div>
            </div>
          </div>
          <div className="w-full max-w-[320px] md:max-w-none md:flex-1 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all opacity-70"></div>
              <img
                src={councilImg}
                alt="Brisbane City Council Support"
                className="relative w-full max-w-[400px] h-auto object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
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
            {/* Sustainability Badge II (2nd place, Left) */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
              <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability Badge II 🌳</h3>
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

            {/* Sustainability Badge III (Best, Middle) */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-md border-2 border-primary/20 relative overflow-hidden group transform md:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">Popular</span>
              </div>
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 whitespace-nowrap">Sustainability Badge III 🌍</h3>
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

            {/* Sustainability Badge I (3rd place, Right) */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability Badge I 🌱</h3>
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
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">How Your Journey<br />to Impact Works</h2>
            <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
              Make a difference step by step. Use our framework to build green habits and grow your impact.
            </p>
            <button className="btn-primary">Learn More About Scoring</button>
          </div>

          <div className="space-y-8">
            {[
              { num: "1", title: "Log Your Actions", desc: "Record your sustainability activities like recycling, volunteering, or saving energy." },
              { num: "2", title: "AI Verification", desc: "Our AI reviews your submissions and verifies that the activity meets sustainability criteria." },
              { num: "3", title: "Earn Points & Climb", desc: "Receive impact points for verified actions and move up the community leaderboard." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg">
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
              { img: reforestationImg, title: "AI-Verified Actions", desc: "Upload a photo of your eco action. Our AI checks it, scores the impact, and awards points." },
              { img: universityImg, title: "Leaderboard", desc: "See your rank in your volunteering community. Verified activities move you up." },
              { img: analyticsImg, title: "Impact Stats", desc: "Track CO₂ saved, plastic reduced, and water conserved." }
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
            <p className="text-slate-500 max-w-xl mx-auto">
              Join challenges and events. Use AI Advisor to see if a task fits you.
            </p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4" />
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
                    <p className="font-medium text-slate-900">{t.title}</p>
                    {t.pointsReward != null && (
                      <span className="text-sm font-semibold text-primary">{t.pointsReward} pts</span>
                    )}
                  </li>
                ))}
              </ul>
              <Link to={isLoggedIn ? "/ai-supervisor" : authPath} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {isLoggedIn ? "Check fit in AI Advisor" : "Sign in to use AI Advisor"}
                <ChevronDown size={16} className="rotate-[-90deg]" />
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
                    <p className="font-bold text-slate-900">{e.title}</p>
                    <p className="text-sm text-slate-500">{e.date}{e.location ? ` · ${e.location}` : ""}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Grid */}
      <section className="py-24 bg-emerald-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-white rounded-[2rem] p-12 md:p-16 text-center shadow-2xl border border-emerald-800/50">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to make your mark?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-xl mx-auto">
              Log real actions, earn AI-verified points, and track your community's CO₂ impact — one eco choice at a time.
            </p>
            <Link to={authPath} className="inline-block bg-primary hover:bg-primary-light hover:text-primary text-white text-lg px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-emerald-900/40">
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
