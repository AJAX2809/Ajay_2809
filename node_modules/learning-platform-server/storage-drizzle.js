import { eq, and, desc, sum, sql } from "drizzle-orm";
import { db } from "./drizzle.js";
import {
  users,
  learningPaths,
  userProgress,
  achievements,
  forumPosts,
  forumReplies,
  opportunities,
  resources,
} from "../shared/schema.js";
import { randomUUID } from "crypto";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";

const PgSessionStore = ConnectPgSimple(session);

export class DrizzleStorage {
  constructor() {
    this.sessionStore = new PgSessionStore({
      pool: db.query.pool,
      tableName: "user_sessions",
    });
  }

  async getUser(id) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user;
  }

  async getUserByUsername(username) {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user;
  }

  async getUserByEmail(email) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  }

  async createUser(insertUser) {
    const user = await db
      .insert(users)
      .values({ ...insertUser, id: randomUUID() })
      .returning();
    return user[0];
  }

  async updateUser(id, updates) {
    const user = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user[0];
  }

  // Learning Path methods
  async getLearningPath(id) {
    return db.query.learningPaths.findFirst({
      where: eq(learningPaths.id, id),
    });
  }

  async getLearningPathsByUser(userId) {
    return db.query.learningPaths.findMany({
      where: eq(learningPaths.userId, userId),
      orderBy: [desc(learningPaths.createdAt)],
    });
  }

  async createLearningPath(insertPath) {
    const path = await db
      .insert(learningPaths)
      .values({ ...insertPath, id: randomUUID() })
      .returning();
    return path[0];
  }

  async updateLearningPath(id, updates) {
    const path = await db
      .update(learningPaths)
      .set(updates)
      .where(eq(learningPaths.id, id))
      .returning();
    return path[0];
  }

  async deleteLearningPath(id) {
    await db.delete(learningPaths).where(eq(learningPaths.id, id));
    return true;
  }

  // Progress methods
  async getUserProgress(userId, learningPathId) {
    const where = learningPathId
      ? and(
          eq(userProgress.userId, userId),
          eq(userProgress.learningPathId, learningPathId),
        )
      : eq(userProgress.userId, userId);
    return db.query.userProgress.findMany({ where });
  }

  async createProgress(insertProgress) {
    const progress = await db
      .insert(userProgress)
      .values({ ...insertProgress, id: randomUUID() })
      .returning();
    return progress[0];
  }

  async updateProgress(id, updates) {
    const progress = await db
      .update(userProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProgress.id, id))
      .returning();
    return progress[0];
  }

  async getUserStats(userId) {
    const userProgresses = await this.getUserProgress(userId);
    const userAchievements = await this.getUserAchievements(userId);

    const totalHoursResult = await db
      .select({ total: sum(userProgress.hoursSpent) })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    const totalHours = totalHoursResult[0].total || 0;

    const completedModules = userProgresses.filter(p => p.status === 'completed').length;
    const totalPoints = userAchievements.reduce((sum, a) => sum + (a.points || 0), 0);

    return {
      learningHours: totalHours,
      skillsMastered: completedModules,
      courseProgress: userProgresses.length > 0 ?
        Math.round(userProgresses.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / userProgresses.length) : 0,
      points: totalPoints,
    };
  }

  // Achievement methods
  async getUserAchievements(userId) {
    return db.query.achievements.findMany({
      where: eq(achievements.userId, userId),
      orderBy: [desc(achievements.unlockedAt)],
    });
  }

  async createAchievement(insertAchievement) {
    const achievement = await db
      .insert(achievements)
      .values({ ...insertAchievement, id: randomUUID() })
      .returning();
    return achievement[0];
  }

  // Forum methods
  async getForumPosts(limit = 10, category) {
    const where = category ? eq(forumPosts.category, category) : undefined;
    return db.query.forumPosts.findMany({
      where,
      limit,
      orderBy: [desc(forumPosts.createdAt)],
    });
  }

  async getForumPost(id) {
    return db.query.forumPosts.findFirst({
      where: eq(forumPosts.id, id),
    });
  }

  async createForumPost(insertPost) {
    const post = await db
      .insert(forumPosts)
      .values({ ...insertPost, id: randomUUID() })
      .returning();
    return post[0];
  }

  async getForumReplies(postId) {
    return db.query.forumReplies.findMany({
      where: eq(forumReplies.postId, postId),
      orderBy: [desc(forumReplies.createdAt)],
    });
  }

  async createForumReply(insertReply) {
    const reply = await db
      .insert(forumReplies)
      .values({ ...insertReply, id: randomUUID() })
      .returning();

    await db
      .update(forumPosts)
      .set({ replies: sql`${forumPosts.replies} + 1` })
      .where(eq(forumPosts.id, insertReply.postId));

    return reply[0];
  }

  // Opportunity methods
  async getOpportunities(limit = 10, type) {
    const where = type ? eq(opportunities.type, type) : undefined;
    return db.query.opportunities.findMany({
      where,
      limit,
      orderBy: [desc(opportunities.createdAt)],
    });
  }

  async getOpportunity(id) {
    return db.query.opportunities.findFirst({
      where: eq(opportunities.id, id),
    });
  }

  async createOpportunity(insertOpportunity) {
    const opportunity = await db
      .insert(opportunities)
      .values({ ...insertOpportunity, id: randomUUID() })
      .returning();
    return opportunity[0];
  }

  // Resource methods
  async getResources(limit = 10, category) {
    const where = category ? eq(resources.type, category) : undefined;
    return db.query.resources.findMany({
      where,
      limit,
      orderBy: [desc(resources.createdAt)],
    });
  }

  async getRecommendedResources(userId) {
    // This is a simple recommendation logic.
    // In a real application, this would be more sophisticated.
    const user = await this.getUser(userId);
    if (!user || !user.skills || user.skills.length === 0) {
      return this.getResources(4, "video");
    }
    const userSkills = user.skills.map((s) => s.toLowerCase());
    const allResources = await db.query.resources.findMany();
    return allResources
      .filter((r) =>
        r.tags?.some((tag) => userSkills.includes(tag.toLowerCase())),
      )
      .slice(0, 4);
  }

  async createResource(insertResource) {
    const resource = await db
      .insert(resources)
      .values({ ...insertResource, id: randomUUID() })
      .returning();
    return resource[0];
  }
}
