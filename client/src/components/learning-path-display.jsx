import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Pencil, Check, Play, Lock, Route, Plus } from "lucide-react";

export function LearningPathDisplay() {
  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ["/api/learning-paths"],
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/progress"],
  });

  const getProgressForPath = (pathId) => {
    if (!userProgress) return 0;
    const pathProgress = userProgress.filter((p) => p.learningPathId === pathId);
    if (pathProgress.length === 0) return 0;
    return Math.round(pathProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / pathProgress.length);
  };

  // Sample modules for demonstration (would come from active learning path)
  const currentPathModules = [
    {
      id: "module1",
      title: "HTML & CSS Fundamentals",
      description: "Master the building blocks of web development", 
      status: "completed",
      progress: 100
    },
    {
      id: "module2", 
      title: "JavaScript Advanced",
      description: "Deep dive into ES6+, async programming, and DOM manipulation",
      status: "in_progress",
      progress: 67
    },
    {
      id: "module3",
      title: "React.js Framework", 
      description: "Build dynamic user interfaces with React",
      status: "locked",
      progress: 0
    }
  ];

  if (isLoading) {
    return (
      <Card data-testid="learning-path-display">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4 rounded-lg border">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-2 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activePath = learningPaths?.[0]; // Get first active path for demo

  return (
    <Card data-testid="learning-path-display">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Current Learning Path</CardTitle>
            <CardDescription>
              {activePath?.title || "No active learning path"}
            </CardDescription>
          </div>
          <Link href="/learning-path">
            <Button data-testid="button-edit-path">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Path
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {activePath ? (
          <div className="space-y-4">
            {currentPathModules.map((module) => (
              <div
                key={module.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors cursor-pointer hover:border-primary/30 ${
                  module.status === 'in_progress' ? 'border-primary/50 bg-primary/5' :
                  module.status === 'locked' ? 'opacity-60' : 'hover:shadow-sm'
                }`}
                data-testid={`module-${module.id}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  module.status === 'completed' ? 'bg-secondary' :
                  module.status === 'in_progress' ? 'bg-primary animate-pulse' : 'bg-muted'
                }`}>
                  {module.status === 'completed' ? <Check className="w-5 h-5 text-secondary-foreground" /> :
                   module.status === 'in_progress' ? <Play className="w-5 h-5 text-primary-foreground" /> :
                   <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground">{module.title}</h4>
                    <Badge
                      variant={module.status === 'completed' ? 'secondary' :
                               module.status === 'in_progress' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {module.status === 'completed' ? 'Completed' :
                       module.status === 'in_progress' ? 'In Progress' : 'Locked'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                  <Progress value={module.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Route className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Active Learning Path</h3>
            <p className="text-muted-foreground mb-4">
              Create a learning path to start your educational journey.
            </p>
            <Link href="/learning-path">
              <Button data-testid="button-create-first-path">
                <Plus className="w-4 h-4 mr-2" />
                Create Learning Path
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}