import { users, developerMetrics, feedback, activityLog, goldenPathTemplate, pluginUpdate } from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  DeveloperMetric, 
  Feedback, 
  ActivityLog, 
  GoldenPathTemplate,
  PluginUpdate
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
  
  // Plugin updates
  getPluginUpdates(): Promise<PluginUpdate[]>;
  getPluginUpdatesByDomain(domain: string): Promise<PluginUpdate[]>;
  createPluginUpdate(update: Omit<PluginUpdate, 'id'>): Promise<PluginUpdate>;
  updatePluginStatus(id: number, status: string): Promise<PluginUpdate | undefined>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private developerMetrics: Map<number, DeveloperMetric>;
  private feedbackItems: Map<number, Feedback>;
  private activityLogs: Map<number, ActivityLog>;
  private goldenPathTemplates: Map<number, GoldenPathTemplate>;
  private pluginUpdates: Map<number, PluginUpdate>;
  
  sessionStore: any;
  
  userId: number = 1;
  metricId: number = 1;
  feedbackId: number = 1;
  logId: number = 1;
  templateId: number = 1;
  pluginId: number = 1;

  constructor() {
    this.users = new Map();
    this.developerMetrics = new Map();
    this.feedbackItems = new Map();
    this.activityLogs = new Map();
    this.goldenPathTemplates = new Map();
    this.pluginUpdates = new Map();
    
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create initial admin user with correctly hashed password for our system
    this.users.set(this.userId, {
      id: this.userId++,
      username: "admin",
      password: "0192023a7bbd73250516f069df18b500.73616c74", // hashed "admin123" with our system
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
    
    // Seed plugin updates
    this.seedPluginUpdates();
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
    // Handle nullable fields with proper default values
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      role: insertUser.role || "user" // Default role
    };
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
        comment: "The deployment templates are very useful, but I'd like to see more customization options for deployment strategies.",
        category: "Build & Deploy",
        date: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        userId: 1,
        rating: 5,
        comment: "The reliability testing tools have significantly reduced our incident rates. Great job on the latest updates!",
        category: "Reliability",
        date: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        userId: 1,
        rating: 3,
        comment: "The security scanning feature works well but occasionally gives false positives. Would be nice to have more configuration options.",
        category: "Security",
        date: new Date(Date.now() - 2 * 86400000) // 2 days ago
      },
      {
        userId: 1,
        rating: 4,
        comment: "The verification pipeline is excellent but could use better integration with our testing frameworks.",
        category: "Verify",
        date: new Date(Date.now() - 3 * 86400000) // 3 days ago
      },
      {
        userId: 1,
        rating: 5,
        comment: "The cloud operations dashboard provides great visibility into our infrastructure. Very intuitive!",
        category: "Cloud Operations",
        date: new Date(Date.now() - 4 * 86400000) // 4 days ago
      },
      {
        userId: 1,
        rating: 4,
        comment: "The cost optimization recommendations from FinOps have helped us reduce cloud spend by 20%.",
        category: "FinOps",
        date: new Date(Date.now() - 5 * 86400000) // 5 days ago
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
      },
      {
        name: "Microservice Template",
        description: "A complete template for building scalable microservices with service discovery and tracing",
        category: "Application",
        content: JSON.stringify({
          components: ["api", "service", "repository", "messaging"],
          configuration: ["circuit-breaker", "timeout", "retry", "metrics"],
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 12 * 86400000), // 12 days ago
        updatedAt: new Date(Date.now() - 3 * 86400000), // 3 days ago
        isActive: true
      },
      {
        name: "Data Pipeline",
        description: "An end-to-end data pipeline with ingestion, transformation, validation, and storage",
        category: "Data",
        content: JSON.stringify({
          stages: ["ingest", "clean", "transform", "validate", "load"],
          tools: ["Apache Spark", "Airflow", "Kafka"],
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 10 * 86400000), // 10 days ago
        updatedAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
        isActive: true
      },
      {
        name: "Database Service",
        description: "Template for database service with connection pooling, migrations, and schema management",
        category: "Data",
        content: JSON.stringify({
          features: ["connection-pool", "migrations", "schema-validation", "query-layer"],
          databases: ["PostgreSQL", "MySQL", "MongoDB"],
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 8 * 86400000), // 8 days ago
        updatedAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
        isActive: true
      },
      {
        name: "Machine Learning Model",
        description: "Template for deploying ML models with monitoring, versioning, and A/B testing",
        category: "AI/ML",
        content: JSON.stringify({
          components: ["model-service", "feature-store", "experiment-tracker", "monitoring"],
          ml_frameworks: ["TensorFlow", "PyTorch", "scikit-learn"],
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 7 * 86400000), // 7 days ago
        updatedAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
        isActive: true
      },
      {
        name: "Web Application",
        description: "Template for modern web applications with SSR, authentication, and state management",
        category: "Application",
        content: JSON.stringify({
          frontend: ["components", "state", "routing", "api-client"],
          backend: ["api", "auth", "database", "caching"],
        }),
        createdBy: 1,
        createdAt: new Date(Date.now() - 5 * 86400000), // 5 days ago
        updatedAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
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
  async getPluginUpdates(): Promise<PluginUpdate[]> {
    return Array.from(this.pluginUpdates.values());
  }
  
  async getPluginUpdatesByDomain(domain: string): Promise<PluginUpdate[]> {
    return Array.from(this.pluginUpdates.values()).filter(
      (update) => update.domain === domain
    );
  }
  
  async createPluginUpdate(update: Omit<PluginUpdate, 'id'>): Promise<PluginUpdate> {
    const id = this.pluginId++;
    const newUpdate: PluginUpdate = { ...update, id };
    this.pluginUpdates.set(id, newUpdate);
    return newUpdate;
  }
  
  async updatePluginStatus(id: number, status: string): Promise<PluginUpdate | undefined> {
    const update = this.pluginUpdates.get(id);
    if (!update) return undefined;
    
    const updatedPlugin: PluginUpdate = {
      ...update,
      status,
      updatedAt: new Date()
    };
    
    this.pluginUpdates.set(id, updatedPlugin);
    return updatedPlugin;
  }
  
  private seedPluginUpdates() {
    const today = new Date();
    const plugins = [
      // Build & Deploy domain
      {
        domain: "Build & Deploy",
        name: "CI Pipeline SDK",
        version: "2.3.4",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        status: "stable",
        description: "SDK for creating and managing CI pipelines",
        changeLog: "- Added support for parallel test execution\n- Improved caching mechanism\n- Fixed issue with artifact persistence",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
      },
      {
        domain: "Build & Deploy",
        name: "Deployment Controller",
        version: "1.8.0",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
        status: "stable",
        description: "Controls application deployments across environments",
        changeLog: "- Added canary deployment strategy\n- Enhanced rollback capabilities\n- Improved metrics collection during deployment",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10)
      },
      
      // Application Reliability domain
      {
        domain: "Application Reliability",
        name: "Service Mesh Connector",
        version: "3.1.2",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
        status: "stable",
        description: "Connects applications with service mesh technologies",
        changeLog: "- Added support for Istio 1.15\n- Enhanced traffic splitting capabilities\n- Improved latency metrics collection",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
      },
      {
        domain: "Application Reliability",
        name: "Fault Injection SDK",
        version: "0.9.5",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        status: "beta",
        description: "Tools for chaos engineering and fault injection",
        changeLog: "- Added network partition simulation\n- Enhanced latency injection capabilities\n- Beta support for memory leak simulation",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
      },
      
      // TestOps domain
      {
        domain: "TestOps",
        name: "Test Orchestrator",
        version: "2.0.0",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
        status: "stable",
        description: "End-to-end test orchestration framework",
        changeLog: "- Major version update with API changes\n- Added parallel test execution\n- Enhanced reporting capabilities\n- Support for test data management",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15)
      },
      {
        domain: "TestOps",
        name: "API Mocking Framework",
        version: "1.4.3",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8),
        status: "stable",
        description: "Mock API responses for testing",
        changeLog: "- Added support for GraphQL mocking\n- Enhanced request matching logic\n- Fixed timing issues with async responses",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8)
      },
      
      // Cloud Operations domain
      {
        domain: "Cloud Operations",
        name: "Infrastructure Analyzer",
        version: "3.2.1",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
        status: "stable",
        description: "Analyzes and optimizes cloud infrastructure",
        changeLog: "- Added support for AWS Lambda cost analysis\n- Enhanced resource utilization reports\n- Improved recommendation engine",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
      },
      {
        domain: "Cloud Operations",
        name: "Multi-Cloud Manager",
        version: "1.0.0",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        status: "beta",
        description: "Manage resources across multiple cloud providers",
        changeLog: "- Initial release with support for AWS, GCP, and Azure\n- Basic resource provisioning\n- Cross-cloud monitoring",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      },
      
      // FinOps domain
      {
        domain: "FinOps",
        name: "Cost Optimization Engine",
        version: "2.4.5",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12),
        status: "stable",
        description: "Analyzes and optimizes cloud spending",
        changeLog: "- Added anomaly detection for cost spikes\n- Enhanced resource right-sizing recommendations\n- Improved forecast accuracy",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12)
      },
      {
        domain: "FinOps",
        name: "Budget Manager",
        version: "1.6.2",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9),
        status: "stable",
        description: "Manage and enforce cloud budgets",
        changeLog: "- Added support for project-based budgets\n- Enhanced alerting mechanisms\n- Improved forecast visualization",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9)
      },
      
      // Security domain
      {
        domain: "Security",
        name: "Vulnerability Scanner",
        version: "4.1.0",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
        status: "stable",
        description: "Scans code and infrastructure for vulnerabilities",
        changeLog: "- Added support for container image scanning\n- Enhanced reporting of OWASP Top 10 vulnerabilities\n- Improved integration with CI/CD pipelines",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
      },
      {
        domain: "Security",
        name: "IAM Policy Manager",
        version: "2.2.3",
        releaseDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
        status: "stable",
        description: "Manages identity and access policies",
        changeLog: "- Added policy drift detection\n- Enhanced multi-cloud IAM support\n- Improved integration with external identity providers",
        updatedBy: 1,
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)
      }
    ];
    
    plugins.forEach(plugin => {
      const pluginUpdate: PluginUpdate = {
        id: this.pluginId++,
        ...plugin
      };
      this.pluginUpdates.set(pluginUpdate.id, pluginUpdate);
    });
  }
}

export const storage = new MemStorage();
