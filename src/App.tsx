import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { motion } from "motion/react";

import { UserData, Activity, StoredUser } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { Dashboard } from "./pages/Dashboard";
import { Leaderboard } from "./pages/Leaderboard";
import { Portfolio } from "./pages/Portfolio";
import { AdminPortal } from "./pages/AdminPortal";
import { AISupervisor } from "./pages/AISupervisor";
import { LearningHub } from "./pages/LearningHub";
import { GreenHubCategory } from "./pages/GreenHubCategory";
import { DiscussionBoard } from "./pages/DiscussionBoard";
import demoAccounts from "./data/demoAccounts.json";

const AppContent = () => {
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem("userEmail") || "");
  const [user, setUser] = useState<UserData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadUserData = () => {
    setLoading(true);
    const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const demoUsers = demoAccounts as StoredUser[];

    // Keep hardcoded demo accounts available even when old localStorage data exists.
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

    if (!userEmail) {
      setUser(null);
      setActivities([]);
      setLoading(false);
      return;
    }

    const currentUser = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (!currentUser) {
      localStorage.removeItem("userEmail");
      setUserEmail("");
      setUser(null);
      setActivities([]);
      setLoading(false);
      return;
    }

    setUser(currentUser);
    
    // Mock activities
    const storedActivities: Activity[] = JSON.parse(localStorage.getItem("activities") || "[]");
    const userActivities = storedActivities.filter((a) => a.user_id === currentUser.id);
    
    if (userActivities.length === 0 && currentUser.id === 1) {
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

  const isLanding = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const hideLayout = isLanding || isAuthPage;
  const isProtectedRoute = !isLanding && !isAuthPage;

  if (!loading && !user && isProtectedRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {!hideLayout && user && <Sidebar user={user} />}
      <main className="flex-1 flex flex-col min-w-0">
        {!hideLayout && <Header title={
          location.pathname === "/dashboard" ? "Dashboard" :
          location.pathname === "/ai-supervisor" ? "AI Advisor" :
          location.pathname === "/learning" ? "Green Hub" :
          location.pathname === "/green-hub/waste-circular" ? "Waste & Circular Economy" :
          location.pathname === "/community" ? "Community" :
          location.pathname === "/leaderboard" ? "Leaderboard" :
          location.pathname === "/portfolio" ? "Profile" :
          location.pathname === "/admin" ? "Admin Portal" : ""
        } />}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="will-change-transform"
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage onLogin={(email: string) => { localStorage.setItem("userEmail", email); setUserEmail(email); }} />} />
              <Route path="/signup" element={<SignUpPage onSignUp={(payload) => {
                const { email, name, password, role, suburb, team } = payload;
                if (name) {
                  const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
                  const userExists = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
                  if (!userExists) {
                    const newUser: StoredUser = {
                      id: Date.now(),
                      email,
                      name,
                      role,
                      impact_points: 0,
                      award_progress: 0,
                      rank: 0,
                      suburb,
                      team,
                      password,
                    };
                    localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));
                  }
                }
                localStorage.setItem("userEmail", email); 
                setUserEmail(email); 
              }} />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} activities={activities} onActivityLogged={loadUserData} /> : <Navigate to="/login" replace />} />
              <Route path="/ai-supervisor" element={user ? <AISupervisor user={user} activities={activities} onPointsAdded={loadUserData} /> : <Navigate to="/login" replace />} />
              <Route path="/learning" element={user ? <LearningHub /> : <Navigate to="/login" replace />} />
              <Route path="/green-hub/waste-circular" element={user ? <GreenHubCategory /> : <Navigate to="/login" replace />} />
              <Route path="/community" element={user ? <DiscussionBoard user={user} /> : <Navigate to="/login" replace />} />
              <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" replace />} />
              <Route path="/portfolio" element={user ? <Portfolio user={user} /> : <Navigate to="/login" replace />} />
              <Route path="/admin" element={user ? <AdminPortal /> : <Navigate to="/login" replace />} />
            </Routes>
          </motion.div>
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
