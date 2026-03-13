import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Leaf, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Menu,
  X,
  Search,
  Bell,
  Trash2,
  Zap,
  Globe,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  impact_points: number;
  award_progress: number;
  rank: number;
}

interface Activity {
  id: number;
  category: string;
  hours: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

// --- Components ---

const Sidebar = ({ user }: { user: UserData }) => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Log Activity", path: "/log", icon: PlusCircle },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Impact Portfolio", path: "/portfolio", icon: User },
  ];

  if (user.role === 'admin') {
    navItems.push({ name: "Admin Portal", path: "/admin", icon: ShieldCheck });
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <Leaf size={24} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">EcoImpact</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
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
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-bottom border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
      <h1 className="text-xl font-display font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

// --- Pages ---

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="text-primary" size={32} />
          <span className="font-display font-bold text-2xl">EcoImpact</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#how" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#awards" className="hover:text-primary transition-colors">Award Levels</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
        </div>
        <Link to="/dashboard" className="btn-primary">Get Started</Link>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary rounded-full text-sm font-bold mb-6">
            2024 APPLICATIONS OPEN
          </span>
          <h1 className="text-6xl md:text-7xl leading-tight mb-6">
            Lead the Change for a <span className="text-primary">Greener</span> Future
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-lg">
            Join thousands of students across the globe in the Sustainability Impact Award. Track your actions, earn recognition, and build your environmental legacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">Start Your Journey</Link>
            <button className="px-8 py-4 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">View Past Winners</button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
              alt="Sustainability" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Users size={20} />
              <span className="font-bold">12k+</span>
            </div>
            <p className="text-sm text-slate-500">Students actively participating this year</p>
          </div>
        </motion.div>
      </section>

      {/* Award Levels */}
      <section id="awards" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Recognizing Every Contribution</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">From individual actions to community-wide initiatives, earn awards that validate your commitment to the planet.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { level: "Bronze", points: "100", color: "bg-orange-100 text-orange-700", desc: "For students starting their sustainability journey." },
              { level: "Silver", points: "500", color: "bg-slate-200 text-slate-700", desc: "Demonstrating consistent impact and leadership." },
              { level: "Gold", points: "1000+", color: "bg-yellow-100 text-yellow-700", desc: "Exceptional contribution and systemic change." },
            ].map((award, i) => (
              <motion.div 
                key={award.level}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", award.color)}>
                  <Award size={32} />
                </div>
                <h3 className="text-2xl mb-2">{award.level} Award</h3>
                <p className="text-slate-500 mb-6">{award.desc}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="font-bold">{award.points} Points</span>
                  <ChevronRight className="text-slate-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Dashboard = ({ user, activities }: { user: UserData, activities: Activity[] }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500">Here's your sustainability impact overview.</p>
        </div>
        <Link to="/log" className="btn-primary flex items-center gap-2">
          <PlusCircle size={20} />
          Log New Activity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Impact Points</p>
            <p className="text-2xl font-bold">{user.impact_points}</p>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 font-medium">Award Progress</p>
            <span className="text-sm font-bold text-primary">{user.award_progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${user.award_progress}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Next: Silver Award (500 pts)</p>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Global Rank</p>
            <p className="text-2xl font-bold">#{user.rank}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Recent Activities</h3>
            <Link to="/portfolio" className="text-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{activity.category}</p>
                  <p className="text-xs text-slate-500">{activity.date} • {activity.hours} hours</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold capitalize",
                  activity.status === 'approved' ? "bg-green-100 text-green-700" :
                  activity.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {activity.status}
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>No activities logged yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Green Events */}
        <div className="card">
          <h3 className="text-xl mb-6">Upcoming Green Events</h3>
          <div className="space-y-4">
            {[
              { title: "Tree Planting Day", date: "Mar 20", location: "Central Park" },
              { title: "Eco-Tech Workshop", date: "Mar 25", location: "Innovation Hub" },
              { title: "Zero Waste Seminar", date: "Apr 02", location: "Online" },
            ].map((event, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{event.date}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
                <p className="font-bold">{event.title}</p>
                <p className="text-xs text-slate-500">{event.location}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Explore All Events
          </button>
        </div>
      </div>
    </div>
  );
};

const LogActivity = ({ userId, onActivityLogged }: { userId: number, onActivityLogged: () => void }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "Waste Management",
    hours: 1,
    date: new Date().toISOString().split('T')[0],
    description: "",
    evidenceUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        onActivityLogged();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl">Log Your Impact</h2>
        <p className="text-slate-500">Tell us about your sustainability contribution.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Category</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Waste Management</option>
              <option>Energy Conservation</option>
              <option>Community Outreach</option>
              <option>Environmental Advocacy</option>
              <option>Biodiversity</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hours Involved</label>
            <input 
              type="number" 
              min="0.5" 
              step="0.5"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.hours}
              onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Date of Activity</label>
          <input 
            type="date" 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea 
            rows={4}
            placeholder="What did you do? What was the impact?"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Evidence (Optional URL)</label>
          <input 
            type="url" 
            placeholder="Link to photos, reports, or social posts"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.evidenceUrl}
            onChange={(e) => setFormData({...formData, evidenceUrl: e.target.value})}
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary flex-1 py-4 disabled:opacity-50"
          >
            {isSubmitting ? "Logging..." : "Submit for Review"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-8 py-4 border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => setLeaders(data));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl">Community Leaderboard</h2>
        <p className="text-slate-500">Celebrating the top sustainability champions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Top Individuals</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-primary-light text-primary rounded-lg text-xs font-bold">Weekly</button>
              <button className="px-3 py-1 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50">All Time</button>
            </div>
          </div>
          <div className="space-y-2">
            {leaders.map((leader, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className={cn(
                  "w-8 text-center font-bold",
                  i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-slate-300"
                )}>
                  {i + 1}
                </span>
                <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} alt="avatar" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{leader.name}</p>
                  <p className="text-xs text-slate-500">Rank #{leader.rank}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{leader.impact_points}</p>
                  <p className="text-xs text-slate-400">Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-primary text-white">
            <h3 className="text-xl mb-4">Community Impact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-80">Total Carbon Offset</p>
                <p className="text-3xl font-bold">12,450 kg</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Waste Diverted</p>
                <p className="text-3xl font-bold">4.2 Tons</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Volunteer Hours</p>
                <p className="text-3xl font-bold">8,900+</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl mb-4">Highlights</h3>
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1530584735268-5b1c58727a3a?auto=format&fit=crop&q=80&w=500" alt="highlight" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="font-bold mb-1">Green Campus Initiative</p>
            <p className="text-sm text-slate-500">The Student Union successfully implemented solar charging stations across campus.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = ({ user }: { user: UserData }) => {
  const [badges, setBadges] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/badges/${user.id}`).then(res => res.json()).then(data => setBadges(data));
    fetch(`/api/projects/${user.id}`).then(res => res.json()).then(data => setProjects(data));
  }, [user.id]);

  return (
    <div className="p-6 space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl mb-2">{user.name}</h2>
          <p className="text-slate-500 mb-4">Sustainability Leader • Environmental Science Student</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 bg-primary-light text-primary rounded-full text-sm font-bold">Silver Award Candidate</span>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">Eco-Ambassador</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold text-primary">{user.impact_points}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Impact Points</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold text-blue-600">{badges.length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Badges</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges */}
        <div className="card">
          <h3 className="text-xl mb-6">Earned Badges</h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  {badge.icon === 'Trash2' ? <Trash2 size={24} /> : <Zap size={24} />}
                </div>
                <p className="text-sm font-bold">{badge.name}</p>
                <p className="text-[10px] text-slate-400 mt-1">{badge.date_earned}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Focus */}
        <div className="card">
          <h3 className="text-xl mb-6">Impact Focus</h3>
          <div className="space-y-6">
            {[
              { label: "Waste Management", progress: 85, color: "bg-green-500" },
              { label: "Energy Efficiency", progress: 45, color: "bg-blue-500" },
              { label: "Advocacy", progress: 60, color: "bg-purple-500" },
              { label: "Biodiversity", progress: 30, color: "bg-orange-500" },
            ].map((focus, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{focus.label}</span>
                  <span className="text-slate-500">{focus.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", focus.color)} style={{ width: `${focus.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="card">
          <h3 className="text-xl mb-6">Completed Projects</h3>
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">{project.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">{project.status}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPortal = () => {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/pending").then(res => res.json()).then(data => setPending(data));
  }, []);

  const handleReview = async (activityId: number, status: string, points: number) => {
    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, status, points })
    });
    if (res.ok) {
      setPending(pending.filter(a => a.id !== activityId));
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-slate-900 text-white">
          <p className="text-sm opacity-70">Total Submissions</p>
          <p className="text-3xl font-bold">1,284</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Approved Today</p>
          <p className="text-3xl font-bold text-green-600">42</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Active Students</p>
          <p className="text-3xl font-bold text-blue-600">856</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl mb-6">Review Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-sm text-slate-500">Student</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Activity</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Hours</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Date</th>
                <th className="pb-4 font-bold text-sm text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pending.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_name}`} alt="avatar" />
                      </div>
                      <span className="font-semibold">{item.user_name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{item.description}</p>
                  </td>
                  <td className="py-4 font-medium">{item.hours}h</td>
                  <td className="py-4 text-slate-500 text-sm">{item.date}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleReview(item.id, 'approved', item.hours * 10)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleReview(item.id, 'rejected', 0)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <AlertCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Queue is empty. Great job!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const AppContent = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchUserData = async () => {
    try {
      const userRes = await fetch("/api/user/student@example.com");
      const userData = await userRes.json();
      setUser(userData);
      
      if (userData.id) {
        const actRes = await fetch(`/api/activities/${userData.id}`);
        const actData = await actRes.json();
        setActivities(actData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <Leaf size={48} />
        </motion.div>
      </div>
    );
  }

  if (!user) return <div>Error loading user.</div>;

  const isLanding = location.pathname === "/";

  return (
    <div className="flex min-h-screen">
      {!isLanding && <Sidebar user={user} />}
      <main className="flex-1 flex flex-col min-w-0">
        {!isLanding && <Header title={
          location.pathname === "/dashboard" ? "Student Dashboard" :
          location.pathname === "/log" ? "Log Activity" :
          location.pathname === "/leaderboard" ? "Leaderboard" :
          location.pathname === "/portfolio" ? "Impact Portfolio" :
          location.pathname === "/admin" ? "Admin Portal" : ""
        } />}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard user={user} activities={activities} />} />
                <Route path="/log" element={<LogActivity userId={user.id} onActivityLogged={fetchUserData} />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/portfolio" element={<Portfolio user={user} />} />
                <Route path="/admin" element={<AdminPortal />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
