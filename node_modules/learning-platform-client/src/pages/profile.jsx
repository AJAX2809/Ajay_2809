import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
// NOTE: The Sidebar and TopNav components are assumed to exist and are not part of shadcn/ui.
// If they are, they will need to be replaced with plain React components.
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function ProfilePage() {
  const { user } = useAuth();
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
  const [activeTab, setActiveTab] = useState("skills");

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
      alert("Profile has been successfully updated.");
    },
    onError: () => {
      alert("Failed to update profile. Please try again.");
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
      alert("Your skill gap analysis is complete. Check the recommendations!");
      setIsSkillAnalysisOpen(false);
      // You could store the analysis results in state and display them
    },
    onError: () => {
      alert("Failed to analyze skills. Please try again.");
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
    <div className="page-container" data-testid="profile-page">
      <Sidebar />

      <div className="main-view">
        <TopNav
          title="Profile"
          subtitle="Manage your account and track your learning journey"
        />

        <main className="main-content">
          <div className="content-grid">
            {/* Profile Card */}
            <div className="grid-col-span-1">
              <div className="card">
                <div className="card-header text-center">
                  <div style={{ margin: '0 auto 1rem', width: '96px', height: '96px' }}>
                    <img
                      src={
                        user?.profileImage ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                      }
                      alt="Profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.25rem' }}>
                    {user?.fullName || user?.username}
                  </h3>
                  <div className="card-description">
                    <span className="badge">{user?.role}</span>
                  </div>
                  {user?.bio && (
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                      {user.bio}
                    </p>
                  )}
                </div>
                <div className="card-content space-y-4">
                  <button
                    className="button button-primary w-full"
                    onClick={() => setIsEditingProfile(true)}
                    data-testid="button-edit-profile"
                  >
                    Edit Profile
                  </button>

                  <button
                    className="button button-outline w-full"
                    onClick={() => setIsSkillAnalysisOpen(true)}
                    data-testid="button-analyze-skills"
                  >
                    AI Skill Analysis
                  </button>
                </div>
              </div>
            </div>

            {/* Stats and Content */}
            <div className="grid-col-span-2 space-y-4">
              {/* Learning Stats */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Learning Statistics</h3>
                  <p className="card-description">
                    Your progress and achievements overview
                  </p>
                </div>
                <div className="card-content">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div className="text-center">
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                        {userStats?.learningHours || 0}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Learning Hours
                      </div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>
                        {userStats?.skillsMastered || 0}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Skills Mastered
                      </div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                        {userStats?.courseProgress || 0}%
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Course Progress
                      </div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                        {userStats?.points || 0}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Total Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="tabs space-y-4">
                <div className="tabs-list">
                  <button onClick={() => setActiveTab('skills')} className={`tab-trigger ${activeTab === 'skills' ? 'active' : ''}`}>Skills</button>
                  <button onClick={() => setActiveTab('achievements')} className={`tab-trigger ${activeTab === 'achievements' ? 'active' : ''}`}>Achievements</button>
                  <button onClick={() => setActiveTab('learning-paths')} className={`tab-trigger ${activeTab === 'learning-paths' ? 'active' : ''}`}>Learning Paths</button>
                </div>

                {activeTab === 'skills' && (
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">My Skills</h3>
                      <p className="card-description">
                        Track your skill development progress
                      </p>
                    </div>
                    <div className="card-content">
                      {user?.skills && user.skills.length > 0 ? (
                        <div className="space-y-4">
                          {user.skills.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>
                                  {skill.name || skill}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                  {skill.level || "Beginner"}
                                </span>
                              </div>
                              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${skill.proficiency || 30}%`, height: '100%', backgroundColor: '#2563eb' }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center" style={{ padding: '32px 0' }}>
                          <p style={{ color: '#64748b' }}>
                            No skills added yet. Update your profile or run an
                            AI skill analysis!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Achievements & Badges</h3>
                      <p className="card-description">
                        Your learning milestones and accomplishments
                      </p>
                    </div>
                    <div className="card-content">
                      {achievements && achievements.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          {achievements.map((achievement) => (
                            <div
                              key={achievement.id}
                              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}
                            >
                              <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: 500 }}>
                                  {achievement.title}
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                  {achievement.description}
                                </p>
                                <span className="badge mt-1">
                                  +{achievement.points} XP
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center" style={{ padding: '32px 0' }}>
                          <p style={{ color: '#64748b' }}>
                            No achievements yet. Keep learning to unlock your
                            first badge!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'learning-paths' && (
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">My Learning Paths</h3>
                      <p className="card-description">
                        Your active and completed learning journeys
                      </p>
                    </div>
                    <div className="card-content">
                      {learningPaths && learningPaths.length > 0 ? (
                        <div className="space-y-4">
                          {learningPaths.map((path) => (
                            <div
                              key={path.id}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            >
                              <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: 500 }}>{path.title}</h4>
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                  {path.description}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                  <span className="badge">
                                    {path.difficulty}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {path.estimatedHours}h estimated
                                  </span>
                                </div>
                              </div>
                              <div style={{ marginLeft: '1rem', textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                                  {Math.floor(Math.random() * 100)}% Complete
                                </div>
                                <div style={{ width: '96px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${Math.floor(Math.random() * 100)}%`, height: '100%', backgroundColor: '#2563eb' }}></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center" style={{ padding: '32px 0' }}>
                          <p style={{ color: '#64748b' }}>
                            No learning paths created yet. Start your learning
                            journey!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Dialog */}
          {isEditingProfile && (
            <div className="dialog-overlay" onClick={() => setIsEditingProfile(false)}>
              <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                  <h3 className="card-title">Edit Profile</h3>
                  <p className="card-description">Update your profile information and skills.</p>
                </div>
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div>
                      <label className="label" htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        className="input"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="bio">Bio</label>
                      <textarea
                        id="bio"
                        className="textarea"
                        placeholder="Tell us about yourself..."
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="dialog-footer">
                    <button type="submit" className="button button-primary" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* AI Skill Analysis Dialog */}
          {isSkillAnalysisOpen && (
            <div className="dialog-overlay" onClick={() => setIsSkillAnalysisOpen(false)}>
              <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                  <h3 className="card-title">AI Skill Gap Analysis</h3>
                  <p className="card-description">Let AI analyze your current skills and identify areas for improvement.</p>
                </div>
                <form onSubmit={handleAnalyzeSkills}>
                  <div className="space-y-4">
                    <div>
                      <label className="label" htmlFor="resume">Resume/Experience (optional)</label>
                      <textarea
                        id="resume"
                        className="textarea"
                        placeholder="Paste your resume content or describe your experience..."
                        value={skillAnalysisData.resume}
                        onChange={(e) => setSkillAnalysisData({ ...skillAnalysisData, resume: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="currentSkills">Current Skills (comma separated)</label>
                      <input
                        id="currentSkills"
                        className="input"
                        placeholder="JavaScript, React, HTML, CSS, etc."
                        value={skillAnalysisData.currentSkills}
                        onChange={(e) => setSkillAnalysisData({ ...skillAnalysisData, currentSkills: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="dialog-footer">
                    <button type="submit" className="button button-primary" disabled={analyzeSkillsMutation.isPending}>
                      {analyzeSkillsMutation.isPending ? "Analyzing..." : "Analyze Skills"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
