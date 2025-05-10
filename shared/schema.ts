import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  firstName: text("first_name"),
  lastName: text("last_name"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const developerMetrics = pgTable("developer_metrics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  satisfactionScore: integer("satisfaction_score").notNull(),
  activeUsers: integer("active_users").notNull(),
  taskCompletionRate: integer("task_completion_rate").notNull(),
  responseTime: integer("response_time").notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
});

export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  details: text("details"),
});

export const goldenPathTemplate = pgTable("golden_path_template", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const pluginUpdate = pgTable("plugin_update", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  name: text("name").notNull(),
  version: text("version").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  changeLog: text("change_log").notNull(),
  updatedBy: integer("updated_by").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type DeveloperMetric = typeof developerMetrics.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type ActivityLog = typeof activityLog.$inferSelect;
export type GoldenPathTemplate = typeof goldenPathTemplate.$inferSelect;
export type PluginUpdate = typeof pluginUpdate.$inferSelect;
