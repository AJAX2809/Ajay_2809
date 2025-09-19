import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function CommunityPage() {
  const { toast } = useToast();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    tags: ""
  });

  const { data: forumPosts, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", selectedCategory !== "all" ? { category: selectedCategory } : {}],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      const res = await apiRequest("POST", "/api/forum/posts", {
        ...postData,
        tags: postData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", content: "", category: "general", tags: "" });
      toast({
        title: "Post created",
        description: "Your forum post has been published successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    createPostMutation.mutate(newPost);
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-secondary",
      javascript: "bg-yellow-500",
      react: "bg-blue-500",
      career: "bg-green-500",
      help: "bg-red-500",
      showcase: "bg-purple-500"
    };
    return colors[category] || "bg-muted";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav title="Community" subtitle="Connect and learn with fellow students" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading community posts...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" data-testid="community-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          title="Community"
          subtitle="Connect and learn with fellow students"
        />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Header with Create Post Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Forum Discussions</h2>
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2" data-testid="button-create-post">
                  <i className="fas fa-plus"></i>
                  <span>New Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share your question, knowledge, or start a discussion with the community.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePost}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="What's your question or topic?"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="help">Help</SelectItem>
                            <SelectItem value="showcase">Showcase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          placeholder="beginner, html, css"
                          value={newPost.tags}
                          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Describe your question or share your knowledge..."
                        className="min-h-[120px]"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit" disabled={createPostMutation.isPending}>
                      {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
              <TabsTrigger value="showcase">Showcase</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-4 mt-6">
              {forumPosts && forumPosts.length > 0 ? (
                forumPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`post-${post.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} />
                              <AvatarFallback>
                                {post.userId.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(post.category)}>
                                {post.category}
                              </Badge>
                              {post.isResolved && (
                                <Badge variant="outline" className="text-green-600">
                                  <i className="fas fa-check mr-1"></i>
                                  Solved
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {post.content}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-thumbs-up"></i>
                            <span>{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-reply"></i>
                            <span>{post.replies || 0} replies</span>
                          </div>
                          <span>
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-comments text-4xl text-muted-foreground"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to start a discussion in this category!
                  </p>
                  <Button onClick={() => setIsCreatePostOpen(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Create First Post
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}