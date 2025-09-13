import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ResourceMarketplace() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources/recommended"],
  });

  const handleResourceClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fas fa-star text-xs ${i < rating ? 'text-accent' : 'text-muted'}`}></i>
    ));
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      youtube: "fab fa-youtube text-red-500",
      geeksforgeeks: "fas fa-code text-green-600",
      coursera: "fas fa-graduation-cap text-blue-600", 
      udemy: "fas fa-play-circle text-purple-600"
    };
    return icons[platform] || "fas fa-link";
  };

  if (isLoading) {
    return (
      <Card data-testid="resource-marketplace">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg p-4 border">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-12 bg-muted-foreground rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted-foreground rounded w-3/4"></div>
                      <div className="h-3 bg-muted-foreground rounded w-1/2"></div>
                      <div className="h-3 bg-muted-foreground rounded w-full"></div>
                    </div>
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
    <Card data-testid="resource-marketplace">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recommended Resources</CardTitle>
            <CardDescription>Curated courses and materials for your learning path</CardDescription>
          </div>
          <Button variant="outline" size="sm" data-testid="button-browse-all">
            <i className="fas fa-external-link-alt mr-2"></i>
            Browse All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div 
                key={resource.id} 
                className="group cursor-pointer hover-lift"
                onClick={() => handleResourceClick(resource.url)}
                data-testid={`resource-${resource.id}`}
              >
                <div className="bg-muted rounded-lg p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={resource.thumbnail || `https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120`}
                      alt={resource.title}
                      className="w-16 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target;
                        target.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <i className={getPlatformIcon(resource.platform)}></i>
                        <span className="text-xs text-muted-foreground capitalize">{resource.platform}</span>
                      </div>
                      <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.type === 'video' ? `${resource.duration}` : 
                         resource.type === 'course' ? `${resource.duration}` :
                         `${resource.duration || 'Quick read'}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {resource.rating > 0 && (
                            <>
                              <div className="flex space-x-0.5">
                                {getRatingStars(resource.rating)}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {resource.rating}.0
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={resource.difficulty === 'beginner' ? 'secondary' :
                                    resource.difficulty === 'intermediate' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {resource.difficulty}
                          </Badge>
                          {resource.isFree ? (
                            <Badge variant="outline" className="text-xs text-secondary">Free</Badge>
                          ) : (
                            <span className="text-xs text-destructive font-medium">{resource.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book text-2xl text-muted-foreground"></i>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Resources Available</h3>
            <p className="text-muted-foreground">
              Recommended resources will appear here based on your learning progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}