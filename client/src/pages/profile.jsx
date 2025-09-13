import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSkillAnalysisOpen, setIsSkillAnalysisOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
  });
  const [skillAnalysisData, setSkillAnalysisData] = useState({
    resume: "",
    currentSkills: "",
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: learningPaths } = useQuery({
    queryKey: ["/api/learning-paths"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeSkillsMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/analyze-skills", {
        resume: data.resume,
        currentSkills: data.currentSkills.split(",").map((s) => s.trim()),
      });
      return res.json();
    },
    onSuccess: (analysis) => {
      toast({
        title: "Skills analyzed",
        description:
          "Your skill gap analysis is complete. Check the recommendations!",
      });
      setIsSkillAnalysisOpen(false);
      // You could store the analysis results in state and display them
    },
    onError: () => {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze skills. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handleAnalyzeSkills = (e) => {
    e.preventDefault();
    analyzeSkillsMutation.mutate(skillAnalysisData);
  };

  return (
    <div className="flex h-screen overflow-hidden" data-testid="profile-page">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          title="Profile"
          subtitle="Manage your account and track your learning journey"
        />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage
                      src={
                        user?.profileImage ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                      }
                    />
                    <AvatarFallback className="text-2xl">
                      {user?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">
                    {user?.fullName || user?.username}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="capitalize">
                      {user?.role}
                    </Badge>
                  </CardDescription>
                  {user?.bio && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {user.bio}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => setIsEditingProfile(true)}
                    data-testid="button-edit-profile"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </Button>

                  <Dialog
                    open={isSkillAnalysisOpen}
                    onOpenChange={setIsSkillAnalysisOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        data-testid="button-analyze-skills"
                      >
                        <i className="fas fa-brain mr-2"></i>
                        AI Skill Analysis
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>AI Skill Gap Analysis</DialogTitle>
                        <DialogDescription>
                          Let AI analyze your current skills and identify areas
                          for improvement.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAnalyzeSkills}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="resume">
                              Resume/Experience (optional)
                            </Label>
                            <Textarea
                              id="resume"
                              placeholder="Paste your resume content or describe your experience..."
                              value={skillAnalysisData.resume}
                              onChange={(e) =>
                                setSkillAnalysisData({
                                  ...skillAnalysisData,
                                  resume: e.target.value,
                                })
                              }
                              className="min-h-[100px]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="currentSkills">
                              Current Skills (comma separated)
                            </Label>
                            <Input
                              id="currentSkills"
                              placeholder="JavaScript, React, HTML, CSS, etc."
                              value={skillAnalysisData.currentSkills}
                              onChange={(e) =>
                                setSkillAnalysisData({
                                  ...skillAnalysisData,
                                  currentSkills: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="submit"
                            disabled={analyzeSkillsMutation.isPending}
                          >
                            {analyzeSkillsMutation.isPending
                              ? "Analyzing..."
                              : "Analyze Skills"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Stats and Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Learning Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>
                    Your progress and achievements overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userStats?.learningHours || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Learning Hours
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {userStats?.skillsMastered || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Skills Mastered
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {userStats?.courseProgress || 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Course Progress
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userStats?.points || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Points
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Tabs */}
              <Tabs defaultValue="skills" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="learning-paths">
                    Learning Paths
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Skills</CardTitle>
                      <CardDescription>
                        Track your skill development progress
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user?.skills && user.skills.length > 0 ? (
                        <div className="space-y-4">
                          {user.skills.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {skill.name || skill}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {skill.level || "Beginner"}
                                </span>
                              </div>
                              <Progress
                                value={skill.proficiency || 30}
                                className="h-2"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <i className="fas fa-brain text-4xl text-muted-foreground mb-4"></i>
                          <p className="text-muted-foreground">
                            No skills added yet. Update your profile or run an
                            AI skill analysis!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements & Badges</CardTitle>
                      <CardDescription>
                        Your learning milestones and accomplishments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {achievements && achievements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {achievements.map((achievement) => (
                            <div
                              key={achievement.id}
                              className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
                            >
                              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                                <i
                                  className={`${achievement.badgeIcon} text-accent-foreground`}
                                ></i>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {achievement.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {achievement.description}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  +{achievement.points} XP
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <i className="fas fa-trophy text-4xl text-muted-foreground mb-4"></i>
                          <p className="text-muted-foreground">
                            No achievements yet. Keep learning to unlock your
                            first badge!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="learning-paths" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Learning Paths</CardTitle>
                      <CardDescription>
                        Your active and completed learning journeys
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {learningPaths && learningPaths.length > 0 ? (
                        <div className="space-y-4">
                          {learningPaths.map((path) => (
                            <div
                              key={path.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium">{path.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {path.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <Badge variant="outline">
                                    {path.difficulty}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {path.estimatedHours}h estimated
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <div className="text-sm font-medium mb-1">
                                  {Math.floor(Math.random() * 100)}% Complete
                                </div>
                                <Progress
                                  value={Math.floor(Math.random() * 100)}
                                  className="w-24 h-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <i className="fas fa-route text-4xl text-muted-foreground mb-4"></i>
                          <p className="text-muted-foreground">
                            No learning paths created yet. Start your learning
                            journey!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Edit Profile Dialog */}
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information and skills.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending
                      ? "Updating..."
                      : "Update Profile"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
