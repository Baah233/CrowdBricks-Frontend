import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart2,
  PieChart,
  Bell,
  Settings,
  User,
  DollarSign,
  CreditCard,
  Plus,
  Search,
  Sun,
  Moon,
  Eye,
  EyeOff,
  TrendingUp,
  Shield,
  Award,
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Target,
  Activity,
  Zap,
  Smartphone,
  Monitor,
  LogOut,
} from "lucide-react";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

import api, { supportTicketApi } from "@/lib/api"; // axios instance that attaches token
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ROIHeatmap } from "@/components/investor/ROIHeatmap";
import { RiskReturnQuadrant } from "@/components/investor/RiskReturnQuadrant";
import { ProjectWatchlist } from "@/components/investor/ProjectWatchlist";
import { InvestorBadges } from "@/components/investor/InvestorBadges";
import { LoginActivityLog } from "@/components/investor/LoginActivityLog";
import DividendTracker from "@/components/investor/DividendTracker";

/* ===== MOCKS (fallback) ===== */
const MOCK_STATS = {
  totalInvested: 1250000,
  totalReturns: 180000,
  activeProjects: 6,
  portfolioValue: 1430000,
};

const MOCK_INVESTMENTS = [
  { id: "P-001", title: "Accra Heights - Residential", projectId: "P-001", type: "Residential", invested: 50000, currentValue: 54000, progress: 78, status: "Funding", date: "2025-07-05" },
  { id: "P-002", title: "Tema Lakeside - Mixed use", projectId: "P-002", type: "Commercial", invested: 120000, currentValue: 131000, progress: 100, status: "Funded", date: "2024-11-21" },
  { id: "P-003", title: "Kumasi EcoHomes", projectId: "P-003", type: "Residential", invested: 7500, currentValue: 8200, progress: 45, status: "Funding", date: "2025-02-18" },
];

const MOCK_TRANSACTIONS = [
  { id: "T-9001", date: "2025-10-01", desc: "Invested in Accra Heights", amount: -50000, method: "MOMO" },
  { id: "T-9002", date: "2025-09-15", desc: "Return payout - Tema Lakeside", amount: 15000, method: "Bank" },
  { id: "T-9003", date: "2025-07-05", desc: "Invested in Kumasi EcoHomes", amount: -7500, method: "Card" },
];

const MOCK_PORTFOLIO_HISTORY = [
  { date: "2025-01", value: 800_000 },
  { date: "2025-02", value: 820_000 },
  { date: "2025-03", value: 860_000 },
  { date: "2025-04", value: 920_000 },
  { date: "2025-05", value: 980_000 },
  { date: "2025-06", value: 1_020_000 },
  { date: "2025-07", value: 1_080_000 },
  { date: "2025-08", value: 1_120_000 },
  { date: "2025-09", value: 1_250_000 },
  { date: "2025-10", value: 1_430_000 },
];

/* ===== small reusable components (in-file for portability) ===== */

function useInViewOnce(ref, opts = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, inView, opts]);
  return inView;
}

function AnimatedCounter({ value = 0, format = (v) => v.toLocaleString(), duration = 1200, play = true }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!play) return;
    let start = null;
    const animate = (t) => {
      if (!start) start = t;
      const progress = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(value * progress));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration, play]);
  return <>{format(display)}</>;
}

function StatCard({ title, icon, value, inViewRef, play, dark, format }) {
  // Default format adds cedi sign, but can be overridden (e.g., for count values)
  const defaultFormat = (v) => `₵${v.toLocaleString()}`;
  const formatFn = format || defaultFormat;
  
  return (
    <Card className={`p-4 ${dark ? "bg-slate-800 text-slate-100" : ""}`}>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>{title}</div>
          <div className="text-2xl font-bold" ref={inViewRef}>
            <AnimatedCounter value={value} format={formatFn} play={play} />
          </div>
        </div>
        <div className="text-blue-400">{icon}</div>
      </CardContent>
    </Card>
  );
}

function InvestmentRow({ it, dark }) {
  // Randomly assign verified status for demo (in production, this would come from the API)
  const isVerified = it.progress >= 50; // Projects with 50%+ progress are considered verified
  
  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg ${dark ? "bg-slate-800 text-slate-100 border-slate-700" : "bg-white"}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>{it.type} • {it.id}</div>
          {isVerified && (
            <Badge variant="success" className="text-xs flex items-center gap-1 bg-blue-500/20 text-blue-600 border-blue-600">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
        <div className="font-semibold mt-1">{it.title}</div>
      </div>
      <div className="text-right">
        <div className="font-medium">₵{(it.currentValue || it.invested || 0).toLocaleString()}</div>
        <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{it.progress ?? 0}% • {it.status}</div>
      </div>
    </div>
  );
}

function MobileNav({ active, onChange, dark }) {
  return (
    <nav className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:hidden ${dark ? "bg-slate-900/95" : "bg-white/95"} backdrop-blur rounded-full shadow-lg px-3 py-2 flex items-center justify-between`}>
      <button onClick={() => onChange("overview")} className={`flex-1 py-2 ${active === "overview" ? "text-blue-400 font-semibold" : "text-slate-400"}`}>Overview</button>
      <button onClick={() => onChange("portfolio")} className={`flex-1 py-2 ${active === "portfolio" ? "text-blue-400 font-semibold" : "text-slate-400"}`}>Portfolio</button>
      <button onClick={() => onChange("transactions")} className={`flex-1 py-2 ${active === "transactions" ? "text-blue-400 font-semibold" : "text-slate-400"}`}>Transactions</button>
      <button onClick={() => onChange("settings")} className={`flex-1 py-2 ${active === "settings" ? "text-blue-400 font-semibold" : "text-slate-400"}`}>Settings</button>
    </nav>
  );
}

/* ===== main page component ===== */

export default function InvestorDashboardFull() {
  const navigate = useNavigate();
  const location = useLocation();

  // theme preference key (persisted)
  const THEME_KEY = "cb_user_theme_pref";

  // theme state: read preference from localStorage. Default: light (user opt-in for dark)
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored === "dark";
      return false; // default light — user must toggle to enable dark
    } catch {
      return false;
    }
  });

  // apply theme class to html element for global dark mode usage and persist
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [dark]);

  // data states (try API, fall back to mock)
  const [stats, setStats] = useState(MOCK_STATS);
  const [investments, setInvestments] = useState(MOCK_INVESTMENTS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [history, setHistory] = useState(MOCK_PORTFOLIO_HISTORY);

  const [loading, setLoading] = useState(true);

  // Load support data on mount
  useEffect(() => {
    loadSupportTickets();
    loadUnreadSupportCount();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      loadUnreadSupportCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // wallet states
  const [wallet, setWallet] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [accountDetails, setAccountDetails] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  // security states
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // notifications states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // transaction filters
  const [transactionDateFilter, setTransactionDateFilter] = useState("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");

  // session management
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "Accra, Ghana", lastActive: "Active now", current: true },
    { id: 2, device: "Safari on iPhone", location: "Kumasi, Ghana", lastActive: "2 hours ago", current: false },
  ]);

  // profile edit states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // preferences states
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  // 2FA states
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Contact support states
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportCategory, setSupportCategory] = useState("general");
  const [supportLoading, setSupportLoading] = useState(false);
  
  // Support tickets list & conversation
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketConversation, setShowTicketConversation] = useState(false);
  const [ticketReply, setTicketReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);

  // ui states
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState(new URLSearchParams(location.search).get("tab") || "overview");

  // logged user
  const [user, setUser] = useState(null);

  // in-view refs for counters
  const investedRef = useRef();
  const returnsRef = useRef();
  const activeRef = useRef();
  const portfolioRef = useRef();

  const investedInView = useInViewOnce(investedRef);
  const returnsInView = useInViewOnce(returnsRef);
  const activeInView = useInViewOnce(activeRef);
  const portfolioInView = useInViewOnce(portfolioRef);

  // layout motion variant (declare before use)
  const sectionVariant = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  useEffect(() => {
    // Attempt to fetch profile first, then fetch dashboard data
    let mounted = true;

    async function loadProfileAndData() {
      // try to get user profile from backend (two endpoints attempted for compatibility)
      try {
        const [profileRes] = await Promise.allSettled([api.get("/user/profile")]);
        if (!mounted) return;

        let profile = null;
        if (profileRes.status === "fulfilled" && profileRes.value?.data) profile = profileRes.value.data;
        else {
          // fallback to locally stored user object
          try {
            profile = JSON.parse(localStorage.getItem("user"));
          } catch {
            profile = null;
          }
        }

        if (profile && mounted) {
          setUser(profile);
          // Set 2FA and preferences states
          setTwoFactorEnabled(profile.two_factor_enabled ?? false);
          setEmailNotifications(profile.email_notifications ?? true);
          setSmsNotifications(profile.sms_notifications ?? false);
        }
      } catch (err) {
        console.warn("Failed to fetch profile; falling back to local user", err);
        try {
          const local = JSON.parse(localStorage.getItem("user"));
          if (local && mounted) setUser(local);
        } catch {}
      }

      // then fetch dashboard data
      await refreshAll();
    }

    loadProfileAndData();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper: merge local fallback investments into main list (when backend not available)
  const mergeLocalFallbackInvestments = () => {
    try {
      const key = "cb_investments_v1";
      const local = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(local) || local.length === 0) return;
      const mapped = local.map((l) => ({
        id: l.id,
        title: l.projectTitle || `Project ${l.projectId}`,
        projectId: l.projectId,
        type: "Unknown",
        invested: l.amount,
        currentValue: l.amount,
        progress: 0,
        status: l.status || "pending",
        date: l.date,
      }));
      setInvestments((existing) => {
        const existingIds = new Set(existing.map((e) => e.id));
        const added = mapped.filter((m) => !existingIds.has(m.id));
        return [...added, ...existing];
      });
    } catch (e) {
      console.warn("Failed to merge local fallback investments", e);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const res = await api.get("/notifications");
      if (res?.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // central refresh fn — fetches from backend and merges local fallback
  const refreshAll = async () => {
    setLoading(true);
    try {
      const [sRes, invRes, txRes, histRes, walletRes] = await Promise.allSettled([
        api.get("/user/stats"),
        api.get("/user/investments"),
        api.get("/user/transactions"),
        api.get("/user/portfolio-history"),
        api.get("/wallet"),
      ]);

      if (sRes.status === "fulfilled" && sRes.value?.data) setStats((p) => ({ ...p, ...sRes.value.data }));
      if (invRes.status === "fulfilled" && Array.isArray(invRes.value?.data)) setInvestments(invRes.value.data);
      if (txRes.status === "fulfilled" && Array.isArray(txRes.value?.data)) {
        console.log("✅ Transactions loaded:", txRes.value.data.length, txRes.value.data);
        setTransactions(txRes.value.data);
      }
      if (histRes.status === "fulfilled" && Array.isArray(histRes.value?.data)) setHistory(histRes.value.data);
      if (walletRes.status === "fulfilled" && walletRes.value?.data?.wallet) setWallet(walletRes.value.data.wallet);
      
      // Fetch notifications
      await fetchNotifications();
    } catch (err) {
      console.warn("refreshAll error", err);
    } finally {
      mergeLocalFallbackInvestments();
      setLoading(false);
    }
  };

  useEffect(() => {
    // storage listener to pick up local fallback investments (ProjectDetails local save)
    const onStorage = (e) => {
      if (e.key === "cb_investments_v1") {
        mergeLocalFallbackInvestments();
      }
      if (e.key === "user" && e.newValue) {
        try {
          const u = JSON.parse(e.newValue);
          setUser(u);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    // refresh on focus
    const onFocus = () => {
      refreshAll();
      loadSupportTickets();
      loadUnreadSupportCount();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived totals and filtered list (client-side filter)
  const totalCurrentValue = useMemo(() => investments.reduce((s, i) => s + (i.currentValue || 0), 0), [investments]);
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return investments.filter((i) => {
      if (filter !== "all" && (i.status || "").toLowerCase() !== filter) return false;
      if (!q) return true;
      return (i.title || "").toLowerCase().includes(q) || String(i.id || "").toLowerCase().includes(q);
    });
  }, [investments, query, filter]);

  // CSV export
  const exportCSV = () => {
    const rows = [
      ["id", "title", "type", "invested", "currentValue", "status", "date"],
      ...investments.map((r) => [r.id, r.title, r.type, r.invested, r.currentValue, r.status, r.date]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crowdbricks_investments_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // small helpers
  const chartFormatter = (val) => `₵${Number(val).toLocaleString()}`;
  const money = (n) => typeof n === "number" ? `₵${n.toLocaleString()}` : n;

  // Calculate AI insights
  const getInsights = useMemo(() => {
    if (investments.length === 0) return null;
    
    // Find top performing investment
    const topPerformer = investments.reduce((best, curr) => {
      const currGrowth = curr.currentValue && curr.invested ? ((curr.currentValue - curr.invested) / curr.invested) * 100 : 0;
      const bestGrowth = best.currentValue && best.invested ? ((best.currentValue - best.invested) / best.invested) * 100 : 0;
      return currGrowth > bestGrowth ? curr : best;
    }, investments[0]);

    const topGrowth = topPerformer.currentValue && topPerformer.invested 
      ? ((topPerformer.currentValue - topPerformer.invested) / topPerformer.invested) * 100 
      : 0;

    // Calculate portfolio growth
    const totalInvested = investments.reduce((sum, i) => sum + (i.invested || 0), 0);
    const totalCurrent = investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
    const portfolioGrowth = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

    // Diversification score
    const types = [...new Set(investments.map(i => i.type))];
    const diversificationScore = Math.min(100, (types.length / 3) * 100);

    return {
      topPerformer,
      topGrowth: topGrowth.toFixed(1),
      portfolioGrowth: portfolioGrowth.toFixed(1),
      diversificationScore: diversificationScore.toFixed(0),
      recommendation: diversificationScore < 50 
        ? "Consider diversifying into more project types" 
        : portfolioGrowth > 10 
        ? "Your portfolio is performing excellently" 
        : "Your portfolio is stable and well-balanced"
    };
  }, [investments]);

  // Calculate risk score
  const getRiskScore = useMemo(() => {
    if (investments.length === 0) return { score: 0, level: "Low", color: "text-green-500" };
    
    const types = [...new Set(investments.map(i => i.type))];
    const diversification = types.length;
    const totalValue = investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
    const largestInvestment = Math.max(...investments.map(i => i.currentValue || 0));
    const concentration = totalValue > 0 ? (largestInvestment / totalValue) * 100 : 0;
    
    // Risk calculation: lower diversification + higher concentration = higher risk
    const riskScore = Math.min(100, (concentration * 0.6) + ((3 - diversification) * 13));
    
    let level = "Low";
    let color = "text-green-500";
    if (riskScore > 60) {
      level = "High";
      color = "text-red-500";
    } else if (riskScore > 30) {
      level = "Medium";
      color = "text-yellow-500";
    }
    
    return { score: riskScore.toFixed(0), level, color };
  }, [investments]);

  // Calculate profile completion
  const getProfileCompletion = useMemo(() => {
    const items = [
      { key: "name", label: "Full name", completed: !!user?.name },
      { key: "email", label: "Email verified", completed: !!user?.email_verified_at },
      { key: "phone", label: "Phone number", completed: !!user?.phone },
      { key: "investment", label: "First investment", completed: investments.length > 0 },
      { key: "wallet", label: "Wallet setup", completed: !!wallet },
    ];
    
    const completed = items.filter(i => i.completed).length;
    const percentage = Math.round((completed / items.length) * 100);
    
    return { percentage, items, completed, total: items.length };
  }, [user, investments, wallet]);

  // PDF Export for statements
  const exportPDF = () => {
    // Simple PDF generation using data URI
    const content = `
      CROWDBRICKS INVESTMENT STATEMENT
      Generated: ${new Date().toLocaleDateString()}
      
      PORTFOLIO SUMMARY
      Total Invested: ${money(stats.totalInvested)}
      Total Returns: ${money(stats.totalReturns)}
      Portfolio Value: ${money(stats.portfolioValue)}
      Active Projects: ${stats.activeProjects}
      
      INVESTMENTS
      ${investments.map(i => `
      ${i.title}
      - Invested: ${money(i.invested)}
      - Current Value: ${money(i.currentValue)}
      - Status: ${i.status}
      - Date: ${i.date}
      `).join('\n')}
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crowdbricks_statement_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      if (transactionTypeFilter !== "all") {
        // Filter by transaction type (deposit or withdrawal)
        if (t.type && t.type !== transactionTypeFilter) return false;
        
        // Fallback: Filter by amount sign if type field doesn't exist
        if (!t.type) {
          if (transactionTypeFilter === "deposit" && t.amount < 0) return false;
          if (transactionTypeFilter === "withdrawal" && t.amount >= 0) return false;
        }
      }
      
      if (transactionDateFilter !== "all") {
        const date = new Date(t.date);
        const now = new Date();
        const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (transactionDateFilter === "week" && daysDiff > 7) return false;
        if (transactionDateFilter === "month" && daysDiff > 30) return false;
        if (transactionDateFilter === "year" && daysDiff > 365) return false;
      }
      
      return true;
    });
    
    console.log("💰 Filtered transactions:", filtered.length, "| Type:", transactionTypeFilter, "| Date:", transactionDateFilter);
    return filtered;
  }, [transactions, transactionDateFilter, transactionTypeFilter]);

  // Mark notification as read
  const markNotificationRead = async (id) => {
    try {
      // Find the notification
      const notification = notifications.find(n => n.id === id);
      
      // Optimistically update UI
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      
      // If it's a support notification, navigate to support tab
      if (notification?.title === "New Support Response") {
        setTab("support");
        setShowNotifications(false);
      }
      
      // Call API (if it exists)
      try {
        await api.post(`/notifications/${id}/read`);
      } catch (err) {
        // Ignore API errors for local notifications
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Logout session
  const logoutSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // wallet handlers
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 1) {
      alert("Please enter a valid amount (minimum ₵1)");
      return;
    }
    
    setWalletLoading(true);
    try {
      await api.post("/wallet/deposit", {
        amount: parseFloat(depositAmount),
        payment_method: paymentMethod,
      });
      
      // Refresh wallet
      const walletRes = await api.get("/wallet");
      if (walletRes?.data?.wallet) setWallet(walletRes.data.wallet);
      
      // Reset form and close modal
      setDepositAmount("");
      setShowDepositModal(false);
      alert("Deposit successful! Your wallet has been credited.");
    } catch (err) {
      console.error("Deposit failed:", err);
      alert(err?.response?.data?.message || "Deposit failed. Please try again.");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 1) {
      alert("Please enter a valid amount (minimum ₵1)");
      return;
    }

    if (wallet && parseFloat(withdrawAmount) > wallet.balance) {
      alert("Insufficient balance. Please enter a lower amount.");
      return;
    }

    if (!accountDetails.trim()) {
      alert("Please enter your account details");
      return;
    }

    setWalletLoading(true);
    try {
      await api.post("/wallet/withdraw", {
        amount: parseFloat(withdrawAmount),
        payment_method: paymentMethod,
        account_details: {
          [paymentMethod === "momo" ? "phone" : "account_info"]: accountDetails.trim()
        },
      });
      
      // Refresh wallet
      const walletRes = await api.get("/wallet");
      if (walletRes?.data?.wallet) setWallet(walletRes.data.wallet);
      
      // Reset form and close modal
      setWithdrawAmount("");
      setAccountDetails("");
      setShowWithdrawModal(false);
      alert("Withdrawal request submitted successfully!");
    } catch (err) {
      console.error("Withdrawal failed:", err);
      console.error("Error response:", err?.response?.data);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || "Withdrawal failed. Please try again.";
      alert(errorMsg);
    } finally {
      setWalletLoading(false);
    }
  };

  // Profile edit handler
  const handleEditProfile = () => {
    setEditFirstName(user?.first_name || "");
    setEditLastName(user?.last_name || "");
    setEditPhone(user?.phone || "");
    setEditEmail(user?.email || "");
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async () => {
    if (!editFirstName || !editLastName || !editEmail) {
      alert("Please fill in all required fields");
      return;
    }

    setProfileLoading(true);
    try {
      const response = await api.put("/user/profile", {
        first_name: editFirstName,
        last_name: editLastName,
        phone: editPhone,
        email: editEmail,
      });

      // Update user state with the response data
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      
      // Update localStorage to persist changes
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setShowEditProfileModal(false);
      alert("Profile updated successfully!");
      
      // Reload to update all UI components
      window.location.reload();
    } catch (err) {
      console.error("Profile update failed:", err);
      const errorMsg = err?.response?.data?.message || "Failed to update profile";
      alert(errorMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Preferences handler
  const handleManagePreferences = () => {
    setEmailNotifications(user?.email_notifications ?? true);
    setSmsNotifications(user?.sms_notifications ?? false);
    setShowPreferencesModal(true);
  };

  const handleSavePreferences = async () => {
    setPreferencesLoading(true);
    try {
      await api.put("/user/preferences", {
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
      });

      // Update user state
      setUser({ 
        ...user, 
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications 
      });
      setShowPreferencesModal(false);
      alert("Preferences updated successfully!");
    } catch (err) {
      console.error("Preferences update failed:", err);
      alert("Failed to update preferences");
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Two-factor authentication handlers
  const handleEnableTwoFactor = async () => {
    setTwoFactorLoading(true);
    try {
      const response = await api.post("/user/2fa/enable");
      setTwoFactorSecret(response.data.secret);
      setTwoFactorEnabled(true);
      setUser({ ...user, two_factor_enabled: true });
      alert(`Two-factor authentication enabled! Your secret code is: ${response.data.secret}`);
    } catch (err) {
      console.error("2FA enable failed:", err);
      alert("Failed to enable two-factor authentication");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    if (!confirm("Are you sure you want to disable two-factor authentication?")) {
      return;
    }

    setTwoFactorLoading(true);
    try {
      await api.post("/user/2fa/disable");
      setTwoFactorEnabled(false);
      setTwoFactorSecret("");
      setUser({ ...user, two_factor_enabled: false });
      alert("Two-factor authentication disabled");
    } catch (err) {
      console.error("2FA disable failed:", err);
      alert("Failed to disable two-factor authentication");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setTwoFactorLoading(true);
    try {
      const response = await api.post("/user/2fa/verify", {
        code: twoFactorCode,
      });

      if (response.data.verified) {
        alert("Code verified successfully!");
        setTwoFactorCode("");
        setShowTwoFactorModal(false);
      }
    } catch (err) {
      console.error("2FA verification failed:", err);
      alert("Invalid verification code");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Contact support handler
  const handleSubmitSupport = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      alert("Please fill in both subject and message");
      return;
    }

    setSupportLoading(true);
    try {
      await supportTicketApi.submit({
        subject: supportSubject,
        message: supportMessage,
        category: supportCategory,
      });

      alert("Support ticket submitted successfully! Our team will contact you soon.");
      setSupportSubject("");
      setSupportMessage("");
      setSupportCategory("general");
      setShowSupportModal(false);
      
      // Reload tickets
      loadSupportTickets();
    } catch (err) {
      console.error("Support submission failed:", err);
      alert("Failed to submit support ticket. Please try again.");
    } finally {
      setSupportLoading(false);
    }
  };

  // Load support tickets
  const loadSupportTickets = async () => {
    try {
      const response = await supportTicketApi.getAll();
      setSupportTickets(response.data || []);
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    }
  };

  // Load unread support messages count
  const loadUnreadSupportCount = async () => {
    try {
      const response = await supportTicketApi.getUnreadCount();
      const newUnreadCount = response.data?.count || 0;
      const previousCount = unreadSupportCount;
      
      setUnreadSupportCount(newUnreadCount);
      
      // If count increased, add notification and show toast
      if (newUnreadCount > previousCount && newUnreadCount > 0) {
        const newNotification = {
          id: Date.now(),
          title: "New Support Response",
          message: `You have ${newUnreadCount} new response${newUnreadCount > 1 ? 's' : ''} from support team`,
          type: "info",
          read: false,
          timestamp: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show toast notification
        if (window.Notification && Notification.permission === "granted") {
          new Notification("CrowdBricks Support", {
            body: newNotification.message,
            icon: "/CB.png",
          });
        }
      }
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  // View ticket conversation
  const handleViewTicket = async (ticketId) => {
    try {
      const response = await supportTicketApi.getById(ticketId);
      setSelectedTicket(response.data);
      setShowTicketConversation(true);
      // Reload unread count after viewing
      loadUnreadSupportCount();
    } catch (err) {
      console.error("Failed to load ticket:", err);
      alert("Failed to load ticket details");
    }
  };

  // Reply to ticket
  const handleReplyToTicket = async () => {
    if (!ticketReply.trim() || !selectedTicket) return;

    setReplyLoading(true);
    try {
      await supportTicketApi.reply(selectedTicket.id, ticketReply);
      setTicketReply("");
      
      // Reload ticket to show new message
      const response = await supportTicketApi.getById(selectedTicket.id);
      setSelectedTicket(response.data);
      
      alert("Reply sent successfully!");
      loadSupportTickets();
    } catch (err) {
      console.error("Failed to send reply:", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }

    setSecurityLoading(true);
    try {
      await api.post("/user/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      
      // Reset form and close modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSecurityModal(false);
      alert("Password changed successfully!");
    } catch (err) {
      console.error("Password change failed:", err);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || "Password change failed. Please try again.";
      alert(errorMsg);
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${dark ? "bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 text-slate-100" : "bg-[#e6f7ff] text-slate-900"} transition-colors duration-300`}>
      {/* Topbar */}
      <header className={`sticky top-0 z-40 ${dark ? "bg-slate-900/60" : "bg-white/60"} backdrop-blur border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <img src="/CB.png" alt="CrowdBricks" className="h-8 object-contain" />
            <div className="hidden md:block">
              <div className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>Crowd<span className="text-yellow-400">Bricks</span></div>
              <div className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>Investor dashboard</div>
            </div>
          </div>

          <div className="flex-1 mx-4 hidden md:block max-w-2xl">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search investments, project IDs, locations..." className="rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                className={`p-2 rounded-md hover:bg-slate-100/10 ${dark ? "hover:bg-slate-700" : ""} relative`} 
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className={`absolute right-0 top-12 w-80 rounded-lg shadow-xl border z-50 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <Badge variant="secondary">{notifications.filter(n => !n.read).length} new</Badge>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-4 border-b ${dark ? "border-slate-700" : "border-slate-100"} hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${!notif.read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {notif.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                              {notif.type === "info" && <AlertCircle className="h-5 w-5 text-blue-500" />}
                              {notif.type === "warning" && <TrendingUp className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{notif.title}</div>
                              <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"} mt-1`}>{notif.message}</div>
                              <div className="text-xs text-slate-400 mt-1">{notif.time}</div>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="ghost" className="w-full text-sm" onClick={() => setShowNotifications(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <button
              className={`p-2 rounded-md hover:bg-slate-100/10 ${dark ? "hover:bg-slate-700" : ""}`}
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            <button className={`p-2 rounded-md hover:bg-slate-100/10 ${dark ? "hover:bg-slate-700" : ""}`} onClick={() => setTab("settings")} aria-label="Settings"><Settings className="h-5 w-5" /></button>

            <Link to="/profile" className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${dark ? "border-slate-700" : "border-slate-100"} hover:shadow-sm`}>
              <User className="h-4 w-4 text-slate-700" />
              <span className="hidden sm:inline">Hi, {user?.first_name || user?.firstName || "Investor"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="space-y-4">
            <Card className={`p-4 backdrop-blur-md ${dark ? "bg-slate-800/90 border-slate-700/50 text-slate-100" : "bg-white/90 border-slate-200/50 shadow-xl"}`}>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${dark ? "bg-gradient-to-br from-blue-600 to-blue-800" : "bg-gradient-to-br from-blue-500 to-blue-700"} text-white flex items-center justify-center font-semibold shadow-lg overflow-hidden`}>
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user ? ((user.firstName?.[0] || user.first_name?.[0] || "") + (user.lastName?.[0] || user.last_name?.[0] || "")).toUpperCase() : "IB"}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">
                      <span className="text-blue-500">{user?.first_name || user?.firstName || ""}</span>
                      {" "}
                      <span className="text-yellow-500">{user?.last_name || user?.lastName || ""}</span>
                    </div>
                    <div className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"} flex items-center gap-1`}>
                      <Shield className="h-3 w-3 text-green-500" />
                      {user?.status === 'approved' && user?.verification_id ? (
                        <>Verified • ID: {user.verification_id}</>
                      ) : (
                        <>
                          <span className="text-blue-500">{user?.first_name || user?.firstName || ""}</span>
                          {" "}
                          <span className="text-yellow-500">{user?.last_name || user?.lastName || ""}</span>
                        </>
                      )}
                    </div>
                    {user?.profile_completion !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={dark ? "text-slate-400" : "text-slate-500"}>Profile</span>
                          <span className="font-medium">{user.profile_completion}%</span>
                        </div>
                        <div className={`h-1 rounded-full ${dark ? "bg-slate-700" : "bg-gray-200"}`}>
                          <div 
                            className={`h-full rounded-full transition-all ${
                              user.profile_completion < 50 ? "bg-red-500" :
                              user.profile_completion < 80 ? "bg-yellow-500" :
                              "bg-green-500"
                            }`}
                            style={{ width: `${user.profile_completion}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                  <div><div className="text-sm font-semibold">{investments.length}</div><div className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>Holdings</div></div>
                  <div><div className="text-sm font-semibold">₵{stats.totalInvested.toLocaleString()}</div><div className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>Invested</div></div>
                  <div><div className="text-sm font-semibold">{stats.activeProjects}</div><div className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>Active</div></div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link to="/projects">
                    <Button 
                      className="flex-1 bg-yellow-400 text-slate-900"
                      disabled={user?.status === 'pending'}
                      title={user?.status === 'pending' ? 'Account pending approval' : 'Browse projects to invest'}
                    >
                      <Plus /> Invest
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={exportCSV}>Export</Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`backdrop-blur-md ${dark ? "bg-slate-800/90 border-slate-700/50 text-slate-100" : "bg-white/90 border-slate-200/50 shadow-xl"}`}>
              <CardHeader><CardTitle className={dark ? "text-white" : ""}>Portfolio Snapshot</CardTitle></CardHeader>
              <CardContent>
                <div className={dark ? "text-slate-300" : "text-slate-600"}>Portfolio value</div>
                <div className={`text-2xl font-bold ${dark ? "text-white" : ""}`}>₵{totalCurrentValue.toLocaleString()}</div>
                <div className="mt-3 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip formatter={(v) => chartFormatter(v)} />
                      <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className={dark ? "text-slate-300" : "text-sm text-slate-600"}>Liquidity</div>
                  <div className="font-medium">Moderate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          {/* Pending Approval Banner */}
          {user?.status === 'pending' && (
            <motion.div 
              variants={sectionVariant} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className={`rounded-lg border-2 p-4 ${dark ? "bg-yellow-900/20 border-yellow-600 text-yellow-200" : "bg-yellow-50 border-yellow-400 text-yellow-800"}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Account Pending Approval</h3>
                  <p className={`text-sm ${dark ? "text-yellow-300" : "text-yellow-700"}`}>
                    Your account is currently under review by our admin team. You will be able to make investments once your account has been approved. 
                    This typically takes 1-2 business days.
                  </p>
                  <p className={`text-xs mt-2 ${dark ? "text-yellow-400" : "text-yellow-600"}`}>
                    You can browse projects and explore the platform while waiting for approval.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total invested" icon={<DollarSign className="h-6 w-6" />} value={stats.totalInvested} inViewRef={investedRef} play={investedInView} dark={dark} />
              <StatCard title="Total returns" icon={<CreditCard className="h-6 w-6" />} value={stats.totalReturns} inViewRef={returnsRef} play={returnsInView} dark={dark} />
              <StatCard title="Active projects" icon={<BarChart2 className="h-6 w-6" />} value={stats.activeProjects} inViewRef={activeRef} play={activeInView} dark={dark} format={(v) => v.toLocaleString()} />
              <StatCard title="Portfolio value" icon={<PieChart className="h-6 w-6" />} value={stats.portfolioValue} inViewRef={portfolioRef} play={portfolioInView} dark={dark} />
            </div>
          </motion.section>

          {/* Tabs */}
          <section className={`${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"} p-4 rounded-2xl shadow-sm`}>
            <Tabs value={tab} onValueChange={(v) => setTab(v)}>
              <TabsList className="grid grid-cols-5 gap-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="support">
                  <span className="flex items-center gap-1">
                    Support
                    {unreadSupportCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {unreadSupportCount}
                      </span>
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* OVERVIEW */}
              <TabsContent value="overview">
                {/* Profile Completion Bar */}
                {getProfileCompletion.percentage < 100 && (
                  <motion.div 
                    className={`mb-6 p-4 rounded-lg border ${dark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Complete Your Profile</span>
                      </div>
                      <span className="text-sm font-medium">{getProfileCompletion.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProfileCompletion.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getProfileCompletion.items.filter(i => !i.completed).map(item => (
                        <Badge key={item.key} variant="outline" className="text-xs">
                          {item.label}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* AI Insights Card */}
                  {getInsights && (
                    <motion.div
                      className="lg:col-span-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className={`relative overflow-hidden ${dark ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700" : "bg-gradient-to-br from-white to-blue-50 border-blue-100"}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <CardHeader>
                          <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
                            <Zap className="h-5 w-5 text-yellow-500" />
                            AI-Driven Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className={`p-4 rounded-lg ${dark ? "bg-slate-700/50" : "bg-white/70"}`}>
                            <div className="flex items-start gap-3">
                              <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                              <div>
                                <div className="font-medium">Top Performer</div>
                                <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                                  {getInsights.topPerformer.title} is your best investment with <span className="font-semibold text-green-500">+{getInsights.topGrowth}%</span> growth
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg ${dark ? "bg-slate-700/50" : "bg-white/70"}`}>
                            <div className="flex items-start gap-3">
                              <Activity className="h-5 w-5 text-blue-500 mt-1" />
                              <div>
                                <div className="font-medium">Portfolio Growth</div>
                                <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                                  Your overall portfolio has grown by <span className={`font-semibold ${parseFloat(getInsights.portfolioGrowth) > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {getInsights.portfolioGrowth}%
                                  </span> this period
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg ${dark ? "bg-slate-700/50" : "bg-white/70"}`}>
                            <div className="flex items-start gap-3">
                              <Award className="h-5 w-5 text-purple-500 mt-1" />
                              <div>
                                <div className="font-medium">Recommendation</div>
                                <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                                  {getInsights.recommendation}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-slate-500">Diversification Score</div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full"
                                  style={{ width: `${getInsights.diversificationScore}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold">{getInsights.diversificationScore}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Risk Analysis Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
                          <Shield className="h-5 w-5 text-blue-500" />
                          Risk Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center py-6">
                          <div className={`text-6xl font-bold ${getRiskScore.color}`}>
                            {getRiskScore.score}
                          </div>
                          <div className={`text-sm mt-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                            Risk Score
                          </div>
                          <Badge 
                            variant={getRiskScore.level === "High" ? "destructive" : getRiskScore.level === "Medium" ? "warning" : "success"}
                            className="mt-3"
                          >
                            {getRiskScore.level} Risk
                          </Badge>
                        </div>

                        <div className={`p-3 rounded-lg ${dark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                          <div className="text-sm font-medium mb-2">What this means:</div>
                          <ul className={`text-xs space-y-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>
                            {getRiskScore.level === "Low" && (
                              <>
                                <li>✓ Well diversified portfolio</li>
                                <li>✓ Balanced investment spread</li>
                                <li>✓ Lower volatility exposure</li>
                              </>
                            )}
                            {getRiskScore.level === "Medium" && (
                              <>
                                <li>⚠ Moderate concentration</li>
                                <li>⚠ Consider more diversification</li>
                                <li>⚠ Regular monitoring advised</li>
                              </>
                            )}
                            {getRiskScore.level === "High" && (
                              <>
                                <li>⚠ High concentration risk</li>
                                <li>⚠ Diversify across more projects</li>
                                <li>⚠ Review portfolio allocation</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Activity Feed */}
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
                        <Activity className="h-5 w-5 text-purple-500" />
                        Platform Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Tema Lakeside Project Fully Funded</div>
                            <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>
                              Reached ₵5M target with 240 investors
                            </div>
                            <div className="text-xs text-slate-400 mt-1">2 hours ago</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">New Project: Kumasi Smart Homes</div>
                            <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>
                              Residential development with 15% projected ROI
                            </div>
                            <div className="text-xs text-slate-400 mt-1">5 hours ago</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Dividend Payout Processed</div>
                            <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>
                              ₵2.5M distributed to Accra Heights investors
                            </div>
                            <div className="text-xs text-slate-400 mt-1">1 day ago</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Dividend Tracker - Full Width */}
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DividendTracker />
                </motion.div>
              </TabsContent>

              {/* PORTFOLIO TAB */}
              <TabsContent value="portfolio">
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-bold ${dark ? "text-white" : ""}`}>Your investments</h3>
                      <div className="flex items-center gap-2">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm rounded-md border px-2 py-1">
                          <option value="all">All</option>
                          <option value="funding">Funding</option>
                          <option value="funded">Funded</option>
                          <option value="completed">Completed</option>
                        </select>
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search investments..." className="w-56" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {filtered.length === 0 && <div className={`text-center py-6 ${dark ? "text-slate-300" : "text-slate-500"}`}>No investments found.</div>}
                      {filtered.map((it) => <InvestmentRow key={it.id} it={it} dark={dark} />)}
                    </div>

                    {/* ROI Heatmap */}
                    {filtered.length > 0 && (
                      <div className="mt-6">
                        <ROIHeatmap investments={filtered} dark={dark} />
                      </div>
                    )}

                    {/* Risk Return Quadrant */}
                    {filtered.length > 0 && (
                      <div className="mt-6">
                        <RiskReturnQuadrant investments={filtered} dark={dark} />
                      </div>
                    )}
                  </div>

                  <aside className="space-y-4">
                    {/* Project Watchlist */}
                    <ProjectWatchlist dark={dark} />

                    {/* Investor Badges */}
                    <InvestorBadges investments={investments} stats={stats} dark={dark} />

                    <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                      <CardHeader><CardTitle className={dark ? "text-white" : ""}>Wallet Balance</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                          {wallet ? `₵${wallet.balance.toLocaleString()}` : "Loading..."}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {wallet ? `Status: ${wallet.status}` : ""}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700" 
                            onClick={() => setShowWithdrawModal(true)}
                            disabled={!wallet || wallet.balance <= 0}
                          >
                            Withdraw
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`flex-1 ${dark ? "border-slate-600 hover:bg-slate-700" : ""}`}
                            onClick={() => setShowDepositModal(true)}
                          >
                            Deposit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                      <CardHeader>
                        <CardTitle className={dark ? "text-white" : ""}>Quick actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full bg-yellow-400 text-slate-900" onClick={() => navigate("/projects")}><Plus /> Invest in new project</Button>
                        <Button className="w-full" variant="outline" onClick={() => setShowSupportModal(true)}>Contact support</Button>
                        <Button className="w-full" variant="ghost" onClick={exportCSV}>Export investments</Button>
                      </CardContent>
                    </Card>

                    {/* Support Tickets */}
                    {supportTickets.length > 0 && (
                      <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className={dark ? "text-white" : ""}>My Support Tickets</CardTitle>
                            {unreadSupportCount > 0 && (
                              <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                                {unreadSupportCount} new
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {supportTickets.slice(0, 3).map((ticket) => (
                            <div
                              key={ticket.id}
                              onClick={() => handleViewTicket(ticket.id)}
                              className={`p-3 rounded border cursor-pointer hover:shadow ${
                                dark ? "border-slate-600 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`font-semibold text-sm ${dark ? "text-white" : "text-slate-900"}`}>
                                    {ticket.subject}
                                  </h4>
                                  <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                                    Status: <span className={`font-medium ${
                                      ticket.status === 'open' ? 'text-blue-500' :
                                      ticket.status === 'in_progress' ? 'text-yellow-500' :
                                      'text-green-500'
                                    }`}>
                                      {ticket.status.replace('_', ' ')}
                                    </span>
                                  </p>
                                </div>
                                {ticket.unread_count > 0 && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    {ticket.unread_count}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {supportTickets.length > 3 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => setTab("support")}
                            >
                              View all {supportTickets.length} tickets
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </aside>
                </div>
              </TabsContent>

              {/* other tabs remain unchanged (portfolio, transactions, settings) */}
              <TabsContent value="portfolio">
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${dark ? "text-white" : ""}`}>Portfolio</h3>
                    <div className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>Total value: <strong>₵{totalCurrentValue.toLocaleString()}</strong></div>
                  </div>

                  <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                    <CardContent>
                      <div className="overflow-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>
                              <th className="py-2">Project</th>
                              <th>Invested</th>
                              <th>Current</th>
                              <th>Status</th>
                              <th>Progress</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {investments.map((r) => (
                              <tr key={r.id} className="border-t">
                                <td className="py-3">
                                  <div className="font-medium">{r.title}</div>
                                  <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{r.type}</div>
                                </td>
                                <td>₵{(r.invested || 0).toLocaleString()}</td>
                                <td>₵{(r.currentValue || r.invested || 0).toLocaleString()}</td>
                                <td><Badge className="bg-slate-100 text-slate-700">{r.status}</Badge></td>
                                <td>
                                  <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-blue-600 to-yellow-400" style={{ width: `${r.progress ?? 0}%` }} />
                                  </div>
                                </td>
                                <td className="text-right"><Link to={`/projects/${r.projectId || r.id}`} className="text-sm text-blue-400 hover:underline">Details</Link></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transactions">
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${dark ? "text-white" : ""}`}>Transactions</h3>
                    <div className="flex items-center gap-2">
                      <select 
                        value={transactionTypeFilter} 
                        onChange={(e) => setTransactionTypeFilter(e.target.value)}
                        className={`text-sm rounded-md border px-3 py-1.5 ${dark ? "bg-slate-700 border-slate-600 text-white" : ""}`}
                      >
                        <option value="all">All Types</option>
                        <option value="investment">Investments</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                      </select>
                      
                      <select 
                        value={transactionDateFilter} 
                        onChange={(e) => setTransactionDateFilter(e.target.value)}
                        className={`text-sm rounded-md border px-3 py-1.5 ${dark ? "bg-slate-700 border-slate-600 text-white" : ""}`}
                      >
                        <option value="all">All Time</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                      </select>

                      <Button variant="outline" onClick={exportPDF} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Statement
                      </Button>
                    </div>
                  </div>

                  <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                    <CardContent>
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>
                              <th className="py-2 text-left">Date</th>
                              <th className="text-left">Description</th>
                              <th className="text-left">Method</th>
                              <th className="text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-500">
                                  No transactions found for the selected filters
                                </td>
                              </tr>
                            ) : (
                              filteredTransactions.map((t) => (
                                <tr key={t.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                  <td className="py-3 text-sm">{t.date}</td>
                                  <td className="text-sm">{t.desc}</td>
                                  <td className="text-sm">
                                    <Badge variant="outline" className="text-xs">
                                      {t.method}
                                    </Badge>
                                  </td>
                                  <td className={`text-right font-medium ${t.amount < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                    {t.amount < 0 ? "-" : "+"}₵{Math.abs(t.amount).toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {filteredTransactions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <div className="text-sm text-slate-500">
                            Showing {filteredTransactions.length} of {transactions.length} transactions
                          </div>
                          <div className="text-sm font-medium">
                            Total: <span className={filteredTransactions.reduce((sum, t) => sum + t.amount, 0) >= 0 ? "text-green-600" : "text-red-600"}>
                              ₵{Math.abs(filteredTransactions.reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* SUPPORT TICKETS */}
              <TabsContent value="support">
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${dark ? "text-white" : ""}`}>Support Tickets</h3>
                    <Button onClick={() => setShowSupportModal(true)} className="bg-blue-600 text-white">
                      <Plus className="h-4 w-4 mr-1" /> New Ticket
                    </Button>
                  </div>

                  {supportTickets.length === 0 ? (
                    <Card className={dark ? "bg-slate-800 border-slate-700" : ""}>
                      <CardContent className="py-12 text-center">
                        <p className={dark ? "text-slate-400" : "text-slate-500"}>
                          No support tickets yet. Click "New Ticket" to get help.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {supportTickets.map((ticket) => (
                        <Card
                          key={ticket.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            dark ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "hover:border-blue-300"
                          }`}
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                                    {ticket.subject}
                                  </h4>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                    ticket.status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                                  }`}>
                                    {ticket.status.replace('_', ' ')}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs rounded border ${
                                    dark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"
                                  }`}>
                                    {ticket.category}
                                  </span>
                                </div>
                                <p className={`text-sm line-clamp-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                                  {ticket.message}
                                </p>
                                <p className={`text-xs mt-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                                  Created {new Date(ticket.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {ticket.unread_count > 0 && (
                                <div className="ml-4">
                                  <span className="flex items-center justify-center h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {ticket.unread_count}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                    <CardHeader><CardTitle className={dark ? "text-white" : ""}>Account</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm"><div className="font-medium">Email</div><div className={`text-slate-600 ${dark ? "text-slate-300" : ""}`}>{user?.email || "investor@example.com"}</div></div>
                        <div className="text-sm"><div className="font-medium">Phone</div><div className={`text-slate-600 ${dark ? "text-slate-300" : ""}`}>{user?.phone || "+233 20 123 4567"}</div></div>
                        <div className="flex gap-2 mt-3">
                          <Button className="bg-blue-600 text-white" onClick={handleEditProfile}>Edit profile</Button>
                          <Button variant="outline" onClick={() => setShowSecurityModal(true)}>Security</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}>
                    <CardHeader><CardTitle className={dark ? "text-white" : ""}>Preferences</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Dark mode</div>
                            <div className="text-sm text-slate-500">Enable dark theme for this account on this device</div>
                          </div>
                          <div>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dark}
                                onChange={(e) => setDark(e.target.checked)}
                                className="sr-only"
                                aria-label="Toggle dark mode"
                              />
                              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${dark ? "bg-blue-600" : "bg-slate-300"}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${dark ? "translate-x-6" : "translate-x-0"}`} />
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Email updates</div>
                            <div className="text-sm text-slate-500">Receive weekly insights</div>
                          </div>
                          <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-slate-500">Add extra security to your account</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowTwoFactorModal(true)}
                          >
                            {twoFactorEnabled ? "Enabled" : "Enable"}
                          </Button>
                        </div>

                        <Button variant="outline" className="w-full" onClick={handleManagePreferences}>Manage preferences</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Login Activity Log - New Enhanced Component */}
                  <div className="lg:col-span-2">
                    <LoginActivityLog dark={dark} />
                  </div>

                  {/* Session Management Card - Old Component (keeping for backwards compatibility) */}
                  <Card className={`lg:col-span-2 ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : ""}`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
                        <Monitor className="h-5 w-5" />
                        Active Sessions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <div 
                            key={session.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${dark ? "border-slate-700 bg-slate-700/30" : "border-slate-200 bg-slate-50"}`}
                          >
                            <div className="flex items-start gap-3">
                              {session.device.includes("iPhone") || session.device.includes("Android") ? (
                                <Smartphone className="h-5 w-5 text-blue-500 mt-1" />
                              ) : (
                                <Monitor className="h-5 w-5 text-blue-500 mt-1" />
                              )}
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {session.device}
                                  {session.current && (
                                    <Badge variant="success" className="text-xs bg-green-500/20 text-green-600 border-green-600">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <div className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                                  {session.location}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                  {session.lastActive}
                                </div>
                              </div>
                            </div>
                            {!session.current && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => logoutSession(session.id)}
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                              >
                                <LogOut className="h-4 w-4" />
                                Logout
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        {sessions.length === 1 && (
                          <div className="text-center py-4 text-slate-500 text-sm">
                            This is your only active session
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>

      <MobileNav active={tab} onChange={setTab} dark={dark} />

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className={`w-full max-w-md ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Deposit Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₵)</label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className={dark ? "bg-slate-700 border-slate-600" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 ${dark ? "bg-slate-700 border-slate-600 text-white" : ""}`}
                >
                  <option value="momo">Mobile Money</option>
                  <option value="card">Card Payment</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositAmount("");
                  }}
                  disabled={walletLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleDeposit}
                  disabled={walletLoading || !depositAmount || parseFloat(depositAmount) < 1}
                >
                  {walletLoading ? "Processing..." : "Deposit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className={`w-full max-w-md ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-500">
                Available Balance: <span className="font-bold text-blue-600">₵{wallet?.balance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount (₵)</label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  max={wallet?.balance || 0}
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className={dark ? "bg-slate-700 border-slate-600" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 ${dark ? "bg-slate-700 border-slate-600 text-white" : ""}`}
                >
                  <option value="momo">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {paymentMethod === "momo" ? "Mobile Money Number" : "Bank Account Details"}
                </label>
                <Input
                  type="text"
                  placeholder={paymentMethod === "momo" ? "e.g. 0241234567" : "e.g. Account Name, Number, Bank"}
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className={dark ? "bg-slate-700 border-slate-600" : ""}
                />
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount("");
                    setAccountDetails("");
                  }}
                  disabled={walletLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleWithdraw}
                  disabled={
                    walletLoading ||
                    !withdrawAmount ||
                    parseFloat(withdrawAmount) < 1 ||
                    !accountDetails.trim() ||
                    (wallet && parseFloat(withdrawAmount) > wallet.balance)
                  }
                >
                  {walletLoading ? "Processing..." : "Withdraw"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security/Change Password Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className={`w-full max-w-md ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={dark ? "bg-slate-700 border-slate-600" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={dark ? "bg-slate-700 border-slate-600 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={dark ? "bg-slate-700 border-slate-600 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSecurityModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={securityLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleChangePassword}
                  disabled={
                    securityLoading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                >
                  {securityLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className={`w-full max-w-md ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Edit Profile</CardTitle>
              <button onClick={() => setShowEditProfileModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">&times;</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className={dark ? "bg-slate-700 border-slate-600 text-white" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Enter last name"
                    className={dark ? "bg-slate-700 border-slate-600 text-white" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Enter email"
                    className={dark ? "bg-slate-700 border-slate-600 text-white" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className={dark ? "bg-slate-700 border-slate-600 text-white" : ""}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    className="flex-1 bg-blue-600 text-white"
                    disabled={profileLoading}
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manage Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className={`w-full max-w-md ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Manage Preferences</CardTitle>
              <button onClick={() => setShowPreferencesModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">&times;</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-slate-500">Receive updates via email</div>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${emailNotifications ? "bg-blue-600" : "bg-slate-300"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${emailNotifications ? "translate-x-6" : "translate-x-0"}`} />
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-slate-500">Receive updates via SMS</div>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${smsNotifications ? "bg-blue-600" : "bg-slate-300"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${smsNotifications ? "translate-x-6" : "translate-x-0"}`} />
                    </div>
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSavePreferences} 
                    className="flex-1 bg-blue-600 text-white"
                    disabled={preferencesLoading}
                  >
                    {preferencesLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreferencesModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className={`w-full max-w-md ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Two-Factor Authentication</CardTitle>
              <button onClick={() => setShowTwoFactorModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">&times;</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${twoFactorEnabled ? "bg-green-500/10 border border-green-500" : "bg-blue-500/10 border border-blue-500"}`}>
                  <div className="flex items-center gap-2">
                    <Shield className={`h-5 w-5 ${twoFactorEnabled ? "text-green-500" : "text-blue-500"}`} />
                    <span className="font-medium">
                      Status: {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>

                {!twoFactorEnabled ? (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Two-factor authentication adds an extra layer of security to your account. You'll receive a 6-digit code that you'll need to enter along with your password.
                    </p>
                    <Button 
                      onClick={handleEnableTwoFactor} 
                      className="w-full bg-blue-600 text-white"
                      disabled={twoFactorLoading}
                    >
                      {twoFactorLoading ? "Enabling..." : "Enable Two-Factor Authentication"}
                    </Button>
                  </>
                ) : (
                  <>
                    {twoFactorSecret && (
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm font-medium mb-2">Your Secret Code:</p>
                        <p className="text-2xl font-mono font-bold text-center text-blue-600 dark:text-blue-400">
                          {twoFactorSecret}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">Save this code securely. You'll need it to verify your identity.</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">Verify Code</label>
                      <Input
                        type="text"
                        maxLength={6}
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code"
                        className={`text-center text-lg font-mono ${dark ? "bg-slate-700 border-slate-600 text-white" : ""}`}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleVerifyTwoFactor} 
                        className="flex-1 bg-green-600 text-white"
                        disabled={twoFactorLoading}
                      >
                        {twoFactorLoading ? "Verifying..." : "Verify Code"}
                      </Button>
                      <Button 
                        onClick={handleDisableTwoFactor} 
                        variant="outline"
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                        disabled={twoFactorLoading}
                      >
                        Disable
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className={`w-full max-w-lg relative ${dark ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
            <button 
              onClick={() => setShowSupportModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
            >
              &times;
            </button>
            <CardHeader>
              <CardTitle className={dark ? "text-white" : ""}>Contact Support</CardTitle>
              <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                We're here to help! Submit your question or issue below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  Category
                </label>
                <select
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${
                    dark 
                      ? "bg-slate-700 border-slate-600 text-white" 
                      : "bg-white border-slate-300"
                  }`}
                >
                  <option value="general">General Inquiry</option>
                  <option value="investment">Investment Question</option>
                  <option value="wallet">Wallet & Payments</option>
                  <option value="account">Account Issues</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  Subject
                </label>
                <Input
                  type="text"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className={dark ? "bg-slate-700 border-slate-600 text-white" : ""}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  Message
                </label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Please provide details about your question or issue..."
                  rows={6}
                  className={`w-full px-3 py-2 rounded-md border resize-none ${
                    dark 
                      ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" 
                      : "bg-white border-slate-300 placeholder:text-slate-400"
                  }`}
                />
              </div>

              <div className={`p-3 rounded-md ${dark ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
                <p className={`text-xs ${dark ? "text-blue-300" : "text-blue-700"}`}>
                  <strong>Response Time:</strong> We typically respond within 24 hours on business days.
                  For urgent matters, call us at <strong>+233 24 123 4567</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSupportModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitSupport}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={supportLoading}
                >
                  {supportLoading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ticket Conversation Modal */}
      {showTicketConversation && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className={`w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative ${
            dark ? "bg-slate-800 border-slate-700" : "bg-white"
          }`}>
            <button 
              onClick={() => setShowTicketConversation(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl z-10"
            >
              &times;
            </button>
            
            <CardHeader className="border-b dark:border-slate-700">
              <div className="pr-8">
                <CardTitle className={dark ? "text-white" : ""}>{selectedTicket.subject}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    selectedTicket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                  }`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded border ${
                    dark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"
                  }`}>
                    {selectedTicket.category}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                selectedTicket.messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[75%] rounded-lg p-3 ${
                      msg.is_admin 
                        ? dark ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                        : dark ? 'bg-slate-700 border border-slate-600' : 'bg-slate-100 border border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${
                          msg.is_admin ? 'text-blue-600 dark:text-blue-400' : dark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {msg.is_admin ? 'Support Team' : 'You'}
                        </span>
                        <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-center ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No messages yet
                </p>
              )}
            </CardContent>

            <div className="border-t dark:border-slate-700 p-4">
              <div className="space-y-3">
                <textarea
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded border resize-none ${
                    dark 
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                      : "bg-white border-slate-300"
                  }`}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowTicketConversation(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleReplyToTicket}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!ticketReply.trim() || replyLoading}
                  >
                    {replyLoading ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
