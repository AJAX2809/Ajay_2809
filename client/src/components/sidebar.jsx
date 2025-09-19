import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Home, Route, Users, Briefcase, User, GraduationCap, Settings, Menu, X } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { path: "/", Icon: Home, label: "Dashboard" },
    { path: "/learning-path", Icon: Route, label: "Learning Path" },
    { path: "/community", Icon: Users, label: "Community" },
    { path: "/opportunities", Icon: Briefcase, label: "Opportunities" },
    { path: "/profile", Icon: User, label: "Profile" },
  ];

  const isActive = (path) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex-shrink-0 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">LearnPath</h1>
                <p className="text-xs text-muted-foreground">SIH1615 Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <a
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                <AvatarFallback>
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        data-testid="button-mobile-menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
    </>
  );
}