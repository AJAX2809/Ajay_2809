import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("student"), // student, instructor
  profileImage: text("profile_image"),
  bio: text("bio"),
  skills: jsonb("skills").default([]), // Array of skill objects
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  modules: jsonb("modules").default([]), // Array of module objects
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  estimatedHours: integer("estimated_hours").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  learningPathId: varchar("learning_path_id").references(() => learningPaths.id),
  moduleId: text("module_id").notNull(),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  progressPercentage: integer("progress_percentage").default(0),
  hoursSpent: integer("hours_spent").default(0),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  badgeIcon: text("badge_icon").notNull(),
  points: integer("points").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").default([]),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  postId: varchar("post_id").references(() => forumPosts.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // internship, hackathon, workshop, job
  company: text("company"),
  location: text("location"),
  isRemote: boolean("is_remote").default(false),
  requirements: jsonb("requirements").default([]),
  applicationUrl: text("application_url"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // video, article, course, tutorial
  platform: text("platform").notNull(), // youtube, coursera, udemy, geeksforgeeks
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  rating: integer("rating").default(0),
  difficulty: text("difficulty").notNull().default("beginner"),
  tags: jsonb("tags").default([]),
  isFree: boolean("is_free").default(true),
  price: text("price"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  likes: true,
  replies: true,
  isResolved: true,
  createdAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  likes: true,
  isAccepted: true,
  createdAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});