import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Share2,
  ArrowLeft,
  Heart,
  FileText,
  Star,
  CheckCircle,
  FilePlus,
  TrendingUp,
  Users,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Shield,
  Award,
  Target,
  Clock,
  DollarSign,
  Info,
  X,
  Eye,
  BarChart3,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const money = (n) =>
  typeof n === "number"
    ? `₵${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : n;

const calcNetReturn = (principal, yearlyPct, years) => {
  const gross = principal * Math.pow(1 + yearlyPct / 100, years);
  return { gross: Math.round(gross), profit: Math.round(gross - principal) };
};

const safeProject = (project) => {
  if (!project) return null;
  
  // Handle images - backend returns array of objects with 'url' property
  let images = [];
  if (Array.isArray(project.images) && project.images.length) {
    images = project.images.map(img => {
      if (typeof img === 'string') return img;
      if (img.url) return img.url; // Use the URL accessor from backend
      if (img.path) return `http://crowdbricks-backend.test/storage/${img.path}`; // Fallback
      return img;
    });
  } else if (project.image) {
    images = [project.image];
  } else {
    images = ["/images/default-project.jpg"];
  }

  // Handle documents - backend returns array of objects with 'url' property
  const documents = (project.documents || []).map(doc => ({
    ...doc,
    href: doc.url || `http://crowdbricks-backend.test/storage/${doc.path}`, // Use URL accessor
    size: doc.formatted_size || doc.size || "", // Use formatted size
  }));

  return {
    ...project,
    images,
    documents,
    updates: project.updates || [],
    categories: project.categories || [project.type || "General"],
    tags: project.tags || [],
    team: project.team || [{ 
      name: project.developer ? `${project.developer.first_name} ${project.developer.last_name}` : "Developer Team", 
      role: "Developer",
      company: project.developer?.company || ""
    }],
    milestones: project.milestones || [],
    faqs: project.faqs || [],
    // Map backend fields to frontend expectations
    targetFunding: project.target_funding || project.targetFunding || 0,
    currentFunding: project.current_funding || project.currentFunding || 0,
    minimumInvestment: project.minimum_investment || project.minimumInvestment || 0,
    expectedYield: project.expected_yield || project.expectedYield || 0,
    fundingStatus: project.funding_status || project.fundingStatus || "active",
  };
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [rawProject, setRawProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const project = useMemo(() => {
    const safe = safeProject(rawProject);
    if (safe) {
      console.log("Processed project images:", safe.images);
      console.log("Processed project documents:", safe.documents);
    }
    return safe;
  }, [rawProject]);

  // Fetch project from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${id}`);
        console.log("Raw API response:", response.data);
        setRawProject(response.data);
      } catch (error) {
        console.error('Failed to load project:', error);
        toast({ 
          title: "Error", 
          description: "Failed to load project details", 
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Removed toast from dependencies to prevent infinite loop

  // UI state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [favorite, setFavorite] = useState(false);

  // investment modal state (simple flow)
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if project is saved/favorited on load
  useEffect(() => {
    if (project?.id) {
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      setFavorite(savedProjects.includes(project.id));
    }
  }, [project?.id]);

  // Toggle favorite/save
  const toggleFavorite = () => {
    if (!project?.id) return;

    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    
    if (savedProjects.includes(project.id)) {
      // Remove from favorites
      const updated = savedProjects.filter(id => id !== project.id);
      localStorage.setItem('savedProjects', JSON.stringify(updated));
      setFavorite(false);
      toast({
        title: "Removed from Saved",
        description: "Project removed from your saved list",
      });
    } else {
      // Add to favorites
      const updated = [...savedProjects, project.id];
      localStorage.setItem('savedProjects', JSON.stringify(updated));
      setFavorite(true);
      toast({
        title: "Saved Successfully",
        description: "Project added to your saved list",
      });
    }
  };

  useEffect(() => {
    if (project) {
      setGalleryIndex(0);
      setInvestmentAmount("");
      setPaymentMethod("");
    }
  }, [project, id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    const hash = (location.hash || "").replace("#", "");
    setSelectedTab(tabParam || hash || "overview");
  }, [location.search, location.hash]);

  const onTabChange = (tab) => {
    setSelectedTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      navigate(`${url.pathname}?${url.searchParams.toString()}`, { replace: true });
    } catch {
      navigate(`${location.pathname}?tab=${encodeURIComponent(tab)}`, { replace: true });
    }
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!user;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
        </div>
        <div className="text-center relative z-10 bg-slate-800/40 backdrop-blur-md border-2 border-white/10 rounded-2xl p-12 shadow-2xl">
          <h1 className="text-2xl font-bold text-white">Project not found</h1>
          <p className="text-blue-200 mt-2">The project you're looking for doesn't exist or was removed.</p>
          <div className="mt-4">
            <Link to="/projects"><Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold hover:from-yellow-500 hover:to-amber-600 shadow-lg shadow-yellow-500/30">Back to Projects</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, (project.targetFunding || 0) - (project.currentFunding || 0));
  const fundingPercentage = Math.min(100, ((project.currentFunding || 0) / Math.max(1, project.targetFunding || 1)) * 100);

  const nextImage = () => setGalleryIndex((i) => (i + 1) % project.images.length);
  const prevImage = () => setGalleryIndex((i) => (i - 1 + project.images.length) % project.images.length);

  const handleShare = async () => {
    const shareData = {
      title: project.title,
      text: project.shortDescription || project.description || "",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: "Shared", description: "Thanks for sharing." });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied", description: "Project link copied to clipboard." });
      }
    } catch (e) {
      toast({ title: "Share failed", variant: "destructive" });
    }
  };

  const handleLocalFallback = () => {
    const key = "cb_investments_v1";
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const inv = {
        id: `inv_${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        amount: Number(investmentAmount),
        paymentMethod,
        status: "pending",
        date: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify([inv, ...existing]));
      // notify other tabs
      window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify([inv, ...existing]) }));
      return inv;
    } catch (e) {
      console.error("local fallback failed", e);
      return null;
    }
  };

  const confirmInvestment = async () => {
    const amount = Number(investmentAmount);
    if (!amount || amount < (project.minimumInvestment || 0)) {
      toast({ title: "Invalid amount", description: `Minimum is ${money(project.minimumInvestment)}`, variant: "destructive" });
      return;
    }
    if (!paymentMethod) {
      toast({ title: "Payment method", description: "Select a payment method", variant: "destructive" });
      return;
    }
    if (amount > remaining) {
      toast({ title: "Amount too large", description: `Only ${money(remaining)} remaining`, variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    // Try API
    try {
      if (token && api && api.post) {
        const payload = { project_id: project.id, amount, payment_method: paymentMethod, metadata: { source: "web" } };
        const res = await api.post("/investments", payload);
        toast({ title: "Investment submitted", description: "Your pledge was submitted. Check your investments dashboard." });
        setIsProcessing(false);
        setIsInvestModalOpen(false);
        navigate("/dashboard/investor?tab=investments");
        return;
      }
    } catch (err) {
      console.warn("API submit failed", err);
      
      // Check if error is due to pending approval
      if (err?.response?.status === 403 && err?.response?.data?.status === 'pending_approval') {
        toast({ 
          title: "Account Pending Approval", 
          description: err?.response?.data?.message || "Your account is pending admin approval. You will be able to invest once approved.", 
          variant: "destructive" 
        });
        setIsProcessing(false);
        setIsInvestModalOpen(false);
        return;
      }
      
      // Otherwise fall back to local storage
      console.warn("Falling back to local storage");
    }

    // Local fallback
    const inv = handleLocalFallback();
    if (inv) {
      toast({ title: "Saved locally", description: "Saved your pledge locally since the server couldn't be reached." });
      setIsInvestModalOpen(false);
      navigate("/dashboard/investor?tab=investments");
    } else {
      toast({ title: "Failed", description: "Could not record investment", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  const money = (n) => (typeof n === "number" ? `₵${n.toLocaleString()}` : n);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Global fintech background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
        
        {/* Moving gradient orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-2000"></div>
      </div>
      
      {/* Modern Header with Gradient */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl relative"
      >
        {/* Glowing border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/projects" 
                className="flex items-center gap-2 text-blue-300 hover:text-yellow-400 font-medium transition-colors group"
              >
                <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 group-hover:border-yellow-400/50 transition-all">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">Back to Projects</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-200">{project.location}</span>
              </div>
              
              <Badge className={`hidden lg:inline-flex border-2 backdrop-blur-sm ${
                project.fundingStatus === 'active' ? 'bg-green-500/20 text-green-300 border-green-400/30' : 
                project.fundingStatus === 'funded' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : 
                'bg-purple-500/20 text-purple-300 border-purple-400/30'
              }`}>
                <Sparkles className="h-3 w-3 mr-1" />
                {project.fundingStatus || "Active"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex items-center gap-2 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 border border-white/10 hover:border-blue-400/50 backdrop-blur-sm transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden lg:inline">Share</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleFavorite}
                className="hover:bg-red-500/20 border border-white/10 hover:border-red-400/50 backdrop-blur-sm transition-all"
              >
                <Heart className={`h-5 w-5 ${favorite ? "fill-red-400 text-red-400" : "text-blue-300"} transition-all`} />
                <span className="hidden lg:inline ml-2 text-blue-300">{favorite ? "Saved" : "Save"}</span>
              </Button>

              <Button 
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 text-slate-900 font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all px-6"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname + "#invest")}`);
                    return;
                  }
                  setIsInvestModalOpen(true);
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Invest Now
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section with Gallery & Summary */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Enhanced Gallery */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image with Overlay Info */}
              <motion.div 
                layout 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 group"
              >
                <img
                  src={project.images[galleryIndex]}
                  alt={`${project.title} - ${galleryIndex + 1}`}
                  className="w-full h-[500px] lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                  onClick={() => setLightboxOpen(true)}
                  style={{ cursor: "zoom-in" }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Navigation Buttons */}
                <div className="absolute left-4 bottom-4 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={prevImage}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={nextImage}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setLightboxOpen(true)}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">View Full</span>
                  </Button>
                </div>

                {/* Top Right Badges */}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <Badge className="bg-white/95 backdrop-blur-sm text-slate-900 px-4 py-2 shadow-lg font-bold">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {fundingPercentage.toFixed(1)}% Funded
                  </Badge>
                  <Badge className="bg-green-500/95 backdrop-blur-sm text-white px-4 py-2 shadow-lg">
                    <Users className="h-4 w-4 mr-1" />
                    {project.investors || 0} Investors
                  </Badge>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {galleryIndex + 1} / {project.images.length}
                </div>
              </motion.div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {project.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGalleryIndex(i)}
                    className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                      i === galleryIndex 
                        ? "ring-4 ring-blue-500 shadow-lg" 
                        : "ring-2 ring-transparent hover:ring-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-28 h-20 object-cover" />
                    {i === galleryIndex && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Premium Summary Card */}
            <motion.aside 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Investment Card */}
              <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md relative">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur"></div>
                
                <div className="relative bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-blue-800/90 backdrop-blur-sm p-6 text-white border-b border-white/10">
                  <h1 className="text-2xl font-bold mb-2 leading-tight">{project.title}</h1>
                  <p className="text-blue-100 text-sm line-clamp-2">{project.shortDescription}</p>
                </div>

                <CardContent className="relative p-6 space-y-6 bg-slate-800/60 backdrop-blur-md">
                  {/* Funding Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-blue-200 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Funding Progress
                      </span>
                      <span className="text-lg font-bold text-yellow-400">{fundingPercentage.toFixed(1)}%</span>
                    </div>
                    
                    <div className="relative w-full bg-slate-700/50 rounded-full h-4 overflow-hidden shadow-inner border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fundingPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-yellow-500 relative overflow-hidden shadow-lg shadow-blue-500/50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
                        <div className="text-xs text-green-300 font-medium mb-1">Raised</div>
                        <div className="text-lg font-bold text-green-400">{money(project.currentFunding)}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
                        <div className="text-xs text-blue-300 font-medium mb-1">Target</div>
                        <div className="text-lg font-bold text-blue-400">{money(project.targetFunding)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all">
                      <div className="flex items-center gap-2 text-yellow-300 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-semibold">Expected Yield</span>
                      </div>
                      <div className="text-2xl font-black text-yellow-400">{project.expectedYield}%</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-400/30 hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-2 text-purple-300 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-semibold">Investors</span>
                      </div>
                      <div className="text-2xl font-black text-purple-400">{project.investors || 0}</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-400/30 hover:border-blue-400/50 transition-all col-span-2">
                      <div className="flex items-center gap-2 text-blue-300 mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs font-semibold">Minimum Investment</span>
                      </div>
                      <div className="text-2xl font-black text-blue-400">{money(project.minimumInvestment)}</div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 shadow-lg hover:shadow-xl transition-all"
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname)}`);
                          return;
                        }
                        setIsInvestModalOpen(true);
                      }}
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Invest Now
                    </Button>
                    <Link to={`/contact?developer=${encodeURIComponent(project.developer?.name || "")}`}>
                      <Button variant="outline" className="h-full px-4 border-2 hover:bg-slate-50">
                        <Info className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Developer Card */}
              <Card className="shadow-lg border-2 border-white/10 bg-slate-800/40 backdrop-blur-md">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border-b-2 border-white/10">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Developer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-50"></div>
                        <span className="relative">{(project.developer?.first_name?.[0] || "") + (project.developer?.last_name?.[0] || "D")}</span>
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {project.developer?.first_name} {project.developer?.last_name}
                        </div>
                        {project.developer?.company && (
                          <div className="text-sm text-blue-200">{project.developer.company}</div>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs text-blue-300">
                            {project.developer?.completedProjects || 0} Projects
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-lg border border-yellow-400/30">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-yellow-400">{project.developer?.rating || 5.0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/developers/${project.developer?.id || ""}`} className="flex-1">
                      <Button variant="outline" className="w-full border-2 border-white/20 text-blue-200 hover:bg-white/10 hover:border-blue-400/50 backdrop-blur-sm">
                        View Profile
                      </Button>
                    </Link>
                    <Link to={`/contact?developer=${encodeURIComponent(project.developer?.name || "")}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg">
                        Contact
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Card */}
              <Card className="shadow-lg border-2 border-white/10 bg-slate-800/40 backdrop-blur-md">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border-b-2 border-white/10">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {project.documents.length ? (
                    project.documents.map((doc, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-3 border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-lg hover:border-blue-400/50 hover:bg-blue-500/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg group-hover:bg-blue-500/30 border border-blue-400/30 transition-colors">
                            <FileText className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">
                              {doc.name || doc.filename || `Document ${idx + 1}`}
                            </div>
                            <div className="text-xs text-blue-300">{doc.size || ""}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={doc.href || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 text-blue-400" />
                          </a>
                          <a 
                            href={doc.href || "#"} 
                            download
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4 text-blue-300" />
                          </a>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-blue-300">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-blue-400/50" />
                      <p className="text-sm">No documents available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Modern Tabs Section */}
      <section className="py-12 bg-gradient-to-b from-slate-900/50 to-slate-900/80 backdrop-blur-md relative z-10">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <Tabs value={selectedTab} onValueChange={onTabChange} className="space-y-8">
            {/* Enhanced Tab List */}
            <div className="sticky top-[72px] bg-slate-900/95 backdrop-blur-xl py-4 z-40 -mx-4 px-4 border-b-2 border-white/10 shadow-xl">
              <TabsList className="flex flex-wrap gap-2 justify-start bg-transparent">
                {[
                  { id: "overview", icon: Info, label: "Overview" },
                  { id: "details", icon: FileText, label: "Details" },
                  { id: "financials", icon: DollarSign, label: "Financials" },
                  { id: "timeline", icon: Calendar, label: "Timeline" },
                  { id: "documents", icon: FilePlus, label: "Documents" },
                  { id: "updates", icon: Sparkles, label: "Updates" },
                  { id: "team", icon: Users, label: "Team" },
                  { id: "location", icon: MapPin, label: "Location" },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`group relative px-5 py-2.5 rounded-xl font-semibold transition-all ${
                        selectedTab === tab.id
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-lg shadow-yellow-500/30"
                          : "bg-white/5 backdrop-blur-sm text-blue-200 hover:bg-white/10 hover:text-white border border-white/10 hover:border-blue-400/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2 inline" />
                      {tab.label}
                      {selectedTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6">
                    <CardTitle className="text-slate-900 text-2xl flex items-center gap-2 font-bold">
                      <Info className="h-6 w-6" />
                      Project Overview
                    </CardTitle>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-blue-200 text-lg leading-relaxed">{project.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t-2 border-white/10">
                      {/* Investment Highlights */}
                      <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-2xl border-2 border-blue-400/30 backdrop-blur-sm">
                        <h4 className="font-bold text-lg mb-4 text-blue-100 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-yellow-400" />
                          Investment Highlights
                        </h4>
                        <ul className="space-y-3">
                          {(project.highlights || [
                            "Prime location with high demand",
                            "Experienced developer team",
                            "Projected strong returns",
                            "Transparent funding process"
                          ]).map((h, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3 text-blue-100"
                            >
                              <div className="p-1 bg-blue-500/30 rounded-full mt-0.5 border border-blue-400/50">
                                <CheckCircle className="h-4 w-4 text-blue-300" />
                              </div>
                              <span className="flex-1">{h}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Metrics */}
                      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-2xl border-2 border-purple-400/30 backdrop-blur-sm">
                        <h4 className="font-bold text-lg mb-4 text-purple-100 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-yellow-400" />
                          Key Metrics
                        </h4>
                        <div className="space-y-4">
                          {[
                            { label: "Expected Yield", value: `${project.expectedYield}%`, icon: TrendingUp, color: "text-yellow-400" },
                            { label: "Min Investment", value: money(project.minimumInvestment), icon: DollarSign, color: "text-blue-400" },
                            { label: "Target Funding", value: money(project.targetFunding), icon: Target, color: "text-cyan-400" },
                            { label: "Timeline", value: project.timeline || "TBD", icon: Clock, color: "text-purple-400" },
                          ].map((metric, i) => {
                            const Icon = metric.icon;
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-400/50 transition-colors"
                              >
                                <span className="flex items-center gap-2 text-blue-100">
                                  <Icon className={`h-4 w-4 ${metric.color}`} />
                                  {metric.label}
                                </span>
                                <strong className={`font-bold ${metric.color}`}>{metric.value}</strong>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Categories & Tags */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t-2 border-white/10">
                      {(project.categories || []).map((cat, i) => (
                        <Badge key={i} className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-yellow-300 px-3 py-1 font-semibold">
                          {cat}
                        </Badge>
                      ))}
                      {(project.tags || []).map((tag, i) => (
                        <Badge key={i} variant="outline" className="border-blue-400/50 text-blue-300 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-blue-400">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6">
                    <CardTitle className="text-slate-900 text-2xl flex items-center gap-2 font-bold">
                      <FileText className="h-6 w-6" />
                      Project Details
                    </CardTitle>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border-2 border-blue-400/30 backdrop-blur-sm">
                          <div className="text-sm text-blue-300 font-semibold mb-1">Project Type</div>
                          <div className="text-lg font-bold text-white">{project.type || "Real Estate"}</div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-xl border-2 border-emerald-400/30 backdrop-blur-sm">
                          <div className="text-sm text-emerald-300 font-semibold mb-1">Funding Target</div>
                          <div className="text-lg font-bold text-white">{money(project.targetFunding)}</div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border-2 border-purple-400/30 backdrop-blur-sm">
                          <div className="text-sm text-purple-300 font-semibold mb-1">Minimum Investment</div>
                          <div className="text-lg font-bold text-white">{money(project.minimumInvestment)}</div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm">
                          <div className="text-sm text-yellow-300 font-semibold mb-1">Expected Yield</div>
                          <div className="text-lg font-bold text-white">{project.expectedYield}% annually</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10 hover:border-blue-400/50 transition-colors">
                          <div className="text-sm text-blue-300 font-semibold mb-1">Location</div>
                          <div className="text-lg font-bold text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-yellow-400" />
                            {project.location}
                          </div>
                        </div>

                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10 hover:border-blue-400/50 transition-colors">
                          <div className="text-sm text-blue-300 font-semibold mb-1">Timeline</div>
                          <div className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="h-5 w-5 text-cyan-400" />
                            {project.timeline || "To be determined"}
                          </div>
                        </div>

                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10 hover:border-blue-400/50 transition-colors">
                          <div className="text-sm text-blue-300 font-semibold mb-1">Current Investors</div>
                          <div className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-400" />
                            {project.investors || 0} Investors
                          </div>
                        </div>

                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10 hover:border-blue-400/50 transition-colors">
                          <div className="text-sm text-blue-300 font-semibold mb-1">Status</div>
                          <div className="text-lg font-bold text-white capitalize flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-green-500" />
                            {project.fundingStatus || "Active"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <div className="mt-6 pt-6 border-t-2">
                        <h4 className="font-bold text-lg mb-3">Full Description</h4>
                        <p className="text-slate-700 leading-relaxed">{project.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="financials">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                    <CardTitle className="text-slate-900 text-2xl flex items-center gap-2 font-bold">
                      <DollarSign className="h-6 w-6" />
                      Returns Calculator
                    </CardTitle>
                    <p className="text-slate-800 mt-2 font-medium">Calculate your potential returns</p>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-semibold text-blue-200 mb-2 block">
                          Investment Amount (₵)
                        </Label>
                        <Input
                          type="number"
                          defaultValue={project.minimumInvestment}
                          id="calc-amount"
                          className="text-lg font-bold border-2 border-white/10 bg-white/5 backdrop-blur-sm text-white focus:border-yellow-400 focus:bg-white/10"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-blue-200 mb-2 block">
                          Investment Period (Years)
                        </Label>
                        <Input
                          type="number"
                          defaultValue={3}
                          min={1}
                          id="calc-years"
                          className="text-lg font-bold border-2 border-white/10 bg-white/5 backdrop-blur-sm text-white focus:border-yellow-400 focus:bg-white/10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => {
                          const amount = Number(document.getElementById("calc-amount")?.value || project.minimumInvestment);
                          const years = Number(document.getElementById("calc-years")?.value || 3);
                          const res = calcNetReturn(amount, project.expectedYield, years);
                          toast({
                            title: "Investment Projection",
                            description: `After ${years} year(s): Total Value = ${money(res.gross)} | Profit = ${money(res.profit)}`,
                            duration: 5000,
                          });
                        }}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold py-6 shadow-lg shadow-yellow-500/30"
                      >
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Calculate Returns
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (document.getElementById("calc-amount")) document.getElementById("calc-amount").value = project.minimumInvestment;
                          if (document.getElementById("calc-years")) document.getElementById("calc-years").value = 3;
                          toast({ title: "Reset", description: "Calculator reset to defaults." });
                        }}
                        className="px-8 border-2 border-white/10 bg-white/5 backdrop-blur-sm text-blue-200 hover:bg-white/10 hover:border-blue-400/50"
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border-2 border-blue-400/30 backdrop-blur-sm">
                      <h4 className="font-bold text-blue-100 mb-3 flex items-center gap-2">
                        <Info className="h-5 w-5 text-yellow-400" />
                        Expected Returns Overview
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[1, 3, 5].map((years) => {
                          const result = calcNetReturn(project.minimumInvestment, project.expectedYield, years);
                          return (
                            <div key={years} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                              <div className="text-xs text-blue-300 mb-1">{years} Year{years > 1 ? 's' : ''}</div>
                              <div className="text-lg font-bold text-white">{money(result.gross)}</div>
                              <div className="text-xs text-emerald-400 font-medium">+{money(result.profit)} profit</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <CardTitle className="text-white text-2xl flex items-center gap-2 font-bold">
                      <FilePlus className="h-6 w-6" />
                      Project Documents
                    </CardTitle>
                    <p className="text-indigo-100 mt-2 font-medium">Download important project files</p>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid gap-4">
                      {project.documents.length ? (
                        project.documents.map((doc, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex items-center justify-between p-5 border-2 border-white/10 rounded-xl hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all bg-gradient-to-r from-white/5 to-slate-800/50 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-500/20 group-hover:bg-blue-500/30 rounded-xl transition-colors border border-blue-400/30">
                                <FileText className="h-6 w-6 text-blue-300" />
                              </div>
                              <div>
                                <div className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                                  {doc.name || doc.filename || `Document ${idx + 1}`}
                                </div>
                                <div className="text-sm text-blue-200">{doc.size || "Unknown size"}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={doc.href || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn"
                              >
                                <ExternalLink className="h-5 w-5 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                              </a>
                              <a
                                href={doc.href || "#"}
                                download
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors group/btn"
                              >
                                <Download className="h-5 w-5 text-green-600 group-hover/btn:scale-110 transition-transform" />
                              </a>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-16 text-slate-500">
                          <FileText className="h-20 w-20 mx-auto mb-4 text-slate-300" />
                          <p className="text-lg font-medium">No documents available yet.</p>
                          <p className="text-sm mt-2">Check back later for project documentation.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
                    <CardTitle className="text-white text-2xl flex items-center gap-2 font-bold">
                      <Calendar className="h-6 w-6" />
                      Project Timeline & Milestones
                    </CardTitle>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {project.milestones.length ? (
                        project.milestones.map((m, index) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 pb-8 border-l-4 border-blue-400/50 last:pb-0"
                          >
                            <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-slate-800 shadow-lg shadow-yellow-500/30" />
                            <div className="bg-gradient-to-br from-white/5 to-slate-800/50 backdrop-blur-sm p-5 rounded-xl border-2 border-white/10 hover:border-blue-400/50 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-lg text-white">{m.title}</h4>
                                <Badge className={`${
                                  m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' :
                                  m.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border-blue-400/50' :
                                  'bg-white/10 text-blue-200 border-white/20'
                                } border-2 backdrop-blur-sm`}>
                                  {m.status || "Planned"}
                                </Badge>
                              </div>
                              {m.description && (
                                <p className="text-sm text-blue-200 mb-2">{m.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-blue-300">
                                <Clock className="h-3 w-3" />
                                <span>{m.months} months</span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-blue-200">
                          <Calendar className="h-16 w-16 mx-auto mb-4 text-blue-400/50" />
                          <p>No milestones available yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Updates Tab */}
            <TabsContent value="updates">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6">
                    <CardTitle className="text-slate-900 text-2xl flex items-center gap-2 font-bold">
                      <Sparkles className="h-6 w-6" />
                      Project Updates
                    </CardTitle>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {project.updates.length ? (
                        project.updates.map((u, index) => (
                          <motion.article
                            key={u.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-l-4 border-amber-400/70 pl-6 py-4 bg-gradient-to-r from-amber-900/30 to-transparent backdrop-blur-sm rounded-r-lg hover:from-amber-900/40 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-bold text-lg text-white">{u.title}</h4>
                              <div className="text-xs text-blue-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                                {u.date || new Date(u.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-blue-200 leading-relaxed">{u.content}</p>
                          </motion.article>
                        ))
                      ) : (
                        <div className="text-center py-12 text-blue-200">
                          <Sparkles className="h-16 w-16 mx-auto mb-4 text-blue-400/50" />
                          <p>No updates yet. Check back soon!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
                    <CardTitle className="text-white text-2xl flex items-center gap-2 font-bold">
                      <Users className="h-6 w-6" />
                      Project Team
                    </CardTitle>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.team.map((member, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-5 border-2 border-white/10 rounded-2xl hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all bg-gradient-to-br from-white/5 to-slate-800/50 backdrop-blur-sm"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg shadow-yellow-500/30">
                            {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-white">{member.name}</div>
                            <div className="text-sm text-blue-200">{member.role}</div>
                            {member.company && (
                              <div className="text-xs text-blue-300 mt-1 flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {member.company}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-2 border-white/10 overflow-hidden bg-slate-800/40 backdrop-blur-md">
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
                    <CardTitle className="text-white text-2xl flex items-center gap-2 font-bold">
                      <MapPin className="h-6 w-6" />
                      Project Location
                    </CardTitle>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-900/30 to-rose-900/30 border-2 border-red-400/30 rounded-xl backdrop-blur-sm">
                      <div className="p-3 bg-red-500/30 rounded-full border border-red-400/50">
                        <MapPin className="h-6 w-6 text-red-300" />
                      </div>
                      <div>
                        <div className="text-sm text-red-300 font-semibold">Location</div>
                        <div className="text-lg font-bold text-white">{project.location}</div>
                      </div>
                    </div>

                    <div className="w-full h-96 bg-slate-900/50 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 backdrop-blur-sm">
                      <iframe
                        title="Project location"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(project.location)}&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={project.images[galleryIndex]}
              alt="lightbox"
              className="max-w-[90%] max-h-[90%] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
              {galleryIndex + 1} / {project.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Investment Modal */}
      <Dialog open={isInvestModalOpen} onOpenChange={(open) => { setIsInvestModalOpen(open); if (!open) { setInvestmentAmount(""); setPaymentMethod(""); } }}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-xl max-w-lg border-2 border-white/10 shadow-2xl">
          <DialogHeader className="border-b-2 border-white/10 pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg shadow-lg shadow-yellow-500/30">
                <TrendingUp className="h-6 w-6 text-slate-900" />
              </div>
              Invest in {project.title}
            </DialogTitle>
            <p className="text-sm text-blue-200 mt-2">
              Minimum investment: {money(project.minimumInvestment)}
            </p>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Amount Input */}
            <div>
              <Label className="text-sm font-semibold text-blue-200 mb-2 block flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                Investment Amount (₵)
              </Label>
              <Input
                type="number"
                min={project.minimumInvestment}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder={`Min: ${project.minimumInvestment}`}
                className="text-lg font-bold border-2 border-white/10 bg-white/5 backdrop-blur-sm text-white focus:border-yellow-400 focus:bg-white/10 h-12"
              />
              {investmentAmount && Number(investmentAmount) >= project.minimumInvestment && (
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Valid amount
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-sm font-semibold text-blue-200 mb-2 block flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-12 border-2 border-white/10 bg-white/5 backdrop-blur-sm text-white focus:border-yellow-400">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white">
                  <SelectItem value="momo" className="focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      Mobile Money
                    </div>
                  </SelectItem>
                  <SelectItem value="bank" className="focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="card" className="focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      Debit / Credit Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            {investmentAmount && paymentMethod && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl border-2 border-blue-400/30 backdrop-blur-sm"
              >
                <h4 className="font-bold text-blue-100 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-yellow-400" />
                  Investment Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Amount:</span>
                    <span className="font-bold text-white">{money(Number(investmentAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Payment:</span>
                    <span className="font-bold text-white capitalize">{paymentMethod.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-400/30">
                    <span className="text-blue-200">Expected Yield:</span>
                    <span className="font-bold text-emerald-400">{project.expectedYield}% annually</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-white/10">
            <Button
              variant="outline"
              onClick={() => setIsInvestModalOpen(false)}
              className="flex-1 h-12 border-2 border-white/10 bg-white/5 backdrop-blur-sm text-blue-200 hover:bg-white/10 hover:border-blue-400/50"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold h-12 shadow-lg shadow-yellow-500/30"
              onClick={confirmInvestment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Investment
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}