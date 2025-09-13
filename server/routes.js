import { createServer } from "http";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
import { 
  insertLearningPathSchema, 
  insertUserProgressSchema,
  insertForumPostSchema,
  insertForumReplySchema,
  insertOpportunitySchema,
  insertResourceSchema 
} from "../shared/schema.js";

export function registerRoutes(app) {
  // Setup authentication routes
  setupAuth(app);

  // Learning Path API routes
  app.get("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const paths = await storage.getLearningPathsByUser(req.user.id);
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });

  app.post("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertLearningPathSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const path = await storage.createLearningPath(validatedData);
      res.status(201).json(path);
    } catch (error) {
      res.status(400).json({ message: "Invalid learning path data" });
    }
  });

  app.put("/api/learning-paths/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const path = await storage.updateLearningPath(req.params.id, req.body);
      if (!path) return res.status(404).json({ message: "Learning path not found" });
      res.json(path);
    } catch (error) {
      res.status(400).json({ message: "Failed to update learning path" });
    }
  });

  // User Progress API routes
  app.get("/api/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const progress = await storage.getUserProgress(req.user.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertUserProgressSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const progress = await storage.createProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // User Stats API
  app.get("/api/user/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const stats = await storage.getUserStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Achievements API
  app.get("/api/achievements", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const achievements = await storage.getUserAchievements(req.user.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Forum API routes
  app.get("/api/forum/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { limit, category } = req.query;
      const posts = await storage.getForumPosts(
        limit ? parseInt(limit) : undefined,
        category
      );
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum post data" });
    }
  });

  app.get("/api/forum/posts/:id/replies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const replies = await storage.getForumReplies(req.params.id);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  app.post("/api/forum/posts/:id/replies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertForumReplySchema.parse({
        ...req.body,
        postId: req.params.id,
        userId: req.user.id,
      });
      const reply = await storage.createForumReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      res.status(400).json({ message: "Invalid reply data" });
    }
  });

  // Opportunities API routes
  app.get("/api/opportunities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { limit, type } = req.query;
      const opportunities = await storage.getOpportunities(
        limit ? parseInt(limit) : undefined,
        type
      );
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  // Resources API routes
  app.get("/api/resources", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { limit, category } = req.query;
      const resources = await storage.getResources(
        limit ? parseInt(limit) : undefined,
        category
      );
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/recommended", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const resources = await storage.getRecommendedResources(req.user.id);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommended resources" });
    }
  });

  // AI Service API routes (Mock implementations for demo)
  app.post("/api/ai/generate-path", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { skills, goals, timeCommitment } = req.body;
      
      // Mock AI response - in production, this would call actual AI service
      const mockPath = {
        title: `Personalized ${skills?.join(' & ')} Learning Path`,
        description: `A customized learning path to help you master ${skills?.join(' and ')} based on your goals.`,
        modules: [
          {
            id: "module1",
            title: "Fundamentals",
            description: "Master the basics",
            estimatedHours: timeCommitment * 0.3,
            status: "not_started"
          },
          {
            id: "module2", 
            title: "Intermediate Concepts",
            description: "Build on your foundation",
            estimatedHours: timeCommitment * 0.4,
            status: "locked"
          },
          {
            id: "module3",
            title: "Advanced Topics",
            description: "Become proficient",
            estimatedHours: timeCommitment * 0.3,
            status: "locked"
          }
        ],
        difficulty: "beginner",
        estimatedHours: timeCommitment,
      };
      
      res.json(mockPath);
    } catch (error) {
      res.status(500).json({ message: "AI service temporarily unavailable" });
    }
  });

  app.post("/api/ai/analyze-skills", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { resume, currentSkills } = req.body;
      
      // Mock skill gap analysis
      const mockAnalysis = {
        currentSkills: currentSkills || ["HTML", "CSS", "Basic JavaScript"],
        missingSkills: ["React", "Node.js", "Database Management", "API Development"],
        recommendations: [
          {
            skill: "React",
            priority: "High",
            reason: "Essential for modern frontend development",
            estimatedLearningTime: "4-6 weeks"
          },
          {
            skill: "Node.js",
            priority: "Medium", 
            reason: "Important for full-stack development",
            estimatedLearningTime: "3-4 weeks"
          }
        ],
        overallReadiness: 65
      };
      
      res.json(mockAnalysis);
    } catch (error) {
      res.status(500).json({ message: "AI analysis service temporarily unavailable" });
    }
  });

  app.post("/api/ai/chatbot", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { message, context } = req.body;
      
      // Mock chatbot response
      const mockResponses = [
        "That's a great question! Based on your current learning path, I'd recommend focusing on practical projects to reinforce your understanding.",
        "I can help you with that! Let me suggest some resources that match your learning style and current progress.",
        "Excellent progress! You're on track to complete this module. Have you considered applying these concepts in a personal project?",
        "I see you're working on JavaScript. Would you like me to recommend some coding challenges to practice these concepts?"
      ];
      
      const response = {
        message: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        suggestions: [
          "View recommended resources",
          "Take a practice quiz",
          "Join study group discussion"
        ],
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Chatbot service temporarily unavailable" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}