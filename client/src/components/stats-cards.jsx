import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const statsData = [
    {
      title: "Learning Hours",
      value: stats?.learningHours || 0,
      suffix: "",
      trend: "+12.5% from last week",
      icon: "fas fa-clock",
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      title: "Skills Mastered", 
      value: stats?.skillsMastered || 0,
      suffix: "",
      trend: `+${Math.floor((stats?.skillsMastered || 0) * 0.2)} this month`,
      icon: "fas fa-trophy",
      color: "secondary",
      bgColor: "bg-secondary/10", 
      textColor: "text-secondary"
    },
    {
      title: "Course Progress",
      value: stats?.courseProgress || 0,
      suffix: "%",
      trend: "5 courses active",
      icon: "fas fa-chart-line",
      color: "accent",
      bgColor: "bg-accent/10",
      textColor: "text-accent"
    },
    {
      title: "Achievement Points",
      value: stats?.points || 0,
      suffix: "",
      trend: "Rank #23 in class",
      icon: "fas fa-star", 
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-cards">
      {statsData.map((stat, index) => (
        <Card key={index} className="p-6 hover-lift">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mb-1" data-testid={`stat-${stat.title.toLowerCase().replace(' ', '-')}`}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-xs text-secondary flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  {stat.trend}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} ${stat.textColor} text-xl`}></i>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}