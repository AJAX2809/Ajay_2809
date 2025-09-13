import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export function TopNav({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between" data-testid="top-nav">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden md:block">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search courses, skills..." 
              className="w-64 pl-10"
              data-testid="input-global-search"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          </div>
        </div>
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative"
          data-testid="button-notifications"
        >
          <i className="fas fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2" data-testid="button-profile-dropdown">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
              <AvatarFallback>
                {user?.fullName?.split(' ').map(n => n[0]).join('') || user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <i className="fas fa-chevron-down text-sm"></i>
          </Button>
        </div>
      </div>
    </header>
  );
}