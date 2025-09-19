import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage {
  constructor() {
    this.users = new Map();
    this.learningPaths = new Map();
    this.userProgress = new Map();
    this.achievements = new Map();
    this.forumPosts = new Map();
    this.forumReplies = new Map();
    this.opportunities = new Map();
    this.resources = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    this.seedData();
  }

  seedData() {
    // Seed some sample opportunities
    const sampleOpportunities = [
      {
        id: randomUUID(),
        title: "Frontend Developer Intern",
        description: "Join our team as a frontend developer intern. Work on real projects using React, TypeScript, and modern web technologies.",
        type: "internship",
        company: "TechCorp",
        location: "Remote",
        isRemote: true,
        requirements: ["React", "JavaScript", "CSS"],
        applicationUrl: "https://techcorp.com/careers/frontend-intern",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Code for Good 2024",
        description: "48-hour hackathon focused on creating technology solutions for social good. $10k in prizes!",
        type: "hackathon",
        company: "Tech Academy",
        location: "San Francisco",
        isRemote: false,
        requirements: ["Full Stack", "Social Impact"],
        applicationUrl: "https://codeforgood2024.com/register",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Advanced React Patterns Workshop",
        description: "Deep dive into advanced React patterns including Context API, custom hooks, and performance optimization.",
        type: "workshop",
        company: "Tech Academy",
        location: "Online",
        isRemote: true,
        requirements: ["React", "Advanced"],
        applicationUrl: "https://techacademy.com/workshops/react-advanced",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      }
    ];

    sampleOpportunities.forEach(opp => this.opportunities.set(opp.id, opp));

    // Seed some sample resources
    const sampleResources = [
      {
        id: randomUUID(),
        title: "JavaScript Async/Await Complete Guide",
        description: "Comprehensive tutorial covering promises, async/await, and error handling in JavaScript.",
        type: "video",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=vn3tm0quoqE",
        thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        duration: "45 min",
        rating: 5,
        difficulty: "intermediate",
        tags: ["JavaScript", "Async", "Promises"],
        isFree: true,
        price: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "JavaScript Promises Explained",
        description: "Interactive tutorial covering JavaScript promises with practical examples and exercises.",
        type: "tutorial",
        platform: "geeksforgeeks",
        url: "https://www.geeksforgeeks.org/javascript-promises/",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        duration: "30 min read",
        rating: 4,
        difficulty: "beginner",
        tags: ["JavaScript", "Promises"],
        isFree: true,
        price: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Programming Foundations with JavaScript",
        description: "Comprehensive course covering JavaScript fundamentals from Duke University.",
        type: "course",
        platform: "coursera",
        url: "https://www.coursera.org/learn/programming-foundations-with-javascript",
        thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        duration: "4 weeks",
        rating: 4,
        difficulty: "beginner",
        tags: ["JavaScript", "Programming", "Certificate"],
        isFree: false,
        price: "$49/month",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "The Complete JavaScript Course 2024",
        description: "Master JavaScript with the most complete course! Projects, challenges, final exam, ES2023+",
        type: "course",
        platform: "udemy",
        url: "https://www.udemy.com/course/the-complete-javascript-course/",
        thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        duration: "69 hours",
        rating: 5,
        difficulty: "beginner",
        tags: ["JavaScript", "Complete Course"],
        isFree: false,
        price: "$89.99",
        createdAt: new Date(),
      }
    ];

    sampleResources.forEach(resource => this.resources.set(resource.id, resource));
  }

  // User methods
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser) {
    const id = randomUUID();
    const user = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      skills: insertUser.skills || [],
      profileImage: insertUser.profileImage || null,
      bio: insertUser.bio || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Learning Path methods
  async getLearningPath(id) {
    return this.learningPaths.get(id);
  }

  async getLearningPathsByUser(userId) {
    return Array.from(this.learningPaths.values()).filter(
      (path) => path.userId === userId,
    );
  }

  async createLearningPath(insertPath) {
    const id = randomUUID();
    const path = { 
      ...insertPath, 
      id, 
      createdAt: new Date(),
      modules: insertPath.modules || [],
      estimatedHours: insertPath.estimatedHours || 0,
      isActive: insertPath.isActive ?? true,
    };
    this.learningPaths.set(id, path);
    return path;
  }

  async updateLearningPath(id, updates) {
    const path = this.learningPaths.get(id);
    if (!path) return undefined;
    
    const updatedPath = { ...path, ...updates };
    this.learningPaths.set(id, updatedPath);
    return updatedPath;
  }

  async deleteLearningPath(id) {
    return this.learningPaths.delete(id);
  }

  // Progress methods
  async getUserProgress(userId, learningPathId) {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId && 
      (!learningPathId || progress.learningPathId === learningPathId)
    );
  }

  async createProgress(insertProgress) {
    const id = randomUUID();
    const progress = { 
      ...insertProgress, 
      id, 
      lastAccessed: new Date(),
      updatedAt: new Date(),
      progressPercentage: insertProgress.progressPercentage || 0,
      hoursSpent: insertProgress.hoursSpent || 0,
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateProgress(id, updates) {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates, updatedAt: new Date() };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getUserStats(userId) {
    const userProgresses = await this.getUserProgress(userId);
    const userAchievements = await this.getUserAchievements(userId);
    
    const totalHours = userProgresses.reduce((sum, p) => sum + (p.hoursSpent || 0), 0);
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
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId,
    );
  }

  async createAchievement(insertAchievement) {
    const id = randomUUID();
    const achievement = { 
      ...insertAchievement, 
      id, 
      unlockedAt: new Date(),
      points: insertAchievement.points || 0,
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Forum methods
  async getForumPosts(limit = 10, category) {
    const posts = Array.from(this.forumPosts.values());
    const filtered = category ? posts.filter(p => p.category === category) : posts;
    return filtered.slice(0, limit).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getForumPost(id) {
    return this.forumPosts.get(id);
  }

  async createForumPost(insertPost) {
    const id = randomUUID();
    const post = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      tags: insertPost.tags || [],
      likes: 0,
      replies: 0,
      isResolved: false,
    };
    this.forumPosts.set(id, post);
    return post;
  }

  async getForumReplies(postId) {
    return Array.from(this.forumReplies.values()).filter(
      (reply) => reply.postId === postId,
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createForumReply(insertReply) {
    const id = randomUUID();
    const reply = { 
      ...insertReply, 
      id, 
      createdAt: new Date(),
      likes: 0,
      isAccepted: false,
    };
    this.forumReplies.set(id, reply);
    
    // Update post reply count
    const post = this.forumPosts.get(insertReply.postId);
    if (post) {
      post.replies = (post.replies || 0) + 1;
      this.forumPosts.set(insertReply.postId, post);
    }
    
    return reply;
  }

  // Opportunity methods
  async getOpportunities(limit = 10, type) {
    const opportunities = Array.from(this.opportunities.values());
    const filtered = type ? opportunities.filter(o => o.type === type) : opportunities;
    return filtered.slice(0, limit).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOpportunity(id) {
    return this.opportunities.get(id);
  }

  async createOpportunity(insertOpportunity) {
    const id = randomUUID();
    const opportunity = { 
      ...insertOpportunity, 
      id, 
      createdAt: new Date(),
      requirements: insertOpportunity.requirements || [],
      isRemote: insertOpportunity.isRemote ?? false,
    };
    this.opportunities.set(id, opportunity);
    return opportunity;
  }

  // Resource methods
  async getResources(limit = 10, category) {
    const resources = Array.from(this.resources.values());
    const filtered = category ? resources.filter(r => r.type === category) : resources;
    return filtered.slice(0, limit).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecommendedResources(userId) {
    // Simple recommendation: return JavaScript-related resources for demo
    return Array.from(this.resources.values())
      .filter(r => r.tags?.includes("JavaScript"))
      .slice(0, 4);
  }

  async createResource(insertResource) {
    const id = randomUUID();
    const resource = { 
      ...insertResource, 
      id, 
      createdAt: new Date(),
      tags: insertResource.tags || [],
      rating: insertResource.rating || 0,
      isFree: insertResource.isFree ?? true,
    };
    this.resources.set(id, resource);
    return resource;
  }
}

export const storage = new MemStorage();