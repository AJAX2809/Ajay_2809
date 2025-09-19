import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LearningPathPage() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [newPathData, setNewPathData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    modules: []
  });
  const [aiPathData, setAiPathData] = useState({
    skills: "",
    goals: "",
    timeCommitment: 20
  });

  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ["/api/learning-paths"],
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/progress"],
  });

  const createPathMutation = useMutation({
    mutationFn: async (pathData) => {
      const res = await apiRequest("POST", "/api/learning-paths", pathData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      setIsCreateDialogOpen(false);
      setNewPathData({ title: "", description: "", difficulty: "beginner", modules: [] });
      toast({
        title: "Learning path created",
        description: "Your new learning path has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create learning path. Please try again.",
        variant: "destructive",
      });
    }
  });

  const generateAiPathMutation = useMutation({
    mutationFn: async (aiData) => {
      const res = await apiRequest("POST", "/api/ai/generate-path", {
        skills: aiData.skills.split(",").map((s) => s.trim()),
        goals: aiData.goals,
        timeCommitment: aiData.timeCommitment
      });
      return res.json();
    },
    onSuccess: (aiPath) => {
      setNewPathData({
        title: aiPath.title,
        description: aiPath.description,
        difficulty: aiPath.difficulty,
        modules: aiPath.modules
      });
      setIsAiDialogOpen(false);
      setIsCreateDialogOpen(true);
      toast({
        title: "AI Path Generated",
        description: "Your personalized learning path has been generated. Review and create it!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate AI learning path. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreatePath = (e) => {
    e.preventDefault();
    createPathMutation.mutate(newPathData);
  };

  const handleGenerateAiPath = (e) => {
    e.preventDefault();
    generateAiPathMutation.mutate(aiPathData);
  };

  const getProgressForPath = (pathId) => {
    if (!userProgress) return 0;
    const pathProgress = userProgress.filter((p) => p.learningPathId === pathId);
    if (pathProgress.length === 0) return 0;
    return Math.round(pathProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / pathProgress.length);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav title="Learning Path" subtitle="Manage and create your learning journeys" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your learning paths...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" data-testid="learning-path-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          title="Learning Path"
          subtitle="Manage and create your learning journeys"
        />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Your Learning Paths</h2>
            <div className="flex space-x-3">
              <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2" data-testid="button-ai-generate">
                    <i className="fas fa-robot"></i>
                    <span>AI Generate Path</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate AI Learning Path</DialogTitle>
                    <DialogDescription>
                      Tell us about your goals and we'll create a personalized learning path for you.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleGenerateAiPath}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="skills">Skills to Learn (comma separated)</Label>
                        <Input
                          id="skills"
                          placeholder="e.g. React, Node.js, MongoDB"
                          value={aiPathData.skills}
                          onChange={(e) => setAiPathData({ ...aiPathData, skills: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="goals">Learning Goals</Label>
                        <Textarea
                          id="goals"
                          placeholder="What do you want to achieve with this learning path?"
                          value={aiPathData.goals}
                          onChange={(e) => setAiPathData({ ...aiPathData, goals: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="timeCommitment">Time Commitment (hours)</Label>
                        <Input
                          id="timeCommitment"
                          type="number"
                          min="1"
                          max="200"
                          value={aiPathData.timeCommitment}
                          onChange={(e) => setAiPathData({ ...aiPathData, timeCommitment: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="submit" disabled={generateAiPathMutation.isPending}>
                        {generateAiPathMutation.isPending ? "Generating..." : "Generate AI Path"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2" data-testid="button-create-path">
                    <i className="fas fa-plus"></i>
                    <span>Create Path</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Learning Path</DialogTitle>
                    <DialogDescription>
                      Create a custom learning path to organize your studies.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePath}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g. Full-Stack Web Development"
                          value={newPathData.title}
                          onChange={(e) => setNewPathData({ ...newPathData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what this learning path covers..."
                          value={newPathData.description}
                          onChange={(e) => setNewPathData({ ...newPathData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select onValueChange={(value) => setNewPathData({ ...newPathData, difficulty: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="submit" disabled={createPathMutation.isPending}>
                        {createPathMutation.isPending ? "Creating..." : "Create Path"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Learning Paths Grid */}
          {learningPaths && learningPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => {
                const progress = getProgressForPath(path.id);
                return (
                  <Card key={path.id} className="hover:shadow-md transition-shadow" data-testid={`card-path-${path.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant={path.difficulty === 'beginner' ? 'secondary' : 
                                     path.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                          {path.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {path.estimatedHours || 0}h
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <i className="fas fa-list-ul mr-2"></i>
                          <span>{path.modules?.length || 0} modules</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" data-testid={`button-continue-${path.id}`}>
                        {progress === 0 ? "Start Learning" : progress === 100 ? "Review" : "Continue"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-route text-4xl text-muted-foreground"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Learning Paths Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first learning path or let AI generate one for you based on your goals.
              </p>
              <div className="flex justify-center space-x-3">
                <Button onClick={() => setIsAiDialogOpen(true)} data-testid="button-ai-generate-empty">
                  <i className="fas fa-robot mr-2"></i>
                  AI Generate Path
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                  <i className="fas fa-plus mr-2"></i>
                  Create Manually
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}