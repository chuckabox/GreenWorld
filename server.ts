import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import cors from "cors";
import type { Server } from "http";

const db = new Database("database.sqlite");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'student',
    impact_points INTEGER DEFAULT 0,
    award_progress INTEGER DEFAULT 0,
    rank INTEGER
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    category TEXT,
    hours REAL,
    date TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending',
    evidence_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    icon TEXT,
    date_earned TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    status TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (email, name, role, impact_points, award_progress, rank) VALUES (?, ?, ?, ?, ?, ?)").run(
    "student@example.com", "Alex Green", "student", 450, 65, 12
  );
  db.prepare("INSERT INTO users (email, name, role) VALUES (?, ?, ?)").run(
    "admin@example.com", "Admin User", "admin"
  );
  
  const alexId = 1;
  db.prepare("INSERT INTO activities (user_id, category, hours, date, description, status) VALUES (?, ?, ?, ?, ?, ?)").run(
    alexId, "Waste Management", 4, "2024-03-10", "Organized a beach cleanup event with 20 volunteers.", "approved"
  );
  db.prepare("INSERT INTO activities (user_id, category, hours, date, description, status) VALUES (?, ?, ?, ?, ?, ?)").run(
    alexId, "Energy Conservation", 2, "2024-03-12", "Installed smart power strips in the student lounge.", "pending"
  );

  db.prepare("INSERT INTO badges (user_id, name, icon, date_earned) VALUES (?, ?, ?, ?)").run(
    alexId, "Waste Warrior", "Trash2", "2024-02-15"
  );
  db.prepare("INSERT INTO badges (user_id, name, icon, date_earned) VALUES (?, ?, ?, ?)").run(
    alexId, "Energy Saver", "Zap", "2024-03-01"
  );

  db.prepare("INSERT INTO projects (user_id, title, description, status) VALUES (?, ?, ?, ?)").run(
    alexId, "Campus Composting", "Implementing a large-scale composting system for the dining hall.", "In Progress"
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // API Routes
  app.get("/api/user/:email", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(req.params.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/user", (req, res) => {
    const { email, name } = req.body;
    try {
      const result = db.prepare(
        "INSERT INTO users (email, name, role, impact_points, award_progress, rank) VALUES (?, ?, 'student', 0, 0, 0)"
      ).run(email, name);
      const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json(newUser);
    } catch (err: any) {
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: "User already exists" });
      } else {
        res.status(500).json({ error: "Server error" });
      }
    }
  });

  app.get("/api/activities/:userId", (req, res) => {
    const activities = db.prepare("SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC").all(req.params.userId);
    res.json(activities);
  });

  app.post("/api/activities", (req, res) => {
    const { userId, category, hours, date, description, evidenceUrl } = req.body;
    const result = db.prepare(
      "INSERT INTO activities (user_id, category, hours, date, description, evidence_url) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(userId, category, hours, date, description, evidenceUrl);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/badges/:userId", (req, res) => {
    const badges = db.prepare("SELECT * FROM badges WHERE user_id = ?").all(req.params.userId);
    res.json(badges);
  });

  app.get("/api/projects/:userId", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects WHERE user_id = ?").all(req.params.userId);
    res.json(projects);
  });

  app.get("/api/admin/pending", (req, res) => {
    const pending = db.prepare(`
      SELECT a.*, u.name as user_name 
      FROM activities a 
      JOIN users u ON a.user_id = u.id 
      WHERE a.status = 'pending'
    `).all();
    res.json(pending);
  });

  app.post("/api/admin/review", (req, res) => {
    const { activityId, status, points } = req.body;
    db.prepare("UPDATE activities SET status = ? WHERE id = ?").run(status, activityId);
    if (status === 'approved' && points) {
      const activity = db.prepare("SELECT user_id FROM activities WHERE id = ?").get(activityId) as { user_id: number };
      db.prepare("UPDATE users SET impact_points = impact_points + ? WHERE id = ?").run(points, activity.user_id);
    }
    res.json({ success: true });
  });

  app.get("/api/leaderboard", (req, res) => {
    const leaderboard = db.prepare("SELECT name, impact_points, rank FROM users WHERE role = 'student' ORDER BY impact_points DESC LIMIT 10").all();
    res.json(leaderboard);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const preferredPort = Number(process.env.PORT || 3000);

  const startListening = (port: number): Server => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy, retrying on ${nextPort}...`);
        startListening(nextPort);
        return;
      }
      throw error;
    });

    return server;
  };

  startListening(preferredPort);
}

startServer();
