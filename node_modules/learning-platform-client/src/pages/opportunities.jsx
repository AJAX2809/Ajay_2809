import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["/api/opportunities"],
  });

  const filteredOpportunities = opportunities?.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || opp.type === selectedType;
    return matchesSearch && matchesType;
  }) || [];

  const getTypeIcon = (type) => {
    const icons = {
      internship: "fas fa-briefcase",
      hackathon: "fas fa-trophy",
      workshop: "fas fa-users",
      job: "fas fa-building"
    };
    return icons[type] || "fas fa-star";
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

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav title="Opportunities" subtitle="Find internships, hackathons, and career opportunities" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading opportunities...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" data-testid="opportunities-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          title="Opportunities"
          subtitle="Find internships, hackathons, and career opportunities"
        />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Header with Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Latest Opportunities</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:w-64"
                data-testid="input-search-opportunities"
              />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internships</SelectItem>
                  <SelectItem value="hackathon">Hackathons</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                  <SelectItem value="job">Jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type Tabs */}
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({opportunities?.length || 0})</TabsTrigger>
              <TabsTrigger value="internship">
                Internships ({opportunities?.filter((o) => o.type === 'internship').length || 0})
              </TabsTrigger>
              <TabsTrigger value="hackathon">
                Hackathons ({opportunities?.filter((o) => o.type === 'hackathon').length || 0})
              </TabsTrigger>
              <TabsTrigger value="workshop">
                Workshops ({opportunities?.filter((o) => o.type === 'workshop').length || 0})
              </TabsTrigger>
              <TabsTrigger value="job">
                Jobs ({opportunities?.filter((o) => o.type === 'job').length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedType} className="space-y-4 mt-6">
              {filteredOpportunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-shadow" data-testid={`opportunity-${opportunity.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className={`${getTypeIcon(opportunity.type)} text-primary`}></i>
                            <Badge variant={getTypeColor(opportunity.type)}>
                              {opportunity.type}
                            </Badge>
                            {opportunity.isRemote && (
                              <Badge variant="outline">Remote</Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {opportunity.title}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2 text-sm">
                          {opportunity.company && (
                            <>
                              <span>{opportunity.company}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{opportunity.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {opportunity.description}
                        </p>
                        
                        {opportunity.requirements && opportunity.requirements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
                            <div className="flex flex-wrap gap-1">
                              {opportunity.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          {opportunity.deadline && (
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-clock"></i>
                              <span>
                                Deadline: {formatDistanceToNow(new Date(opportunity.deadline), { addSuffix: true })}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                          data-testid={`button-apply-${opportunity.id}`}
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>
                          {opportunity.type === 'hackathon' ? 'Register' : 
                           opportunity.type === 'workshop' ? 'Join' : 'Apply'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-search text-4xl text-muted-foreground"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {searchQuery ? 'No matching opportunities found' : 'No opportunities available'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? 'Try adjusting your search terms or filters.'
                      : 'New opportunities will appear here as they become available.'}
                  </p>
                  {searchQuery && (
                    <Button onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}