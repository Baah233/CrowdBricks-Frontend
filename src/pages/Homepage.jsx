import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { TrendingUp, Users, Building2, Shield, Search, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { projects, platformStats } from "@/lib/data";

const Homepage = () => {
  const featuredProjects = projects.slice(0, 3);

  const formatCurrency = (amount) => `₵${(amount / 1000000).toFixed(1)}M`;
  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="min-h-screen font-sans bg-background text-foreground selection:bg-primary/10">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-40 bg-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-1 rounded-full bg-white/10 border border-white/20">
              Ghana's Premier Real Estate Crowdfunding Platform
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold text-whte tracking-tight leading-tight ">
              Invest in Real Estate,{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                One Brick at a Time
              </span>
            </h1>

            <p className="text-lg lg:text-2xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
              Start with as little as ₵500 and earn passive income from verified real estate projects across Ghana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className=" text-white hover:scale-105 hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  Browse Projects
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-20 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { label: "Total Raised", value: formatCurrency(platformStats.totalRaised), color: "text-primary" },
              { label: "Active Investors", value: `${formatNumber(platformStats.totalInvestors)}+`, color: "text-secondary" },
              { label: "Projects Funded", value: platformStats.totalProjects, color: "text-accent" },
              { label: "Avg. Returns", value: `${platformStats.averageReturn}%`, color: "text-green-600" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Featured Investment Opportunities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated, high-return real estate projects vetted for transparency and impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>

          <div className="text-center">
            <Link to="/projects">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-300">
                View All Projects
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Crowdbricks Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invest in verified real estate projects in 3 simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Search, title: "1. Browse & Research", text: "Explore verified projects with transparent details and expected ROI." },
              { icon: DollarSign, title: "2. Invest Securely", text: "Choose your amount, pay via Momo or bank, and own fractional shares." },
              { icon: TrendingUp, title: "3. Earn Returns", text: "Track performance, receive dividends, and grow your portfolio." },
            ].map((step, i) => (
              <Card key={i} className="text-center p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <div className="space-y-10">
            <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-primary" /> Why Choose Crowdbricks?
            </h2>

            <div className="grid md:grid-cols-2 gap-10 text-left">
              {[
                { icon: Shield, title: "SEC-Compliant Platform", desc: "Regulated under Ghana's Securities & Exchange Commission." },
                { icon: Users, title: "Verified Developers", desc: "All developers undergo strict vetting and project checks." },
                { icon: Building2, title: "Quality Projects", desc: "We assess every project for profitability and risk." },
                { icon: TrendingUp, title: "Transparent Returns", desc: "Clear data on ROI, timeline, and risk levels." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold">Ready to Start Building Wealth?</h2>
          <p className="text-lg text-blue-100/90">
            Join thousands of Ghanaians already earning from real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="border-white text-primary hover:bg-white/10 hover:scale-105 transition-transform duration-300 px-8 py-4">
                Create Account
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:scale-105 px-8 py-4">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
