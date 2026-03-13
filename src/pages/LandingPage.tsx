import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Users, Award, CheckCircle2, Trophy, Globe } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

import heroBg from "../assets/hero_background.png";
import reforestationImg from "../assets/reforestation.png";
import universityImg from "../assets/university_recognition.png";
import analyticsImg from "../assets/impact_analytics.png";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary fill-primary" size={24} />
            <span className="font-display font-bold text-xl tracking-tight">Impact Award</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#levels" className="hover:text-primary transition-colors">Levels</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#winners" className="hover:text-primary transition-colors">Winners</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>
          <Link to="/dashboard" className="btn-primary text-sm shadow-md shadow-primary/20">Join Now</Link>
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
              2024 Applications Open
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4 drop-shadow-lg">
              Lead the Change.<br />
              <span className="text-primary drop-shadow-md">Earn the Award.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow">
              Join a global community of students committed to a greener future. Complete impact goals and earn official recognition for your sustainability leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">
                Get Started Today
              </Link>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl font-bold text-white transition-all hover:-translate-y-1">
                View Past Winners
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Award Levels */}
      <section id="levels" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Award Levels</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Bronze */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-orange-500/10 shadow-lg">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Bronze Level</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Perfect for beginners starting their eco-journey. Focus on daily green habits and personal plastic reduction.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>25 Community Points</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Habit Tracker (30 Days)</span>
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
              <h3 className="text-xl font-bold mb-3">Silver Level</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Elevate your impact through advocacy. Organize school workshops and lead community recycling drives.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>100 Community Points</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>1 Community Initiative</span>
                </div>
              </div>
            </motion.div>

            {/* Gold */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-yellow-500/10 shadow-lg">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Gold Level</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Our highest honor for true leaders. Spearhead long-term environmental projects and policy changes.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>500 Community Points</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Measurable Policy Impact</span>
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
              { img: reforestationImg, title: "Verified Reforestation", desc: "For every 50 points you earn, we plant a native tree in your name with our global partners." },
              { img: universityImg, title: "University Recognition", desc: "Our award is recognized by top universities globally as a mark of leadership and civic duty." },
              { img: analyticsImg, title: "Impact Analytics", desc: "Get real-time data on how your individual actions translate into CO2 offset and water saved." }
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

      {/* Call to Action Grid */}
      <section className="py-24 bg-primary-light/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-slate-900 text-white rounded-[2rem] p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to make your mark?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
              Join over 10,000 students worldwide who are already creating a measurable impact in their communities.
            </p>
            <Link to="/dashboard" className="inline-block bg-primary hover:bg-primary-dark text-white text-lg px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20">
              Join the Movement Now
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
                <span className="font-display font-bold text-xl tracking-tight">Impact Award</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
                Empowering the next generation of environmental leaders through recognition and resources.
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
            © 2024 Sustainability Impact Award. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
