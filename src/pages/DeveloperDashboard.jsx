import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { 
  DollarSign, CreditCard, Layers, PieChart, Plus, TrendingUp, Users, Target, 
  Wallet, Download, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, 
  AlertCircle, Search, Filter, SortAsc, Edit, Trash2, Eye, Copy, Archive, Upload,
  MessageSquare, BarChart3, Award, Shield, FileText, Video, Image as ImageIcon,
  Bell, Settings, HelpCircle, BookOpen, Sparkles, Star, Trophy, Crown, Zap,
  Calendar, MapPin, Building2, Home, FileCheck, ChevronRight, Activity, Percent,
  Send, ThumbsUp, MessageCircle, Share2, RefreshCw, Lock, User, Mail, Phone,
  Globe, Camera, X, Check, AlertTriangle, Loader2, TrendingDown, PieChartIcon,
  LineChart, BarChart2, Map, Milestone, Users2, UserPlus, ShieldCheck, Briefcase,
  Package, Tag, Hash, FileSpreadsheet, Newspaper, PlayCircle, GraduationCap, Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * DeveloperDashboard - Premium Fintech Edition
 * 
 * Complete real estate developer management platform with:
 * - Welcome card with trust badge
 * - Funding overview with KPIs
 * - Wallet management with withdrawals
 * - Project status breakdown
 * - Quick stats graphs with animated charts
 * - Comprehensive project management
 * - Multi-step project creation wizard
 * - Investor engagement panel
 * - Analytics & insights dashboard
 * - Verification & compliance center
 * - Team collaboration
 * - Notifications center
 * - Learning & support
 * - Settings & profile
 * - Developer trust level system
 */

export default function DeveloperDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // UI State
  const [activeView, setActiveView] = useState("overview"); // overview, projects, analytics, wallet, engagement, compliance, team, support, settings
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Data State
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRaised: 0,
    activeInvestors: 0,
    totalROI: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    funded: 0
  });
  const [wallet, setWallet] = useState({
    balance: 0,
    pendingPayouts: 0,
    transactions: []
  });
  const [projects, setProjects] = useState([]);
  const [fundingTrends, setFundingTrends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [trustLevel, setTrustLevel] = useState({ level: "Starter", points: 0, nextLevel: 100 });
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!user || !token)) {
      navigate("/login");
    } else if (!authLoading && user?.user_type !== "developer") {
      navigate("/");
    }
  }, [user, token, authLoading, navigate]);

  // Fetch all data
  const fetchDashboardData = useCallback(async () => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await api.get("/developer/stats");
      if (statsRes?.data) {
        setStats({
          totalProjects: statsRes.data.total_projects || 0,
          totalRaised: statsRes.data.total_raised || 0,
          activeInvestors: statsRes.data.active_investors || 0,
          totalROI: statsRes.data.total_roi || 0,
          approved: statsRes.data.approved_projects || 0,
          pending: statsRes.data.pending_projects || 0,
          rejected: statsRes.data.rejected_projects || 0,
          funded: statsRes.data.funded_projects || 0
        });
      }
      
      // Fetch projects
      const projectsRes = await api.get("/developer/projects");
      if (projectsRes?.data) {
        setProjects(projectsRes.data.projects || projectsRes.data || []);
      }
      
      // Fetch wallet
      const walletRes = await api.get("/developer/wallet");
      if (walletRes?.data) {
        setWallet({
          balance: walletRes.data.balance || 0,
          pendingPayouts: walletRes.data.pending_payouts || 0,
          transactions: walletRes.data.transactions || []
        });
      }
      
      // Fetch funding trends
      const trendsRes = await api.get("/developer/funding-trends");
      if (trendsRes?.data) {
        setFundingTrends(trendsRes.data.trends || []);
      }
      
      // Fetch notifications
      const notifRes = await api.get("/developer/notifications");
      if (notifRes?.data) {
        setNotifications(notifRes.data.notifications || []);
      }
      
      // Fetch trust level
      const trustRes = await api.get("/developer/trust-level");
      if (trustRes?.data) {
        setTrustLevel(trustRes.data);
      }
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (user && token && user.user_type === "developer") {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user, token]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(p => p.approval_status === filterStatus);
    }
    
    // Sort
    if (sortBy === "recent") {
      filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "funded") {
      filtered = [...filtered].sort((a, b) => (b.current_funding || 0) - (a.current_funding || 0));
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    
    return filtered;
  }, [projects, searchQuery, filterStatus, sortBy]);

  // Trust level badge color
  const getTrustBadgeColor = (level) => {
    switch(level) {
      case "Elite": return "from-yellow-400 to-amber-500";
      case "Premium": return "from-purple-400 to-pink-500";
      case "Verified": return "from-blue-400 to-cyan-500";
      default: return "from-slate-400 to-slate-500";
    }
  };

  // Trust level icon
  const getTrustIcon = (level) => {
    switch(level) {
      case "Elite": return Crown;
      case "Premium": return Trophy;
      case "Verified": return Award;
      default: return Star;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-yellow-400 mb-4" />
          <p className="text-blue-200">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Global fintech background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10">
        {/* Top Navigation */}
        <nav className="bg-slate-800/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2">
                  <Building2 className="w-8 h-8 text-yellow-400" />
                  <span className="text-xl font-black text-white">CrowdBricks</span>
                </Link>
                <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30">
                  Developer Portal
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5 text-white" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-white/20">
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-3">Notifications</h3>
                      <ScrollArea className="h-64">
                        {notifications.slice(0, 5).map((notif, idx) => (
                          <div key={idx} className={cn(
                            "p-3 rounded-lg mb-2 border",
                            notif.read ? "bg-slate-700/30 border-white/5" : "bg-blue-500/10 border-blue-400/30"
                          )}>
                            <p className="text-sm text-white font-medium">{notif.title}</p>
                            <p className="text-xs text-blue-200 mt-1">{notif.message}</p>
                            <p className="text-xs text-blue-300 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </ScrollArea>
                      <Button variant="link" className="w-full mt-2 text-yellow-400">
                        View All
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 border-2 border-yellow-400">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900">
                          {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium hidden md:block">
                        {user?.first_name} {user?.last_name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-white/20">
                    <DropdownMenuItem onClick={() => setActiveView("settings")}>
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveView("support")}>
                      <HelpCircle className="w-4 h-4 mr-2" /> Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/logout")}>
                      <ArrowDownRight className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <aside className={cn(
              "col-span-12 lg:col-span-2 space-y-2",
              sidebarCollapsed && "lg:col-span-1"
            )}>
              <nav className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 sticky top-24">
                <div className="space-y-1">
                  {[
                    { id: "overview", icon: BarChart3, label: "Overview" },
                    { id: "projects", icon: Layers, label: "Projects" },
                    { id: "wallet", icon: Wallet, label: "Wallet" },
                    { id: "analytics", icon: TrendingUp, label: "Analytics" },
                    { id: "engagement", icon: MessageSquare, label: "Engagement" },
                    { id: "compliance", icon: ShieldCheck, label: "Compliance" },
                    { id: "team", icon: Users2, label: "Team" },
                    { id: "support", icon: Headphones, label: "Support" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          activeView === item.id
                            ? "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-yellow-400 border border-yellow-400/30"
                            : "text-blue-200 hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="col-span-12 lg:col-span-10 space-y-6">
              {/* OVERVIEW VIEW */}
              {activeView === "overview" && (
                <OverviewView 
                  user={user} 
                  stats={stats} 
                  wallet={wallet} 
                  trustLevel={trustLevel}
                  fundingTrends={fundingTrends}
                  getTrustBadgeColor={getTrustBadgeColor}
                  getTrustIcon={getTrustIcon}
                  setShowProjectWizard={setShowProjectWizard}
                />
              )}
              
              {/* PROJECTS VIEW */}
              {activeView === "projects" && (
                <ProjectsView 
                  projects={filteredProjects}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  setShowProjectWizard={setShowProjectWizard}
                  onRefresh={fetchDashboardData}
                />
              )}
              
              {/* WALLET VIEW */}
              {activeView === "wallet" && (
                <WalletView 
                  wallet={wallet}
                  setShowWithdrawModal={setShowWithdrawModal}
                  onRefresh={fetchDashboardData}
                />
              )}
              
              {/* ANALYTICS VIEW */}
              {activeView === "analytics" && (
                <AnalyticsView 
                  projects={projects}
                  stats={stats}
                  fundingTrends={fundingTrends}
                />
              )}
              
              {/* ENGAGEMENT VIEW */}
              {activeView === "engagement" && (
                <EngagementView projects={projects} />
              )}
              
              {/* COMPLIANCE VIEW */}
              {activeView === "compliance" && (
                <ComplianceView user={user} />
              )}
              
              {/* TEAM VIEW */}
              {activeView === "team" && (
                <TeamView />
              )}
              
              {/* SUPPORT VIEW */}
              {activeView === "support" && (
                <SupportView />
              )}
              
              {/* SETTINGS VIEW */}
              {activeView === "settings" && (
                <SettingsView user={user} />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Project Creation Wizard Modal */}
      <ProjectWizardDialog 
        open={showProjectWizard} 
        onOpenChange={setShowProjectWizard}
        onComplete={fetchDashboardData}
      />
      
      {/* Withdraw Modal */}
      <WithdrawDialog 
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        wallet={wallet}
        onComplete={fetchDashboardData}
      />
    </div>
  );
}

// ==================== VIEW COMPONENTS ====================

/**
 * Overview View - Main Dashboard
 * Welcome card, funding overview, wallet snapshot, project status, quick stats
 */
function OverviewView({ user, stats, wallet, trustLevel, fundingTrends, getTrustBadgeColor, getTrustIcon, setShowProjectWizard }) {
  const TrustIcon = getTrustIcon(trustLevel.level);
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-slate-800/60 backdrop-blur-md rounded-2xl p-8 border-2 border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white">
                Welcome back, {user?.first_name}!
              </h1>
              <Badge className={cn(
                "bg-gradient-to-r text-slate-900 font-bold flex items-center gap-1",
                getTrustBadgeColor(trustLevel.level)
              )}>
                <TrustIcon className="w-4 h-4" />
                {trustLevel.level} Developer
              </Badge>
            </div>
            <p className="text-xl text-blue-200 mb-4">
              You've raised <span className="text-yellow-400 font-bold">₵{stats.totalRaised.toLocaleString()}</span> so far.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Trust Score: {trustLevel.points}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Target className="w-4 h-4 text-yellow-400" />
                <span>{trustLevel.points}/{trustLevel.nextLevel} to {trustLevel.nextLevel === 100 ? "Verified" : trustLevel.nextLevel === 500 ? "Premium" : "Elite"}</span>
              </div>
            </div>
            <Progress value={(trustLevel.points / trustLevel.nextLevel) * 100} className="mt-3 h-2 bg-white/10" />
          </div>
          
          <Button 
            onClick={() => setShowProjectWizard(true)}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold shadow-lg shadow-yellow-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Funding Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Layers} 
          label="Total Projects" 
          value={stats.totalProjects} 
          trend={+12}
          iconColor="text-blue-400"
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Raised" 
          value={`₵${stats.totalRaised.toLocaleString()}`} 
          trend={+25}
          iconColor="text-yellow-400"
        />
        <StatCard 
          icon={Users} 
          label="Active Investors" 
          value={stats.activeInvestors} 
          trend={+8}
          iconColor="text-purple-400"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Total ROI Delivered" 
          value={`${stats.totalROI}%`} 
          trend={+3}
          iconColor="text-green-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Snapshot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Wallet className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Wallet</h3>
              <p className="text-sm text-blue-200">Available balance</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-black text-white mb-1">₵{wallet.balance.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span>Pending: ₵{wallet.pendingPayouts.toLocaleString()}</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold">
              <Download className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
            
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </motion.div>

        {/* Project Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-yellow-400" />
            Project Status Breakdown
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-black text-green-400">{stats.approved}</span>
              </div>
              <p className="text-sm text-green-300 font-medium">Approved</p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-black text-yellow-400">{stats.pending}</span>
              </div>
              <p className="text-sm text-yellow-300 font-medium">Pending</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-black text-red-400">{stats.rejected}</span>
              </div>
              <p className="text-sm text-red-300 font-medium">Rejected</p>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-black text-blue-400">{stats.funded}</span>
              </div>
              <p className="text-sm text-blue-300 font-medium">Fully Funded</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-yellow-400" />
            Funding Trends (Last 30 Days)
          </h3>
          <Button variant="ghost" size="sm" className="text-blue-200">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2">
          {fundingTrends.length > 0 ? (
            fundingTrends.map((trend, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-yellow-400 to-amber-500 rounded-t-lg transition-all hover:from-yellow-500 hover:to-amber-600"
                  style={{ height: `${(trend.amount / Math.max(...fundingTrends.map(t => t.amount))) * 100}%` }}
                ></div>
                <span className="text-xs text-blue-200">{trend.day}</span>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-200">
              <p>No funding data available</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-yellow-400" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {[
            { type: "investment", project: "Sunrise Apartments", amount: "₵50,000", investor: "John Doe", time: "2 hours ago", icon: DollarSign, color: "text-green-400" },
            { type: "approval", project: "Marina Heights", status: "Approved", time: "5 hours ago", icon: CheckCircle2, color: "text-blue-400" },
            { type: "comment", project: "Bay View Condos", message: "New investor question", time: "1 day ago", icon: MessageCircle, color: "text-purple-400" },
          ].map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all">
                <div className={cn("w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center", activity.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.project}</p>
                  <p className="text-sm text-blue-200">
                    {activity.amount || activity.status || activity.message}
                    {activity.investor && ` by ${activity.investor}`}
                  </p>
                </div>
                <span className="text-xs text-blue-300">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Projects View - Project Management
 */
function ProjectsView({ projects, searchQuery, setSearchQuery, filterStatus, setFilterStatus, sortBy, setSortBy, setShowProjectWizard, onRefresh }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">My Projects</h2>
          <p className="text-blue-200">{projects.length} total projects</p>
        </div>
        <Button 
          onClick={() => setShowProjectWizard(true)}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold shadow-lg shadow-yellow-500/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-4 border-2 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-blue-300"
              />
            </div>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="funded">Fully Funded</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="funded">Most Funded</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onView={() => {
              setSelectedProject(project);
              setShowProjectDetail(true);
            }}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-12 border-2 border-white/10 text-center">
          <Layers className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-blue-200 mb-6">Create your first project to start raising funds</p>
          <Button 
            onClick={() => setShowProjectWizard(true)}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Project Card Component
 */
function ProjectCard({ project, onView, onRefresh }) {
  const fundingPercentage = (project.current_funding / project.target_funding) * 100;
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-300 border-red-400/30">Rejected</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Draft</Badge>;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/10 hover:border-yellow-400/50 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.featured_image || project.image || "/placeholder-project.jpg"} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute top-3 left-3">
          {getStatusBadge(project.approval_status)}
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="bg-white/10 backdrop-blur-md hover:bg-white/20">
                <Edit className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-white/20">
              <DropdownMenuItem onClick={onView}>
                <Eye className="w-4 h-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" /> Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" /> Add Update
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {project.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
          <MapPin className="w-4 h-4 text-yellow-400" />
          <span>{project.location}</span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">Funding Progress</span>
            <span className="text-white font-bold">{Math.round(fundingPercentage)}%</span>
          </div>
          <Progress value={fundingPercentage} className="h-2 bg-white/10" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">₵{project.current_funding?.toLocaleString() || 0} raised</span>
            <span className="text-white font-bold">₵{project.target_funding?.toLocaleString() || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <Users className="w-4 h-4 text-purple-400" />
            <span>{project.investor_count || 0} investors</span>
          </div>
          <Button 
            onClick={onView}
            size="sm" 
            variant="ghost" 
            className="text-yellow-400 hover:text-yellow-300"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Stat Card Component with animation
 */
function StatCard({ icon: Icon, label, value, trend, iconColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10 hover:border-yellow-400/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <Badge className={cn(
            "flex items-center gap-1",
            trend > 0 ? "bg-green-500/20 text-green-300 border-green-400/30" : "bg-red-500/20 text-red-300 border-red-400/30"
          )}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </Badge>
        )}
      </div>
      
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-sm text-blue-200">{label}</p>
    </motion.div>
  );
}

// Placeholder components for other views (to be implemented with full features)
function WalletView({ wallet, setShowWithdrawModal, onRefresh }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Wallet & Financials</h2>
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border-2 border-white/10">
        <p className="text-blue-200">Wallet features coming soon...</p>
      </div>
    </div>
  );
}

function AnalyticsView({ projects, stats, fundingTrends }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Analytics & Insights</h2>
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border-2 border-white/10">
        <p className="text-blue-200">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
}

function EngagementView({ projects }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Investor Engagement</h2>
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border-2 border-white/10">
        <p className="text-blue-200">Engagement panel coming soon...</p>
      </div>
    </div>
  );
}

function ComplianceView({ user }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Verification & Compliance</h2>
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border-2 border-white/10">
        <p className="text-blue-200">Compliance center coming soon...</p>
      </div>
    </div>
  );
}

function TeamView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Team Collaboration</h2>
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border-2 border-white/10">
        <p className="text-blue-200">Team management coming soon...</p>
      </div>
    </div>
  );
}

function SupportView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Help & Support</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10">
          <BookOpen className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Knowledge Base</h3>
          <p className="text-blue-200 mb-4">Browse guides and tutorials</p>
          <Button variant="outline" className="border-white/20 text-white">
            Browse Articles
          </Button>
        </div>
        
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10">
          <Headphones className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Live Support</h3>
          <p className="text-blue-200 mb-4">Chat with our support team</p>
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold">
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ user }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Settings</h2>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800/40 border border-white/10">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">First Name</Label>
                  <Input defaultValue={user?.first_name} className="bg-white/5 border-white/20 text-white" />
                </div>
                <div>
                  <Label className="text-white">Last Name</Label>
                  <Input defaultValue={user?.last_name} className="bg-white/5 border-white/20 text-white" />
                </div>
              </div>
              <div>
                <Label className="text-white">Email</Label>
                <Input type="email" defaultValue={user?.email} className="bg-white/5 border-white/20 text-white" />
              </div>
              <div>
                <Label className="text-white">Bio</Label>
                <Textarea className="bg-white/5 border-white/20 text-white" rows={4} />
              </div>
              <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold">
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
            <p className="text-blue-200">Password and 2FA settings coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border-2 border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
            <p className="text-blue-200">Notification settings coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Project Wizard Dialog
 */
function ProjectWizardDialog({ open, onOpenChange, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  const steps = [
    { id: 1, title: "Basic Info", icon: FileText },
    { id: 2, title: "Financials", icon: DollarSign },
    { id: 3, title: "Media & Docs", icon: ImageIcon },
    { id: 4, title: "Timeline", icon: Calendar },
    { id: 5, title: "Review", icon: CheckCircle2 }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-900 border-white/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-white">Create New Project</DialogTitle>
          <DialogDescription className="text-blue-200">
            Follow the steps to create your real estate project
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.id}>
                <div className={cn(
                  "flex flex-col items-center gap-2",
                  step >= s.id ? "opacity-100" : "opacity-30"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                    step >= s.id 
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 border-yellow-400 text-slate-900" 
                      : "bg-slate-800 border-white/20 text-blue-200"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-center text-blue-200">{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 transition-all",
                    step > s.id ? "bg-yellow-400" : "bg-white/10"
                  )}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && <ProjectWizardStep1 formData={formData} setFormData={setFormData} />}
          {step === 2 && <ProjectWizardStep2 formData={formData} setFormData={setFormData} />}
          {step === 3 && <ProjectWizardStep3 formData={formData} setFormData={setFormData} />}
          {step === 4 && <ProjectWizardStep4 formData={formData} setFormData={setFormData} />}
          {step === 5 && <ProjectWizardStep5 formData={formData} />}
        </div>
        
        {/* Navigation */}
        <DialogFooter className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="border-white/20 text-white"
          >
            Previous
          </Button>
          
          {step < 5 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold"
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={() => {
                // Submit project
                onComplete();
                onOpenChange(false);
              }}
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Wizard step components (placeholder implementations)
function ProjectWizardStep1({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Project Name</Label>
        <Input 
          placeholder="e.g., Sunrise Apartments"
          className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
          value={formData.title || ""}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Project Type</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="mixed">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white">Location</Label>
          <Input 
            placeholder="City, Region"
            className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
            value={formData.location || ""}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label className="text-white">Description</Label>
        <Textarea 
          placeholder="Describe your project..."
          className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
          rows={6}
          value={formData.description || ""}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
    </div>
  );
}

function ProjectWizardStep2({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Funding Goal (₵)</Label>
          <Input 
            type="number"
            placeholder="500000"
            className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
            value={formData.target_funding || ""}
            onChange={(e) => setFormData({...formData, target_funding: e.target.value})}
          />
        </div>
        <div>
          <Label className="text-white">Minimum Investment (₵)</Label>
          <Input 
            type="number"
            placeholder="5000"
            className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
            value={formData.min_investment || ""}
            onChange={(e) => setFormData({...formData, min_investment: e.target.value})}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Expected ROI (%)</Label>
          <Input 
            type="number"
            placeholder="15"
            className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
            value={formData.expected_roi || ""}
            onChange={(e) => setFormData({...formData, expected_roi: e.target.value})}
          />
        </div>
        <div>
          <Label className="text-white">Duration (months)</Label>
          <Input 
            type="number"
            placeholder="24"
            className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
            value={formData.duration || ""}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
}

function ProjectWizardStep3({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Featured Image</Label>
        <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-yellow-400/50 transition-all cursor-pointer">
          <Upload className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <p className="text-blue-200 mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-blue-300">PNG, JPG up to 10MB</p>
        </div>
      </div>
      <div>
        <Label className="text-white">Gallery Images</Label>
        <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-yellow-400/50 transition-all cursor-pointer">
          <ImageIcon className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <p className="text-blue-200 mb-1">Upload multiple images</p>
          <p className="text-sm text-blue-300">PNG, JPG up to 10MB each</p>
        </div>
      </div>
      <div>
        <Label className="text-white">Documents (Land Title, Permits, etc.)</Label>
        <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-yellow-400/50 transition-all cursor-pointer">
          <FileText className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <p className="text-blue-200 mb-1">Upload legal documents</p>
          <p className="text-sm text-blue-300">PDF up to 25MB</p>
        </div>
      </div>
    </div>
  );
}

function ProjectWizardStep4({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Project Timeline</Label>
        <p className="text-sm text-blue-200 mb-3">Add construction phases and milestones</p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="Milestone name" className="bg-white/5 border-white/20 text-white" />
                <Input type="date" className="bg-white/5 border-white/20 text-white" />
                <Input placeholder="Budget" className="bg-white/5 border-white/20 text-white" />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 border-white/20 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>
    </div>
  );
}

function ProjectWizardStep5({ formData }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-blue-200 font-medium mb-1">Review Before Submission</p>
            <p className="text-sm text-blue-300">
              Please review all information carefully. Once submitted, the project will be sent for admin approval.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-white mb-2">Basic Information</h4>
          <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200">Project Name:</span>
              <span className="text-white font-medium">{formData.title || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Type:</span>
              <span className="text-white font-medium">{formData.type || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Location:</span>
              <span className="text-white font-medium">{formData.location || "N/A"}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-2">Financial Details</h4>
          <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200">Funding Goal:</span>
              <span className="text-white font-medium">₵{formData.target_funding?.toLocaleString() || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Minimum Investment:</span>
              <span className="text-white font-medium">₵{formData.min_investment?.toLocaleString() || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Expected ROI:</span>
              <span className="text-white font-medium">{formData.expected_roi}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Withdraw Dialog
 */
function WithdrawDialog({ open, onOpenChange, wallet, onComplete }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await api.post("/developer/withdraw", { amount });
      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Withdraw failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-white">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-blue-200">
            Available balance: ₵{wallet.balance.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-white">Withdrawal Amount (₵)</Label>
            <Input 
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-blue-300"
            />
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
            <p className="text-sm text-yellow-200">
              Withdrawals require admin approval and typically process within 2-3 business days.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-white/20 text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw}
            disabled={!amount || loading}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}