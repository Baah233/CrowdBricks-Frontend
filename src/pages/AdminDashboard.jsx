import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ShieldCheck, Ban, Bell, Sun, Moon } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as adminApi from "@/lib/adminApi";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

/*
  AdminDashboard.jsx (fixed)
  - Adds missing exportUsersCSV and exportProjectsCSV functions that were causing runtime ReferenceError.
  - Uses adminApi for backend wiring with graceful localStorage fallback.
  - Improved UI and dark-mode toggle persisted to localStorage.
*/

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}
function writeLS(key, v) { localStorage.setItem(key, JSON.stringify(v)); }

function initials(name = "") {
  return name.split(" ").map(s => s[0]).filter(Boolean).slice(0,2).join("").toUpperCase();
}

export default function AdminDashboard() {
  console.log("📊 AdminDashboard Loaded - Version: Nov 7, 2025 - With Phone Change Requests");
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: null,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_image: null,
    is_published: false
  });
  const [phoneChangeRequests, setPhoneChangeRequests] = useState([]);
  const [loadingPhoneRequests, setLoadingPhoneRequests] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loadingSupportTickets, setLoadingSupportTickets] = useState(false);
  const [unreadTicketCount, setUnreadTicketCount] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [respondingToTicket, setRespondingToTicket] = useState(false);
  const [notifications, setNotifications] = useState(readLS("cb_admin_notifications_v3") || []);
  const [audit, setAudit] = useState(readLS("cb_admin_audit_v3") || []);
  const [tab, setTab] = useState("overview");
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Ref to track previous unread count
  const previousUnreadCountRef = useRef(0);
  const [dark, setDark] = useState(() => localStorage.getItem("cb_admin_dark") === "1");
  const sseRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("cb_admin_dark", dark ? "1" : "0");
    console.log("Dark mode:", dark, "HTML classes:", html.className);
  }, [dark]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen && !event.target.closest('.notifications-container')) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  const loadPhoneChangeRequests = async () => {
    setLoadingPhoneRequests(true);
    try {
      console.log("📱 Fetching phone change requests...");
      const res = await adminApi.fetchPhoneChangeRequests();
      console.log("Phone change requests response:", res);
      
      if (res.ok && res.requests) {
        setPhoneChangeRequests(res.requests);
        console.log("✅ Phone change requests loaded:", res.requests.length);
      } else {
        setPhoneChangeRequests([]);
        console.error("❌ Failed to load phone change requests:", res.error);
      }
    } catch (e) {
      setPhoneChangeRequests([]);
      console.error("❌ Error loading phone change requests:", e);
    } finally {
      setLoadingPhoneRequests(false);
    }
  };

  const approvePhoneChange = async (id) => {
    try {
      const res = await adminApi.approvePhoneChange(id);
      console.log("Approve response:", res);
      if (res.ok) {
        toast({ 
          title: "Success", 
          description: typeof res.message === 'string' ? res.message : "Phone change approved successfully" 
        });
        await loadPhoneChangeRequests();
      } else {
        const errorMsg = typeof res.error === 'string' ? res.error : 
                        res.error?.message || "Failed to approve phone change";
        toast({ 
          title: "Error", 
          description: errorMsg, 
          variant: "destructive" 
        });
      }
    } catch (e) {
      console.error("Approve error:", e);
      toast({ 
        title: "Error", 
        description: "Failed to approve phone change", 
        variant: "destructive" 
      });
    }
  };

  const rejectPhoneChange = async (id) => {
    try {
      const res = await adminApi.rejectPhoneChange(id);
      console.log("Reject response:", res);
      if (res.ok) {
        toast({ 
          title: "Success", 
          description: typeof res.message === 'string' ? res.message : "Phone change rejected successfully" 
        });
        await loadPhoneChangeRequests();
      } else {
        const errorMsg = typeof res.error === 'string' ? res.error : 
                        res.error?.message || "Failed to reject phone change";
        toast({ 
          title: "Error", 
          description: errorMsg, 
          variant: "destructive" 
        });
      }
    } catch (e) {
      console.error("Reject error:", e);
      toast({ 
        title: "Error", 
        description: "Failed to reject phone change", 
        variant: "destructive" 
      });
    }
  };

  const loadSupportTickets = async () => {
    setLoadingSupportTickets(true);
    try {
      console.log("🎫 Fetching support tickets...");
      const res = await adminApi.fetchSupportTickets();
      console.log("Support tickets response:", res);
      
      if (res.ok && res.data?.data) {
        setSupportTickets(res.data.data);
        console.log("✅ Support tickets loaded:", res.data.data.length);
      } else {
        console.error("Failed to load support tickets:", res.error);
        toast({ 
          title: "Error", 
          description: "Failed to load support tickets", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error loading support tickets:", error);
    } finally {
      setLoadingSupportTickets(false);
    }
  };

  const loadUnreadTicketCount = async () => {
    try {
      const res = await adminApi.fetchUnreadTicketCount();
      console.log("Admin unread ticket count response:", res);
      
      if (res.ok && res.data?.count !== undefined) {
        const newUnreadCount = res.data.count;
        const previousCount = previousUnreadCountRef.current;
        
        console.log(`Admin unread count - Previous: ${previousCount}, New: ${newUnreadCount}`);
        
        setUnreadTicketCount(newUnreadCount);
        previousUnreadCountRef.current = newUnreadCount; // Update ref
        
        // If count increased, add notification and show toast
        if (newUnreadCount > previousCount && newUnreadCount > 0) {
          const newNotification = {
            id: Date.now(),
            title: "New Support Message",
            message: `You have ${newUnreadCount} new message${newUnreadCount > 1 ? 's' : ''} from investors`,
            type: "info",
            read: false,
            timestamp: new Date().toISOString(),
          };
          
          console.log("Adding admin notification:", newNotification);
          
          setNotifications(prev => {
            const updated = [newNotification, ...prev];
            writeLS("cb_admin_notifications_v3", updated);
            return updated;
          });
          
          // Show toast
          toast({ 
            title: "New Support Message", 
            description: newNotification.message,
          });
          
          // Browser notification
          if (window.Notification && Notification.permission === "granted") {
            new Notification("CrowdBricks Admin", {
              body: newNotification.message,
              icon: "/CB.png",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error loading unread ticket count:", error);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const res = await adminApi.fetchSupportTicketById(ticketId);
      if (res.ok && res.data) {
        setSelectedTicket(res.data);
        setAdminResponse("");
        setTicketModalOpen(true);
      }
    } catch (error) {
      console.error("Error loading ticket details:", error);
      toast({ 
        title: "Error", 
        description: "Failed to load ticket details", 
        variant: "destructive" 
      });
    }
  };

  const handleRespondToTicket = async () => {
    if (!adminResponse.trim() || !selectedTicket) return;
    
    setRespondingToTicket(true);
    try {
      const res = await adminApi.respondToSupportTicket(selectedTicket.id, {
        response: adminResponse,
        update_status: true
      });
      
      if (res.ok) {
        toast({ title: "Response submitted successfully" });
        setTicketModalOpen(false);
        setSelectedTicket(null);
        setAdminResponse("");
        await loadSupportTickets();
        await loadUnreadTicketCount();
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to submit response", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error responding to ticket:", error);
      toast({ 
        title: "Error", 
        description: "Failed to submit response", 
        variant: "destructive" 
      });
    } finally {
      setRespondingToTicket(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const res = await adminApi.updateSupportTicketStatus(ticketId, status);
      if (res.ok) {
        toast({ title: "Ticket status updated" });
        await loadSupportTickets();
        await loadUnreadTicketCount();
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({ 
        title: "Error", 
        description: "Failed to update ticket status", 
        variant: "destructive" 
      });
    }
  };

  // News functions
  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const res = await adminApi.fetchNews();
      if (res.ok && Array.isArray(res.data)) {
        setNews(res.data);
      } else {
        setNews([]);
        console.error("Failed to load news:", res.error);
      }
    } catch (e) {
      setNews([]);
      console.error("Error loading news:", e);
    } finally {
      setLoadingNews(false);
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newsForm.title);
      formData.append('category', newsForm.category);
      formData.append('excerpt', newsForm.excerpt);
      formData.append('content', newsForm.content || '');
      formData.append('meta_title', newsForm.meta_title || '');
      formData.append('meta_description', newsForm.meta_description || '');
      formData.append('meta_keywords', newsForm.meta_keywords || '');
      formData.append('is_published', newsForm.is_published ? '1' : '0');
      if (newsForm.image) {
        formData.append('image', newsForm.image);
      }
      if (newsForm.og_image) {
        formData.append('og_image', newsForm.og_image);
      }

      const res = editingNews 
        ? await adminApi.updateNews(editingNews.id, formData)
        : await adminApi.createNews(formData);

      if (res.ok) {
        toast({ 
          title: "Success", 
          description: editingNews ? "News updated successfully" : "News created successfully"
        });
        setNewsModalOpen(false);
        setEditingNews(null);
        setNewsForm({ title: "", category: "", excerpt: "", content: "", image: null, meta_title: "", meta_description: "", meta_keywords: "", og_image: null, is_published: false });
        await loadNews();
      } else {
        toast({ 
          title: "Error", 
          description: res.error?.message || "Failed to save news", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error saving news:", error);
      toast({ 
        title: "Error", 
        description: "Failed to save news", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    
    try {
      const res = await adminApi.deleteNews(id);
      if (res.ok) {
        toast({ title: "News deleted successfully" });
        await loadNews();
      } else {
        toast({ 
          title: "Error", 
          description: res.error?.message || "Failed to delete news", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete news", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleNewsPublish = async (id) => {
    try {
      const res = await adminApi.toggleNewsPublish(id);
      if (res.ok) {
        toast({ title: res.data?.message || "Status updated" });
        await loadNews();
      } else {
        toast({ 
          title: "Error", 
          description: res.error?.message || "Failed to toggle publish status", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast({ 
        title: "Error", 
        description: "Failed to toggle publish status", 
        variant: "destructive" 
      });
    }
  };

  const handleEditNews = (article) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content || '',
      image: null,
      meta_title: article.meta_title || '',
      meta_description: article.meta_description || '',
      meta_keywords: article.meta_keywords || '',
      og_image: null,
      is_published: article.is_published
    });
    setNewsModalOpen(true);
  };

 const loadAll = async () => {
  setLoading(true);

  try {
    // 🧠 fetch summary stats
    const statsRes = await adminApi.fetchStats();
    console.log('Stats response:', statsRes);
    if (statsRes.ok) {
      setStats(statsRes.data);
      console.log('Stats loaded:', statsRes.data);
    } else {
      console.error('Failed to load stats:', statsRes.error);
      toast({ title: "Stats Error", description: "Failed to load dashboard statistics", variant: "destructive" });
    }

    const uRes = await adminApi.fetchUsers();
    if (uRes.ok && Array.isArray(uRes.data)) {
      setUsers(uRes.data);
      writeLS("cb_admin_users_v3", uRes.data);
      console.log('Users loaded:', uRes.data.length);
    } else {
      console.error('Failed to load users:', uRes.error);
      setUsers(readLS("cb_admin_users_v3") || []);
    }

    const pRes = await adminApi.fetchProjects();
    if (pRes.ok && Array.isArray(pRes.data)) {
      setProjects(pRes.data);
      writeLS("cb_admin_projects_v3", pRes.data);
      console.log('Projects loaded:', pRes.data.length);
    } else {
      console.error('Failed to load projects:', pRes.error);
      setProjects(readLS("cb_admin_projects_v3") || []);
    }

    const iRes = await adminApi.fetchInvestments();
    if (iRes.ok && Array.isArray(iRes.data)) {
      setInvestments(iRes.data);
      writeLS("cb_admin_investments_v3", iRes.data);
      console.log('Investments loaded:', iRes.data.length);
    } else {
      console.error('Failed to load investments:', iRes.error);
      setInvestments(readLS("cb_admin_investments_v3") || []);
    }

    // Load notifications
    const nRes = await adminApi.fetchNotifications();
    console.log('Notifications response:', nRes);
    if (nRes.ok && Array.isArray(nRes.data)) {
      setNotifications(nRes.data);
      writeLS("cb_admin_notifications_v3", nRes.data);
      console.log('Notifications loaded:', nRes.data.length);
    } else {
      console.error('Failed to load notifications:', nRes.error);
      setNotifications(readLS("cb_admin_notifications_v3") || []);
    }

    // Load phone change requests
    await loadPhoneChangeRequests();

    // Load support tickets
    await loadSupportTickets();
    await loadUnreadTicketCount();

    // Load news articles
    await loadNews();

    setAudit(readLS("cb_admin_audit_v3") || []);
  } catch (error) {
    console.error('Error loading admin data:', error);
    toast({ title: "Error", description: "Failed to load admin data", variant: "destructive" });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { loadAll(); }, []);

  // Poll for new support messages
  useEffect(() => {
    // Initial load
    loadUnreadTicketCount();
    
    // Set up polling
    const interval = setInterval(() => {
      console.log("Polling for new support messages...");
      loadUnreadTicketCount();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run once

  useEffect(() => {
    const es = adminApi.connectNotificationsSSE(
      (msg) => {
        setNotifications((n) => { const next = [msg, ...n]; writeLS("cb_admin_notifications_v3", next); return next; });
        toast({ title: "Notification", description: msg.title || msg.body || "New notification" });
      },
      (err) => {
        const poll = setInterval(async () => {
          const r = await adminApi.fetchNotifications();
          if (r.ok && Array.isArray(r.data)) {
            setNotifications(r.data);
            writeLS("cb_admin_notifications_v3", r.data);
          }
        }, 10000);
        sseRef.current = poll;
      }
    );
    sseRef.current = sseRef.current || es;
    return () => {
      if (sseRef.current) {
        if (sseRef.current.close) sseRef.current.close();
        else clearInterval(sseRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const developers = useMemo(() => users.filter(u => u.user_type === "developer" && u.status !== "deleted"), [users]);
  const investors = useMemo(() => users.filter(u => u.user_type === "investor" && u.status !== "deleted"), [users]);
  const activeUsers = useMemo(() => users.filter(u => (u.user_type === "developer" || u.user_type === "investor") && u.status !== "deleted"), [users]);

  const usersByWeek = useMemo(() => {
    const map = {};
    (users || []).forEach((u) => {
      const d = new Date(u.created_at);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).slice(0, 12).map(([label, count]) => ({ label, count })).reverse();
  }, [users]);

  const investmentsByMethod = useMemo(() => {
    const map = {};
    (investments || []).forEach(i => { map[i.method] = (map[i.method] || 0) + (i.amount || 0); });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [investments]);

  const approvalsOverTime = useMemo(() => {
    const map = {};
    (users || []).forEach(u => {
      if (u.status === "approved") {
        const d = new Date(u.created_at);
        const label = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
        map[label] = (map[label] || 0) + 1;
      }
    });
    return Object.entries(map).map(([month, count]) => ({ month, count })).slice(0, 12).reverse();
  }, [users]);

  const filteredUsers = useMemo(() => {
    let out = users || [];
    if (filterType) out = out.filter(u => u.user_type === filterType);
    if (filterStatus) out = out.filter(u => u.status === filterStatus);
    if (q) out = out.filter(u => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
    return out;
  }, [users, q, filterType, filterStatus]);

  useEffect(() => setPage(1), [filterType, filterStatus, q]);

  const totalPages = Math.max(1, Math.ceil((filteredUsers.length || 0) / pageSize));
  const currentPageItems = filteredUsers.slice((page-1)*pageSize, page*pageSize);

  async function handleApproveUser(id) {
    if (!confirm("Approve this user?")) return;
    console.log('Approving user:', id);
    const res = await adminApi.approveUser(id);
    console.log('Approve response:', res);
    if (res.ok) { 
      toast({ title: "User approved" }); 
      console.log('Reloading data...');
      await loadAll(); 
    }
    else toast({ title: "Approve failed", description: res.error?.message || "Server error", variant: "destructive" });
  }

  async function handleRejectUser(id) {
    if (!confirm("Reject this user?")) return;
    const res = await adminApi.rejectUser(id);
    if (res.ok) { toast({ title: "User rejected" }); await loadAll(); }
    else toast({ title: "Reject failed", description: res.error?.message || "Server error", variant: "destructive" });
  }

  async function handleToggleAdmin(id) {
    const res = await adminApi.toggleAdminRole(id);
    if (res.ok) { toast({ title: "Role updated" }); await loadAll(); }
    else toast({ title: "Update failed", description: res.error?.message || "Server error", variant: "destructive" });
  }

  async function handleApproveProject(id) {
    if (!confirm("Approve this project?")) return;
    console.log('Approving project:', id);
    const res = await adminApi.approveProject(id);
    console.log('Approve project response:', res);
    if (res.ok) { 
      toast({ title: "Project approved" }); 
      console.log('Reloading data...');
      await loadAll(); 
    }
    else toast({ title: "Approve failed", description: res.error?.message || "Server error", variant: "destructive" });
  }

  async function handleUpdateInvestmentStatus(id, status) {
    const res = await adminApi.updateInvestmentStatus(id, status);
    if (res.ok) { toast({ title: "Investment updated" }); await loadAll(); }
    else toast({ title: "Update failed", description: res.error?.message || "Server error" });
  }

  const bulkApprove = async () => {
    if (!selected.size) return;
    if (!confirm(`Approve ${selected.size} users?`)) return;
    for (const id of selected) await adminApi.approveUser(id);
    toast({ title: "Bulk approved" });
    setSelected(new Set());
    await loadAll();
  };

  const bulkReject = async () => {
    if (!selected.size) return;
    if (!confirm(`Reject ${selected.size} users?`)) return;
    for (const id of selected) await adminApi.rejectUser(id);
    toast({ title: "Bulk rejected" });
    setSelected(new Set());
    await loadAll();
  };

  // --- Added functions to fix the runtime error ---
  const exportUsersCSV = () => {
    const rows = [
      ["id", "first_name", "last_name", "email", "type", "status", "created_at"],
      ...users.map(u => [u.id, u.first_name, u.last_name, u.email, u.user_type, u.status, u.created_at]),
    ];
    exportCSV(rows, `crowdbricks_users_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const exportProjectsCSV = () => {
    const rows = [
      ["id", "title", "developer_name", "status", "target_funding", "current_funding", "created_at"],
      ...projects.map(p => [p.id, p.title, p.developer_name || p.developer?.name || "", p.status, p.target_funding, p.current_funding, p.created_at]),
    ];
    exportCSV(rows, `crowdbricks_projects_${new Date().toISOString().slice(0,10)}.csv`);
  };
  // --- end added functions ---

  function toggleSelect(id) {
    setSelected(s => { const next = new Set(s); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  const Empty = ({ text="No items" }) => <div className="p-6 text-center text-sm text-slate-500">{text}</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-slate-900 text-slate-100' : 'bg-[#e6f7ff] text-slate-900'}`}>
      <Navbar />
      <div className="max-w-8xl mx-auto px-6 py-6 pt-20">
        <header className={`flex items-start justify-between gap-4 mb-6 backdrop-blur-md rounded-xl p-4 shadow-sm transition-colors duration-300 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}>
          <div>
            <h1 className={`text-3xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>CrowdBricks — Admin Console</h1>
            <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Manage developers, investors, projects and investments</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDark(!dark)}
              className={`p-3 rounded-lg shadow hover:shadow-md transition-all cursor-pointer border ${dark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Notifications Button with Dropdown */}
            <div className="relative notifications-container">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) {
                    // Refresh notifications when opening dropdown
                    adminApi.fetchNotifications().then(res => {
                      if (res.ok && Array.isArray(res.data)) {
                        setNotifications(res.data);
                        writeLS("cb_admin_notifications_v3", res.data);
                      }
                    });
                  }
                }}
                className={`flex items-center gap-2 p-3 rounded-lg shadow hover:shadow-md transition-all cursor-pointer border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
              >
                <Bell className={`w-5 h-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Notifications</div>
                  <div className={`font-medium ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {notifications.filter(n => !n.read).length || notifications.length}
                  </div>
                </div>
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className={`absolute right-0 top-full mt-2 w-96 rounded-lg shadow-xl border max-h-96 overflow-hidden z-50 flex flex-col ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`p-4 border-b flex items-center justify-between ${dark ? 'border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600' : 'border-slate-200 bg-gradient-to-r from-blue-500 to-purple-500'} text-white`}>
                    <div>
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-xs opacity-90">{notifications.filter(n => !n.read).length} unread</p>
                    </div>
                    <div className="flex gap-2">
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button 
                          onClick={async () => {
                            const res = await adminApi.markAllNotificationsRead();
                            if (res.ok) {
                              const updated = notifications.map(n => ({ ...n, read: true }));
                              setNotifications(updated);
                              writeLS("cb_admin_notifications_v3", updated);
                              toast({ title: "All notifications marked as read" });
                            }
                          }}
                          className="text-xs hover:underline px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition"
                        >
                          Mark all read
                        </button>
                      )}
                      <button 
                        onClick={() => setNotificationsOpen(false)}
                        className="text-white hover:bg-white/20 rounded p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={`divide-y overflow-y-auto flex-1 ${dark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 transition-colors cursor-pointer ${!n.read ? (dark ? 'bg-blue-900/20' : 'bg-blue-50') : ''} ${dark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
                          onClick={() => {
                            // Mark as read
                            const updated = notifications.map(notif => 
                              notif.id === n.id ? { ...notif, read: true } : notif
                            );
                            setNotifications(updated);
                            writeLS("cb_admin_notifications_v3", updated);
                            
                            // Navigate to support tickets if it's a support notification
                            if (n.title === "New Support Message") {
                              setTab("support-tickets");
                              setNotificationsOpen(false);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className={`font-medium mb-1 flex items-center gap-2 ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
                                {n.title}
                                {!n.read && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                              <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{n.body || n.message}</div>
                              <div className={`text-xs mt-2 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
                                {n.date ? new Date(n.date).toLocaleString() : (n.timestamp ? new Date(n.timestamp).toLocaleString() : 'Just now')}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!n.read && (
                                <button
                                  onClick={async () => {
                                    const res = await adminApi.markNotificationRead(n.id);
                                    if (res.ok) {
                                      const updated = notifications.map(notif => 
                                        notif.id === n.id ? { ...notif, read: true } : notif
                                      );
                                      setNotifications(updated);
                                      writeLS("cb_admin_notifications_v3", updated);
                                    }
                                  }}
                                  className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 ${dark ? 'text-slate-400' : 'text-slate-500'}`}
                                  title="Mark as read"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  const res = await adminApi.deleteNotification(n.id);
                                  if (res.ok) {
                                    const updated = notifications.filter(notif => notif.id !== n.id);
                                    setNotifications(updated);
                                    writeLS("cb_admin_notifications_v3", updated);
                                    toast({ title: "Notification deleted" });
                                  }
                                }}
                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-8 text-center ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Bell className="h-12 w-12 mx-auto opacity-30 mb-2" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Support Ticket Alert Badge */}
            {unreadTicketCount > 0 && (
              <div className="relative">
                <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${dark ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}>
                  {unreadTicketCount}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            )}

            <Button variant="ghost" onClick={loadAll} className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Refresh</Button>
          </div>
        </header>

        {/* Top cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className={`border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Total Users</div>
              <div className={`text-3xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{stats?.total_users ?? activeUsers.length}</div>
              <div className={`text-xs mt-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Developers: {stats?.total_developers ?? developers.length} | Investors: {stats?.total_investors ?? investors.length}
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Pending Users</div>
              <div className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{stats?.pending_users ?? developers.filter(d=>d.status==="pending").length}</div>
              <div className={`text-xs mt-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Awaiting approval</div>
            </CardContent>
          </Card>

          <Card className={`border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Projects</div>
              <div className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{stats?.approved_projects ?? projects.filter(p => p.approval_status === 'approved').length}</div>
              <div className={`text-xs mt-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Approved: {stats?.approved_projects ?? 0} | Pending: {stats?.pending_projects ?? 0}</div>
            </CardContent>
          </Card>

          <Card className={`border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Total Investments</div>
              <div className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>₵{(stats?.total_investments ?? investments.reduce((s,i)=>s+(i.amount||0),0)).toLocaleString()}</div>
              <div className={`text-xs mt-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Platform-wide investment volume</div>
            </CardContent>
          </Card>
        </div>

        {/* Main tabs area */}
        <div className={`rounded-xl shadow p-4 transition-colors duration-300 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center gap-4">
              <TabsList className="flex gap-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="phone-requests">
                  Phone Requests
                  {phoneChangeRequests.length > 0 && (
                    <Badge className="ml-2 bg-orange-500 text-white">{phoneChangeRequests.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="support-tickets">
                  Support Tickets
                  {unreadTicketCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">{unreadTicketCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="audit">Audit</TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-3">
                <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search…" className="w-72" />
                <Button variant="outline" onClick={exportUsersCSV}>Export Users</Button>
                <Button variant="outline" onClick={exportProjectsCSV}>Export Projects</Button>
              </div>
            </div>

            {/* Overview */}
            <TabsContent value="overview" className="mt-4">
              <div className="grid lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader><CardTitle>Platform activity</CardTitle></CardHeader>
                  <CardContent>
                    <div style={{ height: 220 }}>
                      {usersByWeek.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usersByWeek}>
                              <XAxis dataKey="label" hide />
                              <YAxis hide />
                              <Tooltip />
                              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="#bfdbfe" />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="p-10 text-center text-slate-400 text-sm">No data yet</div>
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="p-3 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">New Users (last 12)</div>
                        <div className="font-bold">{usersByWeek.reduce((s, x) => s + x.count, 0)}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">Approvals (period)</div>
                        <div className="font-bold">{approvalsOverTime.reduce((s,x)=>s+x.count,0)}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">Pending approvals</div>
                        <div className="font-bold">{users.filter(u=>u.status==="pending").length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Investments by method</CardTitle></CardHeader>
                  <CardContent>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={investmentsByMethod} dataKey="value" nameKey="name" outerRadius={70} fill="#0ea5e9" label>
                            {investmentsByMethod.map((entry, idx) => <Cell key={idx} fill={idx % 2 === 0 ? "#0ea5e9" : "#60a5fa"} />)}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(v)=>`₵${Number(v).toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users" className="mt-4">
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <select className="border rounded px-3 py-2" value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>
                      <option value="">All types</option>
                      <option value="developer">Developer</option>
                      <option value="investor">Investor</option>
                      <option value="user">User</option>
                    </select>
                    <select className="border rounded px-3 py-2" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                      <option value="">Any status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="suspended">Suspended</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" onClick={bulkApprove} disabled={selected.size===0}><ShieldCheck className="w-4 h-4" /> Approve</Button>
                      <Button variant="outline" onClick={bulkReject} disabled={selected.size===0}><Ban className="w-4 h-4" /> Reject</Button>
                    </div>
                  </div>

                  <Card>
                    <CardContent>
                      {loading ? <div className="p-6 text-center"><Loader2 className="animate-spin mx-auto" /></div> : (
                        filteredUsers.length === 0 ? <div className="p-6"><Empty text="No users found" /></div> : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-100">
                                <tr>
                                  <th className="p-3">Select</th>
                                  <th className="p-3">Name</th>
                                  <th className="p-3">Email</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Status</th>
                                  <th className="p-3">Joined</th>
                                  <th className="p-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentPageItems.map(u => (
                                  <tr key={u.id} className="border-t">
                                    <td className="p-3"><input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} /></td>
                                    <td className="p-3 flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-sm font-medium text-blue-800">{initials(u.first_name + " " + u.last_name)}</div>
                                      <div>
                                        <div className="font-medium">{u.first_name} {u.last_name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                      </div>
                                    </td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3"><Badge>{u.user_type}</Badge></td>
                                    <td className="p-3">
                                      {u.status === "approved" && <Badge className="bg-emerald-100 text-emerald-800">Approved</Badge>}
                                      {u.status === "pending" && <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>}
                                      {u.status === "suspended" && <Badge className="bg-rose-100 text-rose-800">Suspended</Badge>}
                                    </td>
                                    <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" onClick={() => handleApproveUser(u.id)}>Approve</Button>
                                        <Button variant="outline" onClick={() => handleRejectUser(u.id)}>Reject</Button>
                                        <Button variant="ghost" onClick={() => handleToggleAdmin(u.id)}>Toggle Admin</Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-slate-500">Showing {(page-1)*pageSize+1} - {Math.min(page*pageSize, filteredUsers.length)} of {filteredUsers.length}</div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => setPage(Math.max(1, page-1))} disabled={page===1}>Prev</Button>
                          <div className="px-3 py-1 bg-slate-100 rounded">{page} / {totalPages}</div>
                          <Button variant="outline" onClick={() => setPage(Math.min(totalPages, page+1))} disabled={page===totalPages}>Next</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <aside>
                  <Card>
                    <CardHeader><CardTitle>Developer approvals</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {developers.filter(d => d.status === "pending").slice(0,6).map(d => (
                          <div key={d.id} className="p-3 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">{d.first_name} {d.last_name}</div>
                              <div className="text-xs text-slate-500">{d.email}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleApproveUser(d.id)}>Approve</Button>
                              <Button variant="outline" onClick={() => handleRejectUser(d.id)}>Reject</Button>
                            </div>
                          </div>
                        ))}
                        {developers.filter(d => d.status === "pending").length === 0 && <div className="text-sm text-slate-500">No pending developers</div>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(notifications || []).map(n => (
                          <div key={n.id} className="p-2 border rounded">
                            <div className="font-medium">{n.title}</div>
                            <div className="text-xs text-slate-500">{new Date(n.date).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-700 mt-1">{n.body}</div>
                          </div>
                        ))}
                        <div className="mt-2 flex gap-2">
                          <Button variant="outline" onClick={() => { writeLS("cb_admin_notifications_v3", []); setNotifications([]); toast({ title: "Notifications cleared" }); }}>Clear</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </TabsContent>

            {/* Projects */}
            <TabsContent value="projects" className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Project approvals</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { writeLS("cb_admin_projects_v3", []); loadAll(); }}>Reset Demo Projects</Button>
                  <Button onClick={exportProjectsCSV}>Export CSV</Button>
                </div>
              </div>
              <Card>
                <CardContent>
                  {projects.length === 0 ? <Empty text="No projects" /> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Developer</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Target</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((p, i) => (
                            <tr key={p.id} className="border-t">
                              <td className="p-3">{i+1}</td>
                              <td className="p-3 font-medium">{p.title}</td>
                              <td className="p-3">{p.developer_name}</td>
                              <td className="p-3"><Badge>{p.status}</Badge></td>
                              <td className="p-3">₵{p.target_funding.toLocaleString()}</td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="outline" onClick={() => alert(`View ${p.id}`)}>View</Button>
                                  <Button onClick={() => handleApproveProject(p.id)}>Approve</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investments */}
            <TabsContent value="investments" className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Investment approvals</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => exportCSV([["id","investor","project","amount"], ...investments.map(i=>[i.id,i.investor_name||i.investor,i.project_title||i.project,i.amount])], `investments_${new Date().toISOString().slice(0,10)}.csv`)}>Export CSV</Button>
                </div>
              </div>

              <Card>
                <CardContent>
                  {investments.length === 0 ? <Empty text="No investments" /> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Investor</th>
                            <th className="p-3">Project</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Method</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investments.map((inv, i) => (
                            <tr key={inv.id} className="border-t">
                              <td className="p-3">{i+1}</td>
                              <td className="p-3">{inv.investor_name || inv.investor}</td>
                              <td className="p-3">{inv.project_title || inv.project}</td>
                              <td className="p-3">₵{inv.amount.toLocaleString()}</td>
                              <td className="p-3">{inv.method}</td>
                              <td className="p-3">{inv.status}</td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button onClick={() => handleUpdateInvestmentStatus(inv.id, "confirmed")}>Confirm</Button>
                                  <Button variant="outline" onClick={() => handleUpdateInvestmentStatus(inv.id, "failed")}>Fail</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Phone Requests */}
            <TabsContent value="phone-requests" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Phone Change Requests
                    {phoneChangeRequests.length > 0 && (
                      <Badge className="bg-orange-500">{phoneChangeRequests.length} Pending</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPhoneRequests ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500 mb-3" />
                      <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Loading phone change requests...</p>
                    </div>
                  ) : phoneChangeRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className={`font-medium ${dark ? 'text-slate-300' : 'text-gray-600'}`}>No pending phone change requests</p>
                      <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>All requests have been processed</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {phoneChangeRequests.map((request) => (
                        <div key={request.id} className={`p-5 rounded-xl border-2 ${dark ? 'bg-slate-900/50 border-slate-700 hover:border-orange-500' : 'bg-orange-50 border-orange-200 hover:border-orange-400'} transition-all duration-200`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0">
                                {request.first_name?.[0]}{request.last_name?.[0]}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={`font-bold text-lg ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
                                    {request.first_name} {request.last_name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">{request.email}</Badge>
                                  {request.user_type && (
                                    <Badge variant="secondary" className="text-xs">{request.user_type}</Badge>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Current Phone:</span>
                                    <span className={`font-mono ${dark ? 'text-slate-300' : 'text-gray-800'}`}>
                                      {request.phone || <span className="text-red-500 italic">Not set</span>}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl text-orange-500">→</span>
                                    <span className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Requested:</span>
                                    <span className="font-mono font-bold text-green-600 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-lg">
                                      {request.phone_change_request}
                                    </span>
                                  </div>
                                  {request.created_at && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                        Requested {new Date(request.updated_at || request.created_at).toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => approvePhoneChange(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => rejectPhoneChange(request.id)}
                                className="min-w-[100px]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tickets */}
            <TabsContent value="support-tickets" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Support Tickets</CardTitle>
                    <div className="flex gap-2">
                      <select 
                        className={`px-3 py-1.5 rounded border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                        onChange={(e) => loadSupportTickets({ status: e.target.value })}
                      >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select 
                        className={`px-3 py-1.5 rounded border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                        onChange={(e) => loadSupportTickets({ category: e.target.value })}
                      >
                        <option value="">All Categories</option>
                        <option value="general">General</option>
                        <option value="investment">Investment</option>
                        <option value="wallet">Wallet</option>
                        <option value="account">Account</option>
                        <option value="technical">Technical</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingSupportTickets ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : supportTickets.length === 0 ? (
                    <Empty text="No support tickets" />
                  ) : (
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <div 
                          key={ticket.id}
                          className={`p-4 rounded-lg border ${dark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
                                  {ticket.subject}
                                </h3>
                                <Badge 
                                  className={
                                    ticket.status === 'open' ? 'bg-blue-500' :
                                    ticket.status === 'in_progress' ? 'bg-yellow-500' :
                                    ticket.status === 'resolved' ? 'bg-green-500' :
                                    'bg-slate-500'
                                  }
                                >
                                  {ticket.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">
                                  {ticket.category}
                                </Badge>
                                {ticket.priority === 'urgent' && (
                                  <Badge className="bg-red-500">Urgent</Badge>
                                )}
                              </div>
                              <p className={`text-sm mb-2 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                                From: <span className="font-medium">{ticket.user?.name || 'Unknown'}</span>
                                {ticket.user?.email && ` (${ticket.user.email})`}
                              </p>
                              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {ticket.message.length > 150 ? `${ticket.message.substring(0, 150)}...` : ticket.message}
                              </p>
                              <p className={`text-xs mt-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Created: {new Date(ticket.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleViewTicket(ticket.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                View & Respond
                              </Button>
                              {ticket.status === 'open' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateTicketStatus(ticket.id, 'in_progress')}
                                >
                                  Start
                                </Button>
                              )}
                              {ticket.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateTicketStatus(ticket.id, 'resolved')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Management */}
            <TabsContent value="news" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>News Articles</CardTitle>
                  <Button 
                    onClick={() => {
                      setEditingNews(null);
                      setNewsForm({ title: "", category: "", excerpt: "", content: "", image: null, is_published: false });
                      setNewsModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create News Article
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingNews ? (
                    <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
                  ) : news.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No news articles yet</div>
                  ) : (
                    <div className="space-y-3">
                      {news.map((article) => (
                        <div key={article.id} className={`p-4 border rounded-xl transition-colors ${dark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <div className="flex gap-4">
                            {article.image && (
                              <img 
                                src={article.image} 
                                alt={article.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                                      {article.title}
                                    </h3>
                                    <Badge className={article.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                      {article.is_published ? 'Published' : 'Draft'}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                                    <span className="font-semibold text-blue-600">{article.category}</span>
                                    <span>•</span>
                                    <span>By {article.author?.name || 'Unknown'}</span>
                                    <span>•</span>
                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <p className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {article.excerpt}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditNews(article)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleToggleNewsPublish(article.id)}
                                className={article.is_published ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}
                              >
                                {article.is_published ? 'Unpublish' : 'Publish'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteNews(article.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit */}
            <TabsContent value="audit" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Audit & activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {audit.length === 0 ? <Empty text="No audit entries" /> : audit.map(a => (
                      <div key={a.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">{a.action.replaceAll("_"," ")}</div>
                          <div className="text-xs text-slate-500">{a.actor} • {new Date(a.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-xs">{JSON.stringify(a.details)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

        {/* Support Ticket Details Modal */}
        <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
          <DialogContent className={`max-w-2xl ${dark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle>Support Ticket Details</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedTicket.subject}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <Badge 
                      className={
                        selectedTicket.status === 'open' ? 'bg-blue-500' :
                        selectedTicket.status === 'in_progress' ? 'bg-yellow-500' :
                        selectedTicket.status === 'resolved' ? 'bg-green-500' :
                        'bg-slate-500'
                      }
                    >
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{selectedTicket.category}</Badge>
                    <Badge className={
                      selectedTicket.priority === 'urgent' ? 'bg-red-500' :
                      selectedTicket.priority === 'high' ? 'bg-orange-500' :
                      'bg-slate-500'
                    }>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${dark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <p className={`text-sm mb-2 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong>From:</strong> {selectedTicket.user?.name || 'Unknown'}
                  </p>
                  <p className={`text-sm mb-2 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong>Email:</strong> {selectedTicket.user?.email || 'N/A'}
                  </p>
                  <p className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong>Created:</strong> {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h4 className={`font-semibold mb-4 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Conversation:
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                    {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                      selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg ${
                            msg.is_admin 
                              ? dark ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                              : dark ? 'bg-slate-700 border border-slate-600' : 'bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${
                              msg.is_admin ? 'text-blue-600 dark:text-blue-400' : dark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {msg.is_admin ? (msg.user?.name || 'Admin') : selectedTicket.user?.name}
                            </span>
                            <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                            {!msg.is_read && !msg.is_admin && (
                              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">New</span>
                            )}
                          </div>
                          <p className={`text-sm ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {msg.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No messages in this conversation yet.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Your Response:
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 rounded border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    placeholder="Type your response here..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setTicketModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleRespondToTicket}
                    disabled={!adminResponse.trim() || respondingToTicket}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {respondingToTicket ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Response'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* News Create/Edit Modal */}
        <Dialog open={newsModalOpen} onOpenChange={setNewsModalOpen}>
          <DialogContent className={`max-w-5xl max-h-[90vh] overflow-y-auto ${dark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Edit News Article' : 'Create News Article'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateNews} className="space-y-4 pb-4">
              {/* Basic Info in 2 columns */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Title *
                  </label>
                  <Input
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                    placeholder="Enter article title"
                    className={dark ? 'bg-slate-700 border-slate-600' : ''}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Category *
                  </label>
                  <select
                    required
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                    className={`w-full px-3 py-2 rounded-md border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                  >
                    <option value="">Select category</option>
                    <option value="Platform News">Platform News</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="Education">Education</option>
                    <option value="Reports">Reports</option>
                    <option value="Announcements">Announcements</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Image
                  </label>
                  {editingNews && editingNews.image && !newsForm.image && (
                    <div className="mb-2">
                      <img 
                        src={editingNews.image} 
                        alt="Current" 
                        className="h-20 w-20 object-cover rounded border-2 border-blue-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">Current image (upload new to replace)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewsForm({...newsForm, image: e.target.files[0]})}
                    className={`w-full px-3 py-2 rounded-md border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                  />
                </div>
              </div>

              {/* Excerpt and Content - Full Width */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Excerpt * (Short description)
                </label>
                <textarea
                  required
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                  placeholder="Brief summary of the article (max 500 characters)"
                  rows={3}
                  maxLength={500}
                  className={`w-full px-3 py-2 rounded-md border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {newsForm.excerpt.length}/500 characters
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Content (Full article)
                </label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                  placeholder="Full article content..."
                  rows={6}
                  className={`w-full px-3 py-2 rounded-md border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                />
              </div>

              {/* SEO Fields Section */}
              <div className="md:col-span-2 border-t-2 border-slate-200 pt-4 mt-2">
                <h3 className={`text-lg font-bold mb-3 ${dark ? 'text-slate-200' : 'text-slate-900'}`}>
                  SEO Settings (Optional)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Meta Title (Max 60 characters)
                    </label>
                    <Input
                      value={newsForm.meta_title}
                      onChange={(e) => setNewsForm({...newsForm, meta_title: e.target.value})}
                      placeholder="Leave empty to use article title"
                      maxLength={60}
                      className={dark ? 'bg-slate-700 border-slate-600' : ''}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      {(newsForm.meta_title || '').length}/60 characters
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Meta Description (Max 160 characters)
                    </label>
                    <textarea
                      value={newsForm.meta_description}
                      onChange={(e) => setNewsForm({...newsForm, meta_description: e.target.value})}
                      placeholder="Leave empty to use excerpt"
                      rows={2}
                      maxLength={160}
                      className={`w-full px-3 py-2 rounded-md border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      {(newsForm.meta_description || '').length}/160 characters
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Meta Keywords (Comma separated)
                    </label>
                    <Input
                      value={newsForm.meta_keywords}
                      onChange={(e) => setNewsForm({...newsForm, meta_keywords: e.target.value})}
                      placeholder="e.g. real estate, investment, Ghana"
                      className={dark ? 'bg-slate-700 border-slate-600' : ''}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                      OG Image (Social Media Share Image)
                    </label>
                    {editingNews && editingNews.og_image && !newsForm.og_image && (
                      <div className="mb-2">
                        <img 
                          src={editingNews.og_image} 
                          alt="Current OG Image" 
                          className="h-20 w-32 object-cover rounded border-2 border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Current OG image (upload new to replace, or leave empty to use main image)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewsForm({...newsForm, og_image: e.target.files[0]})}
                      className={`w-full px-3 py-2 rounded-md border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave empty to use main article image for social sharing</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={newsForm.is_published}
                  onChange={(e) => setNewsForm({...newsForm, is_published: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="is_published" className={`text-sm font-medium ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Publish immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setNewsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingNews ? 'Update Article' : 'Create Article'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// helper exported for reuse by adminApi file (small util)
function exportCSV(rows, filename = "export.csv") {
  const csv = rows.map(r => r.map(c => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}