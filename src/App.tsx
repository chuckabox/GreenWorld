import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { UserData, Activity } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { LogActivity } from "./pages/LogActivity";
import { Leaderboard } from "./pages/Leaderboard";
import { Portfolio } from "./pages/Portfolio";
import { AdminPortal } from "./pages/AdminPortal";

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
