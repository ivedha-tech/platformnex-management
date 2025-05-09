import { users, developerMetrics, feedback, activityLog, goldenPathTemplate } from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  DeveloperMetric, 
  Feedback, 
  ActivityLog, 
  GoldenPathTemplate 
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Developer metrics
  getDeveloperMetrics(): Promise<DeveloperMetric[]>;
  
  // Feedback
  getFeedback(): Promise<Feedback[]>;
  
  // Activity logs
  getActivityLogs(): Promise<ActivityLog[]>;
  
  // Golden path templates
  getGoldenPathTemplates(): Promise<GoldenPathTemplate[]>;
  createGoldenPathTemplate(template: Omit<GoldenPathTemplate, 'id'>): Promise<GoldenPathTemplate>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private developerMetrics: Map<number, DeveloperMetric>;
  private feedbackItems: Map<number, Feedback>;
  private activityLogs: Map<number, ActivityLog>;
  private goldenPathTemplates: Map<number, GoldenPathTemplate>;
  
  sessionStore: session.SessionStore;
  
  userId: number = 1;
  metricId: number = 1;
  feedbackId: number = 1;
  logId: number = 1;
  templateId: number = 1;

  constructor() {
    this.users = new Map();
    this.developerMetrics = new Map();
    this.feedbackItems = new Map();
    this.activityLogs = new Map();
    this.goldenPathTemplates = new Map();
    
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create initial admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$RrWP5yNauNQbJ.K.RzWIze7ITi6lhZnZJvbXQJQKjUcOjMqC8h2nK", // "admin123"
      email: "admin@platformnex.com",
      role: "admin",
      firstName: "Admin",
      lastName: "User"
    });
    
    // Seed developer metrics data
    this.seedDeveloperMetrics();
    
    // Seed feedback data
    this.seedFeedback();
    
    // Seed activity logs
    this.seedActivityLogs();
    
    // Seed golden path templates
    this.seedGoldenPathTemplates();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getDeveloperMetrics(): Promise<DeveloperMetric[]> {
    return Array.from(this.developerMetrics.values());
  }
  
  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbackItems.values());
  }
  
  async getActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values());
  }
  
  async getGoldenPathTemplates(): Promise<GoldenPathTemplate[]> {
    return Array.from(this.goldenPathTemplates.values());
  }
  
  async createGoldenPathTemplate(template: Omit<GoldenPathTemplate, 'id'>): Promise<GoldenPathTemplate> {
    const id = this.templateId++;
    const newTemplate: GoldenPathTemplate = { ...template, id };
    this.goldenPathTemplates.set(id, newTemplate);
    return newTemplate;
  }
  
  private seedDeveloperMetrics() {
    // Last 7 days of metrics
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate some reasonable metrics
      const satisfactionScore = 80 + Math.floor(Math.random() * 15);
      const activeUsers = 100 + Math.floor(Math.random() * 50);
      const taskCompletionRate = 90 + Math.floor(Math.random() * 8);
      const responseTime = 1500 + Math.floor(Math.random() * 500);
      
      const metric: DeveloperMetric = {
        id: this.metricId++,
        date,
        satisfactionScore,
        activeUsers,
        taskCompletionRate,
        responseTime
      };
      
      this.developerMetrics.set(metric.id, metric);
    }
  }
  
  private seedFeedback() {
    const feedbackData = [
      {
        userId: 1,
        rating: 4,
        comment: "The CI/CD pipeline templates are very useful, but I'd like to see more customization options for deployment strategies.",
        category: "CI/CD Pipeline",
        date: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        userId: 1,
        rating: 5,
        comment: "The API configuration tool has significantly reduced our development time. Great job on the latest updates!",
        category: "API Creation",
        date: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        userId: 1,
        rating: 3,
        comment: "The security scanning feature works well but occasionally gives false positives. Would be nice to have more configuration options.",
        category: "Security",
        date: new Date(Date.now() - 2 * 86400000) // 2 days ago
      }
    ];
    
    feedbackData.forEach(item => {
      const feedback: Feedback = {
        id: this.feedbackId++,
        ...item
      };
      this.feedbackItems.set(feedback.id, feedback);
    });
  }
  
  private seedActivityLogs() {
    const activities = [
      {
        userId: 1,
        action: "Created",
        resource: "Template",
        status: "Success",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        details: "Created new CI/CD pipeline template"
      },
      {
        userId: 1,
        action: "Updated",
        resource: "Configuration",
        status: "Success",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        details: "Updated Kubernetes orchestrator configuration"
      },
      {
        userId: 1,
        action: "Deleted",
        resource: "Template",
        status: "Success",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        details: "Removed deprecated template"
      },
      {
        userId: 1,
        action: "Deploy",
        resource: "Application",
        status: "Failed",
        timestamp: new Date(Date.now() - 2 * 86400000), // 2 days ago
        details: "Deployment failed due to resource constraints"
      }
    ];
    
    activities.forEach(activity => {
      const log: ActivityLog = {
        id: this.logId++,
        ...activity
      };
      this.activityLogs.set(log.id, log);
    });
  }
  
  private seedGoldenPathTemplates() {
    const templates = [
      {
        name: "Standard CI/CD Pipeline",
        description: "A comprehensive CI/CD pipeline for web applications with automated testing and deployment",
        category: "CI/CD",
        content: JSON.stringify({
          stages: ["build", "test", "deploy"],
          // More template content here
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 30 * 86400000), // 30 days ago
        updatedAt: new Date(Date.now() - 5 * 86400000), // 5 days ago
        isActive: true
      },
      {
        name: "Kubernetes Deployment",
        description: "Template for deploying applications to Kubernetes clusters",
        category: "Orchestration",
        content: JSON.stringify({
          resources: ["deployment", "service", "ingress"],
          // More template content here
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 20 * 86400000), // 20 days ago
        updatedAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
        isActive: true
      },
      {
        name: "Secure API Gateway",
        description: "Template for setting up a secure API gateway with rate limiting and authentication",
        category: "API",
        content: JSON.stringify({
          security: ["oauth2", "rate-limiting", "waf"],
          // More template content here
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 15 * 86400000), // 15 days ago
        updatedAt: new Date(Date.now() - 15 * 86400000), // 15 days ago
        isActive: true
      }
    ];
    
    templates.forEach(template => {
      const goldenPath: GoldenPathTemplate = {
        id: this.templateId++,
        ...template
      };
      this.goldenPathTemplates.set(goldenPath.id, goldenPath);
    });
  }
}

export const storage = new MemStorage();
