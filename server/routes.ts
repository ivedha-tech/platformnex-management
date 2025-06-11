import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import fetch from "node-fetch";

const BACKSTAGE_API_URL = "https://platformnex-backend-pyzx2jrmda-uc.a.run.app";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Proxy route for Backstage API catalog entities
  app.get("/api/catalog/entities", async (req, res) => {
    try {
      const response = await fetch(
        `${BACKSTAGE_API_URL}/api/catalog/entities?${req.url.split('?')[1]}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Backstage API');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

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

  // Get all plugin updates
  app.get("/api/plugins", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const updates = await storage.getPluginUpdates();
      res.json(updates);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch plugin updates" });
    }
  });

  // Get plugin updates by domain
  app.get("/api/plugins/domain/:domain", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { domain } = req.params;
      const updates = await storage.getPluginUpdatesByDomain(domain);
      res.json(updates);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch plugin updates by domain" });
    }
  });

  // Create a new plugin update
  app.post("/api/plugins", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Check if user has admin role
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin role required" });
      }
      
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const pluginUpdate = await storage.createPluginUpdate({
        ...req.body,
        updatedBy: userId,
        updatedAt: new Date(),
      });
      
      res.status(201).json(pluginUpdate);
    } catch (err) {
      res.status(500).json({ message: "Failed to create plugin update" });
    }
  });

  // Update plugin status
  app.patch("/api/plugins/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Check if user has admin role
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin role required" });
      }
      
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedPlugin = await storage.updatePluginStatus(parseInt(id), status);
      
      if (!updatedPlugin) {
        return res.status(404).json({ message: "Plugin update not found" });
      }
      
      res.json(updatedPlugin);
    } catch (err) {
      res.status(500).json({ message: "Failed to update plugin status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
