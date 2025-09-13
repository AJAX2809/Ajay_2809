import { apiRequest } from "@/lib/queryClient";

export class AIService {
  static async generateLearningPath(request) {
    const response = await apiRequest("POST", "/api/ai/generate-path", request);
    return response.json();
  }

  static async analyzeSkills(request) {
    const response = await apiRequest("POST", "/api/ai/analyze-skills", request);
    return response.json();
  }

  static async chatbot(request) {
    const response = await apiRequest("POST", "/api/ai/chatbot", request);
    return response.json();
  }

  // Helper method to generate personalized recommendations
  static async getPersonalizedRecommendations(userId) {
    try {
      const response = await apiRequest("GET", `/api/ai/recommendations?userId=${userId}`);
      return response.json();
    } catch (error) {
      // Return mock recommendations if AI service is unavailable
      return [
        {
          id: 1,
          title: "Strengthen JavaScript Skills",
          description: "Based on your recent quiz results, focus on async/await concepts.",
          priority: "High",
          type: "skill_improvement"
        },
        {
          id: 2,
          title: "React Advanced Patterns",
          description: "Ready for advanced concepts like Context API and custom hooks.",
          priority: "Medium", 
          type: "next_level"
        },
        {
          id: 3,
          title: "Data Structures Practice",
          description: "Strengthen your algorithm problem-solving skills.",
          priority: "Medium",
          type: "foundation"
        }
      ];
    }
  }

  // Helper method to get skill gap analysis
  static async getSkillGapAnalysis(skills) {
    try {
      const response = await this.analyzeSkills({
        currentSkills: skills
      });
      return response;
    } catch (error) {
      // Return mock analysis if AI service is unavailable
      return {
        currentSkills: skills,
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
    }
  }

  // Helper method to get contextual learning suggestions
  static async getContextualSuggestions(context, userProgress) {
    try {
      const response = await this.chatbot({
        message: `Give me learning suggestions for ${context}`,
        context: JSON.stringify(userProgress)
      });
      return response.suggestions || [];
    } catch (error) {
      // Return default suggestions if AI service is unavailable
      return [
        "Review fundamental concepts",
        "Practice with coding exercises", 
        "Join study group discussions",
        "Take a practice quiz"
      ];
    }
  }
}

export default AIService;