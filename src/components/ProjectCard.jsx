import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, TrendingUp, CheckCircle } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";




export const ProjectCard = ({ project, featured = false }) => {
  const fundingPercentage = (project.currentFunding / project.targetFunding) * 100;
  const formatCurrency = (amount) => `₵${amount.toLocaleString()}`;

  return (
    <Card className={`group overflow-hidden hover-lift ${featured ? "shadow-primary" : ""}`}>
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge
            variant={project.fundingStatus === "active" ? "default" : "secondary"}
            className="bg-background/90 text-foreground border"
          >
            {project.fundingStatus === "active" ? "Funding" : 
             project.fundingStatus === "funded" ? "Funded" : "Completed"}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-background/90 text-foreground">
            {project.type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Location */}
          <div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </div>
          </div>

          {/* Developer Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{project.developer.name}</span>
              {project.developer.verified && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {project.developer.completedProjects} projects
            </div>
          </div>

          {/* Funding Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-medium">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <ProgressBar 
              value={fundingPercentage} 
              className="h-2"
            />
            <div className="flex justify-between text-sm">
              <span className="font-medium">{formatCurrency(project.currentFunding)}</span>
              <span className="text-muted-foreground">of {formatCurrency(project.targetFunding)}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="text-lg font-bold text-success">{project.expectedYield}%</div>
              <div className="text-xs text-muted-foreground">Expected Yield</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="text-lg font-bold">{project.investors}</div>
              <div className="text-xs text-muted-foreground">Investors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{formatCurrency(project.minimumInvestment)}</div>
              <div className="text-xs text-muted-foreground">Min. Investment</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-2">
          <Link to={`/projects/${project.id}`} className="w-full">
            <Button className="w-full" size="lg">
              View Details
            </Button>
          </Link>
          {featured && (
            <p className="text-xs text-center text-muted-foreground">
              ⭐ Featured investment opportunity
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};