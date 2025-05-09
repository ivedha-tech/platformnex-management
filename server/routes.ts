import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get developer metrics data
  app.get("/api/metrics/developer", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const metrics = await storage.getDeveloperMetrics();
      res.json(metrics);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch developer metrics" });
    }
  });

  // Get feedback data
  app.get("/api/feedback", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const feedbackItems = await storage.getFeedback();
      res.json(feedbackItems);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch feedback data" });
    }
  });

  // Get activity logs
  app.get("/api/activity", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const logs = await storage.getActivityLogs();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Get golden path templates
  app.get("/api/templates", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const templates = await storage.getGoldenPathTemplates();
      res.json(templates);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Create a new golden path template
  app.post("/api/templates", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const template = await storage.createGoldenPathTemplate({
        ...req.body,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      res.status(201).json(template);
    } catch (err) {
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Get all users (for user management)
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Check if user has admin role
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin role required" });
      }
      
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
