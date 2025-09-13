import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { StatsCards } from "@/components/stats-cards";
import { ProgressChart } from "@/components/progress-chart";
import { AiRecommendations } from "@/components/ai-recommendations";
import { LearningPathDisplay } from "@/components/learning-path-display";
import { Achievements } from "@/components/achievements";
import { ResourceMarketplace } from "@/components/resource-marketplace";
import { OpportunitiesWidget } from "@/components/opportunities-widget";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden" data-testid="dashboard-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          title="Dashboard"
          subtitle="Track your learning progress and achievements"
        />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2 xl:col-span-2">
              <ProgressChart />
            </div>
            <div>
              <AiRecommendations />
            </div>
            
            <div className="lg:col-span-2">
              <LearningPathDisplay />
            </div>
            <div>
              <Achievements />
            </div>
            
            <div className="lg:col-span-2">
              <ResourceMarketplace />
            </div>
            <div>
              <OpportunitiesWidget />
            </div>
          </div>
          
          {/* Quick Actions Bar */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="flex space-x-3 flex-wrap">
                <Button className="flex items-center space-x-2" data-testid="button-take-quiz">
                  <i className="fas fa-question-circle"></i>
                  <span>Take Quiz</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2" data-testid="button-mock-interview">
                  <i className="fas fa-microphone"></i>
                  <span>Mock Interview</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2" data-testid="button-ask-ai">
                  <i className="fas fa-robot"></i>
                  <span>Ask AI</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2" data-testid="button-join-discussion">
                  <i className="fas fa-comments"></i>
                  <span>Join Discussion</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}