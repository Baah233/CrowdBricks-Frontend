import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "@/components/ProgressBar";
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Calendar, 
  FileText, 
  ArrowLeft,
  DollarSign,
  Target,
  Clock,
  Star
} from "lucide-react";
import { projects } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Project Not Found</h1>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fundingPercentage = (project.currentFunding / project.targetFunding) * 100;
  const formatCurrency = (amount) => `₵${amount.toLocaleString()}`;

  const handleInvestment = () => {
    const amount = parseFloat(investmentAmount);
    if (!amount || amount < project.minimumInvestment) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is ${formatCurrency(project.minimumInvestment)}`,
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Investment Successful!",
      description: `You've invested ${formatCurrency(amount)} in ${project.title}`,
    });
    setIsInvestModalOpen(false);
    setInvestmentAmount("");
    setPaymentMethod("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/projects" className="flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Project Header */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={project.fundingStatus === "active" ? "default" : "secondary"}
                  >
                    {project.fundingStatus === "active" ? "Funding Open" : 
                     project.fundingStatus === "funded" ? "Fully Funded" : "Completed"}
                  </Badge>
                  <Badge variant="outline">
                    {project.type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{project.title}</h1>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  {project.location}
                </div>
                
                <p className="text-lg text-muted-foreground">{project.description}</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-success">{project.expectedYield}%</div>
                  <div className="text-sm text-muted-foreground">Expected Annual Yield</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{formatCurrency(project.minimumInvestment)}</div>
                  <div className="text-sm text-muted-foreground">Minimum Investment</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{project.investors}</div>
                  <div className="text-sm text-muted-foreground">Investors</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{project.timeline}</div>
                  <div className="text-sm text-muted-foreground">Project Timeline</div>
                </div>
              </div>

              {/* Investment CTA */}
              {project.fundingStatus === "active" && (
                <Dialog open={isInvestModalOpen} onOpenChange={setIsInvestModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invest in {project.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Investment Amount (₵)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder={`Minimum ${formatCurrency(project.minimumInvestment)}`}
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          min={project.minimumInvestment}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="payment">Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="momo">Mobile Money</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="card">Debit/Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={handleInvestment} className="w-full">
                        Confirm Investment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Funding Progress */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Funding Progress</h3>
                  <span className="text-lg font-bold">{fundingPercentage.toFixed(1)}%</span>
                </div>
                
                <ProgressBar value={fundingPercentage} className="h-3" />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold">{formatCurrency(project.currentFunding)}</div>
                    <div className="text-sm text-muted-foreground">Raised</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{formatCurrency(project.targetFunding)}</div>
                    <div className="text-sm text-muted-foreground">Target</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{project.investors}</div>
                    <div className="text-sm text-muted-foreground">Investors</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="investors">Investors</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Investment Highlights</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-success mr-2" />
                              Prime location with high growth potential
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-success mr-2" />
                              Experienced developer with proven track record
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-success mr-2" />
                              Strong rental demand in the area
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-success mr-2" />
                              Professional property management
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Key Metrics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expected Yield</span>
                              <span className="font-medium">{project.expectedYield}% annually</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Project Timeline</span>
                              <span className="font-medium">{project.timeline}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Min. Investment</span>
                              <span className="font-medium">{formatCurrency(project.minimumInvestment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Property Type</span>
                              <span className="font-medium">
                                {project.type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {project.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                              <span className="font-medium">{doc}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Updates Tab */}
                <TabsContent value="updates">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.updates.map((update) => (
                          <div key={update.id} className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{update.title}</h4>
                              <span className="text-sm text-muted-foreground">{update.date}</span>
                            </div>
                            <p className="text-muted-foreground">{update.content}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Investors Tab */}
                <TabsContent value="investors">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investor Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">{project.investors}</div>
                            <div className="text-sm text-muted-foreground">Total Investors</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">
                              {formatCurrency(project.currentFunding / project.investors)}
                            </div>
                            <div className="text-sm text-muted-foreground">Avg. Investment</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Join {project.investors} other investors who have already committed to this project. 
                          Our investor community includes both first-time and experienced real estate investors.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Developer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Developer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{project.developer.name}</h4>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-accent fill-current" />
                        <span className="text-sm ml-1">{project.developer.rating}</span>
                      </div>
                    </div>
                    {project.developer.verified && (
                      <Badge variant="outline" className="text-success border-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {project.developer.completedProjects} completed projects
                  </div>

                  <Button variant="outline" className="w-full">
                    View Developer Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Risk Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Investment Risk:</strong> Real estate investments carry inherent risks including market fluctuations, construction delays, and economic factors.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Liquidity:</strong> This is a long-term investment. Early exit options may be limited.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Full Risk Disclosure
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
