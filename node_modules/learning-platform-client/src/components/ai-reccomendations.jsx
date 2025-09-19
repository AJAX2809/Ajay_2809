import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, MessageSquare } from "lucide-react";

export function AiRecommendations() {
  const { toast } = useToast();
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const chatbotMutation = useMutation({
    mutationFn: async (message) => {
      const res = await apiRequest("POST", "/api/ai/chatbot", { 
        message,
        context: "recommendation_query"
      });
      return res.json();
    },
    onSuccess: (response) => {
      toast({
        title: "AI Assistant",
        description: response.message,
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  });

  const recommendations = [
    {
      id: 1,
      title: "Strengthen JavaScript Skills",
      description: "Based on your recent quiz results, focus on async/await concepts.",
      priority: "High",
      priorityColor: "bg-primary/5 border-primary/20 text-primary",
      buttonColor: "text-primary hover:underline"
    },
    {
      id: 2,
      title: "React Advanced Patterns", 
      description: "Ready for advanced concepts like Context API and custom hooks.",
      priority: "Medium",
      priorityColor: "bg-secondary/5 border-secondary/20 text-secondary",
      buttonColor: "text-secondary hover:underline"
    },
    {
      id: 3,
      title: "Data Structures Practice",
      description: "Strengthen your algorithm problem-solving skills.",
      priority: "Medium", 
      priorityColor: "bg-accent/5 border-accent/20 text-accent",
      buttonColor: "text-accent hover:underline"
    }
  ];

  const handleViewRecommendation = (rec) => {
    setSelectedRecommendation(rec);
    chatbotMutation.mutate(`Tell me more about ${rec.title} and provide learning resources.`);
  };

  return (
    <Card className="h-full" data-testid="ai-recommendations">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="w-6 h-6 text-primary" />
          <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
        </div>
        <CardDescription>Personalized suggestions based on your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className={`p-4 rounded-lg border ${rec.priorityColor}`}>
            <h4 className="font-medium text-sm text-foreground mb-2">
              {rec.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {rec.description}
            </p>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs font-medium">
                Priority: {rec.priority}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-xs ${rec.buttonColor}`}
                onClick={() => handleViewRecommendation(rec)}
                disabled={chatbotMutation.isPending}
                data-testid={`button-view-recommendation-${rec.id}`}
              >
                {chatbotMutation.isPending ? "Loading..." : "View Path"}
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={() => chatbotMutation.mutate("What should I focus on learning next?")}
            disabled={chatbotMutation.isPending}
            data-testid="button-ask-ai"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {chatbotMutation.isPending ? "Asking AI..." : "Ask AI for Advice"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}