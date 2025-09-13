import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export function OpportunitiesWidget() {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["/api/opportunities", { limit: 3 }],
  });

  const getTypeIcon = (type) => {
    const icons = {
      internship: "fas fa-briefcase text-primary",
      hackathon: "fas fa-trophy text-accent", 
      workshop: "fas fa-users text-primary",
      job: "fas fa-building text-secondary"
    };
    return icons[type] || "fas fa-star text-muted-foreground";
  };

  const getTypeColor = (type) => {
    const colors = {
      internship: "default",
      hackathon: "destructive",
      workshop: "secondary", 
      job: "outline"
    };
    return colors[type] || "default";
  };

  const handleApply = (opportunity) => {
    if (opportunity.applicationUrl) {
      window.open(opportunity.applicationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="opportunities-widget">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" data-testid="opportunities-widget">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Opportunities</CardTitle>
            <CardDescription>Latest openings for you</CardDescription>
          </div>
          <Link href="/opportunities">
            <Button variant="ghost" size="sm" className="text-primary hover:underline" data-testid="button-view-all-opportunities">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <div 
              key={opportunity.id} 
              className="border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              data-testid={`opportunity-${opportunity.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className={getTypeIcon(opportunity.type)}></i>
                    <Badge variant={getTypeColor(opportunity.type)} className="text-xs">
                      {opportunity.type}
                    </Badge>
                    {opportunity.isRemote && (
                      <Badge variant="outline" className="text-xs">Remote</Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
                    {opportunity.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {opportunity.company ? `${opportunity.company} • ` : ''}{opportunity.location}
                  </p>
                  
                  {opportunity.requirements && opportunity.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {opportunity.requirements.slice(0, 2).map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {opportunity.requirements.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{opportunity.requirements.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {opportunity.deadline && (
                    <p className="text-xs text-muted-foreground">
                      <i className="fas fa-clock mr-1"></i>
                      Deadline: {formatDistanceToNow(new Date(opportunity.deadline), { addSuffix: true })}
                    </p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="ml-2 text-xs"
                  onClick={() => handleApply(opportunity)}
                  data-testid={`button-apply-${opportunity.id}`}
                >
                  {opportunity.type === 'hackathon' ? 'Register' : 
                   opportunity.type === 'workshop' ? 'Join' : 'Apply'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-briefcase text-2xl text-muted-foreground"></i>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Opportunities</h3>
            <p className="text-muted-foreground mb-4">
              New opportunities will appear here as they become available.
            </p>
            <Link href="/opportunities">
              <Button size="sm" data-testid="button-browse-opportunities">
                <i className="fas fa-search mr-2"></i>
                Browse All
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}