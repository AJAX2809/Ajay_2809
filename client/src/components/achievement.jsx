import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Achievements() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["/api/achievements"],
  });

  // Sample recent achievements for demo
  const recentAchievements = [
    {
      id: 1,
      title: "JavaScript Expert",
      description: "Completed 10 JS challenges", 
      badgeIcon: "fas fa-medal",
      points: 50,
      bgColor: "bg-accent/5",
      iconColor: "text-accent"
    },
    {
      id: 2,
      title: "Week Streak", 
      description: "7 days learning streak",
      badgeIcon: "fas fa-fire",
      points: 30,
      bgColor: "bg-secondary/5",
      iconColor: "text-secondary"
    },
    {
      id: 3,
      title: "Quick Learner",
      description: "Finished course ahead of time",
      badgeIcon: "fas fa-lightbulb", 
      points: 25,
      bgColor: "bg-primary/5",
      iconColor: "text-primary"
    }
  ];

  // Sample leaderboard data
  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 3245 },
    { rank: 2, name: "Marcus Johnson", points: 2981 },
    { rank: 23, name: "You", points: 2847, isCurrentUser: true }
  ];

  if (isLoading) {
    return (
      <Card data-testid="achievements">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-40"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" data-testid="achievements">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Achievements</CardTitle>
            <CardDescription>Your latest accomplishments</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:underline" data-testid="button-view-all-achievements">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className={`achievement-glow flex items-center space-x-3 p-3 ${achievement.bgColor} rounded-lg`}>
              <div className={`w-10 h-10 ${achievement.bgColor.replace('/5', '')} rounded-full flex items-center justify-center`}>
                <i className={`${achievement.badgeIcon} ${achievement.iconColor} text-sm`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              <Badge variant="outline" className="text-xs font-bold">
                +{achievement.points} XP
              </Badge>
            </div>
          ))}
        </div>
        
        {/* Leaderboard Preview */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium text-sm text-foreground mb-3">Class Leaderboard</h4>
          <div className="space-y-2">
            {leaderboard.map((student) => (
              <div 
                key={student.rank}
                className={`flex items-center justify-between text-xs ${
                  student.isCurrentUser ? 'bg-primary/10 p-2 rounded' : ''
                }`}
                data-testid={`leaderboard-${student.rank}`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    student.rank === 1 ? 'bg-accent text-accent-foreground' : 
                    student.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {student.rank}
                  </span>
                  <span className={`${student.isCurrentUser ? 'font-medium text-foreground' : 'text-foreground'}`}>
                    {student.name}
                  </span>
                </div>
                <span className={`${student.isCurrentUser ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {student.points.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}