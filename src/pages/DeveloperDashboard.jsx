import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "@/components/ProgressBar";
import {
  Building2,
  DollarSign,
  Users,
  Upload,
  TrendingUp,
  Settings,
  Plus,
  FileText,
} from "lucide-react";
import { projects } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import api from "../lib/api"; // ✅ make sure this points to your axios instance

const DeveloperDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [activeTab, setActiveTab] = useState("projects");
  const [newProject, setNewProject] = useState({
    title: "",
    short_description: "",
    full_description: "",
    location: "",
    type: "",
    target_amount: "",
    minimum_investment: "",
    expected_yield: "",
    timeline: "",
    image: null,
  });

  const developerProjects = projects.slice(0, 2);
  const totalFunding = developerProjects.reduce((sum, p) => sum + p.currentFunding, 0);
  const totalInvestors = developerProjects.reduce((sum, p) => sum + p.investors, 0);
  const formatCurrency = (amount) => `₵${amount.toLocaleString()}`;

  // ✅ Fetch logged-in user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/user");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast({
          title: "Authentication Error",
          description: "Unable to load user information. Please log in again.",
          variant: "destructive",
        });
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [toast]);

  // ✅ Handle new project form submission
  const handleSubmitProject = async () => {
    if (!newProject.title || !newProject.target_amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(newProject).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      // include developer info from user
      if (user) {
        formData.append("developer_name", user.name);
      }

      await api.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Project Created",
        description: "Your project has been successfully submitted for review.",
      });

      setNewProject({
        title: "",
        short_description: "",
        full_description: "",
        location: "",
        type: "",
        target_amount: "",
        minimum_investment: "",
        expected_yield: "",
        timeline: "",
        image: null,
      });

      setActiveTab("projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create project.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProject((prev) => ({ ...prev, image: file }));
      toast({
        title: "File Uploaded",
        description: `${file.name} selected successfully.`,
      });
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Greeting + Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome, {user?.name || "Developer"}
            </h1>
            <p className="text-muted-foreground">
              {user?.email} • {user?.company || "No company info"}
            </p>
            <p className="text-muted-foreground mt-1">
              Manage your real estate projects and funding
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("submit")}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold">{formatCurrency(totalFunding)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Investors</p>
                <p className="text-2xl font-bold">{totalInvestors}</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">{developerProjects.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Funding</p>
                <p className="text-2xl font-bold">
                  {((totalFunding / developerProjects.length) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="submit">Submit Project</TabsTrigger>
            <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          {/* MY PROJECTS */}
          <TabsContent value="projects">
            <div className="space-y-6">
              {developerProjects.map((project) => {
                const fundingPercentage = (project.currentFunding / project.targetFunding) * 100;

                return (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{project.title}</h3>
                              <p className="text-muted-foreground">{project.location}</p>
                            </div>
                            <Badge
                              variant={
                                project.fundingStatus === "active" ? "default" : "secondary"
                              }
                            >
                              {project.fundingStatus}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground">{project.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Funding Progress</span>
                              <span>{fundingPercentage.toFixed(1)}%</span>
                            </div>
                            <ProgressBar value={fundingPercentage} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span>{formatCurrency(project.currentFunding)} raised</span>
                              <span>{formatCurrency(project.targetFunding)} target</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center bg-muted/50 rounded-lg p-3">
                              <div className="text-lg font-bold">{project.investors}</div>
                              <div className="text-xs text-muted-foreground">Investors</div>
                            </div>
                            <div className="text-center bg-muted/50 rounded-lg p-3">
                              <div className="text-lg font-bold">{project.expectedYield}%</div>
                              <div className="text-xs text-muted-foreground">Yield</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* SUBMIT PROJECT */}
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Project Title *</Label>
                    <Input
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="Enter project name"
                    />

                    <Label>Location *</Label>
                    <Input
                      value={newProject.location}
                      onChange={(e) =>
                        setNewProject({ ...newProject, location: e.target.value })
                      }
                      placeholder="e.g., East Legon, Accra"
                    />

                    <Label>Property Type *</Label>
                    <Select
                      value={newProject.type}
                      onValueChange={(value) =>
                        setNewProject({ ...newProject, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="student-housing">Student Housing</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label>Target Funding (₵) *</Label>
                    <Input
                      type="number"
                      value={newProject.target_amount}
                      onChange={(e) =>
                        setNewProject({ ...newProject, target_amount: e.target.value })
                      }
                      placeholder="e.g., 2500000"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Minimum Investment (₵)</Label>
                    <Input
                      type="number"
                      value={newProject.minimum_investment}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          minimum_investment: e.target.value,
                        })
                      }
                      placeholder="e.g., 1000"
                    />

                    <Label>Expected Annual Yield (%)</Label>
                    <Input
                      type="number"
                      value={newProject.expected_yield}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          expected_yield: e.target.value,
                        })
                      }
                      placeholder="e.g., 12.5"
                    />

                    <Label>Project Timeline</Label>
                    <Input
                      value={newProject.timeline}
                      onChange={(e) =>
                        setNewProject({ ...newProject, timeline: e.target.value })
                      }
                      placeholder="e.g., 24 months"
                    />

                    <Label>Project Description *</Label>
                    <Textarea
                      rows={4}
                      value={newProject.full_description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          full_description: e.target.value,
                        })
                      }
                      placeholder="Detailed description..."
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4"> <h4 className="font-semibold">Required Documents</h4> 
                <div className="grid md:grid-cols-3 gap-4"> {[ { name: "Valuation Report", key: "valuation", icon: Upload }, { name: "Title Deed", key: "titleDeed", icon: FileText }, { name: "Building Permit", key: "permit", icon: Building2 } ].map((doc) => ( <Card key={doc.key} className="p-4 border-dashed"> <div className="text-center space-y-2"> <doc.icon className="h-8 w-8 mx-auto text-muted-foreground" /> 
                <div className="text-sm font-medium">{doc.name}</div> <Input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => handleFileUpload(e, doc.key)} /> 
                </div> </Card> ))} 
                </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSubmitProject} size="lg">
                    Submit for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
