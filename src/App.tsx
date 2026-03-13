import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { UserData, Activity } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { Dashboard } from "./pages/Dashboard";
import { LogActivity } from "./pages/LogActivity";
import { Leaderboard } from "./pages/Leaderboard";
import { Portfolio } from "./pages/Portfolio";
import { AdminPortal } from "./pages/AdminPortal";

const AppContent = () => {
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem("userEmail") || "student@example.com");
  const [user, setUser] = useState<UserData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadUserData = () => {
    setLoading(true);
    // Get users from localStorage or initialize with default
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    let currentUser = storedUsers.find((u: any) => u.email === userEmail);

    if (!currentUser && userEmail === "student@example.com") {
      currentUser = {
        id: 1,
        email: "student@example.com",
        name: "Alex Green",
        role: "student",
        impact_points: 450,
        award_progress: 65,
        rank: 12
      };
      localStorage.setItem("users", JSON.stringify([currentUser]));
    } else if (!currentUser) {
      // Auto-create user if they don't exist
      const nameFromEmail = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const nameCapitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      currentUser = {
        id: Date.now(),
        email: userEmail,
        name: nameCapitalized,
        role: "student",
        impact_points: 0,
        award_progress: 0,
        rank: 0
      };
      localStorage.setItem("users", JSON.stringify([...storedUsers, currentUser]));
    }

    setUser(currentUser);
    
    // Mock activities
    const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    const userActivities = storedActivities.filter((a: any) => a.user_id === currentUser?.id);
    
    if (userActivities.length === 0 && currentUser?.id === 1) {
      const defaultActivities = [
        { id: 1, user_id: 1, category: "Waste Management", hours: 4, date: "2024-03-10", description: "Beach cleanup", status: "approved" },
        { id: 2, user_id: 1, category: "Energy Conservation", hours: 2, date: "2024-03-12", description: "Smart power strips", status: "pending" }
      ];
      localStorage.setItem("activities", JSON.stringify(defaultActivities));
      setActivities(defaultActivities);
    } else {
      setActivities(userActivities);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, [userEmail]);

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
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const hideLayout = isLanding || isAuthPage;

  return (
    <div className="flex min-h-screen">
      {!hideLayout && <Sidebar user={user} />}
      <main className="flex-1 flex flex-col min-w-0">
        {!hideLayout && <Header title={
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
                <Route path="/login" element={<LoginPage onLogin={(email: string) => { localStorage.setItem("userEmail", email); setUserEmail(email); }} />} />
                <Route path="/signup" element={<SignUpPage onSignUp={(email: string, name?: string) => { 
                  if (name) {
                    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
                    const userExists = storedUsers.find((u: any) => u.email === email);
                    if (!userExists) {
                      const newUser = {
                        id: Date.now(),
                        email: email,
                        name: name,
                        role: "student",
                        impact_points: 0,
                        award_progress: 0,
                        rank: 0
                      };
                      localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));
                    }
                  }
                  localStorage.setItem("userEmail", email); 
                  setUserEmail(email); 
                }} />} />
                <Route path="/dashboard" element={<Dashboard user={user} activities={activities} />} />
                <Route path="/log" element={<LogActivity userId={user.id} onActivityLogged={loadUserData} />} />
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
