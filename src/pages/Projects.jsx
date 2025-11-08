import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  TrendingUp, 
  Building2, 
  MapPin, 
  ChevronRight,
  Filter,
  Sparkles,
  Target,
  CheckCircle,
} from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "mixed-use", label: "Mixed Use" },
  { key: "refurbishment", label: "Refurbishment" },
];

const STATUSES = [
  { key: "all", label: "All" },
  { key: "active", label: "Funding" },
  { key: "funded", label: "Funded" },
  { key: "completed", label: "Completed" },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    funded: 0,
    completed: 0,
  });
  const perPage = 9;

  const abortRef = useRef();

  // Fetch stats separately (all projects)
  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get("/projects", {
          params: { per_page: 1000 }, // Get all projects for stats
        });
        
        const data = response?.data;
        const allProjects = data?.data || data || [];
        
        setStats({
          total: Array.isArray(allProjects) ? allProjects.length : (data?.total || 0),
          active: allProjects.filter(p => p.funding_status === 'active' || p.funding_status === 'funding').length,
          funded: allProjects.filter(p => p.funding_status === 'funded').length,
          completed: allProjects.filter(p => p.funding_status === 'completed').length,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    
    loadStats();
  }, []); // Load stats once on mount

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function loadProjects() {
      try {
        setLoading(true);
        const params = {
          q: query || undefined,
          category: category === "all" ? undefined : category,
          status: status === "all" ? undefined : status,
          sort: sort || undefined,
          page,
          per_page: perPage,
        };

        const response = await api.get("/projects", {
          params,
          signal: controller.signal,
        });

        // Handle Laravel pagination response
        const data = response?.data;
        if (data?.data) {
          // Paginated response
          setProjects(Array.isArray(data.data) ? data.data : []);
          setTotalPages(data.last_page || 1);
        } else {
          // Direct array response
          const payload = Array.isArray(data) ? data : [];
          setProjects(payload);
          setTotalPages(Math.max(1, Math.ceil(payload.length / perPage)));
        }
      } catch (err) {
        if (!controller.signal.aborted) setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
    return () => controller.abort();
  }, [category, status, sort, page, query]);

  const totalProjects = stats.total;
  const activeProjects = stats.active;
  const fundedProjects = stats.funded;
  const completedProjects = stats.completed;

  const displayed = projects; // Projects are already paginated from the API

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const { ref, inView } = useInView({ threshold: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start({ count: 1 });
  }, [controls, inView]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="animate-pulse text-blue-200 text-lg font-semibold">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        <div className="bg-red-500/10 backdrop-blur-md border-2 border-red-500/30 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 mb-4 text-center">{error}</p>
          <Button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Global background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
        
        {/* Moving gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
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
      </div>
      
      {/* ===== MODERN HERO ===== */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-800/95 backdrop-blur-sm">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <motion.img
          src="/invest.png"
          alt="Investment Opportunities"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-blue-900/60 to-slate-900/80" />
        
        <div className="relative z-10 text-center px-6 text-white max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border-0">
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Premium Investment Opportunities
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black leading-tight mb-4"
          >
            Explore Property{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
              Investments
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
          >
            Discover vetted property projects — filter by category, funding
            status, or search by location and name.
          </motion.p>
        </div>
      </section>

      {/* ===== STATS COUNTERS - REDESIGNED ===== */}
      <section
        ref={ref}
        className="py-16 bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-md relative border-b border-white/10"
      >
        {/* Glowing accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping animation-delay-1000"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                label: "Total Projects", 
                value: totalProjects, 
                icon: Building2,
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50"
              },
              { 
                label: "Active Investments", 
                value: activeProjects,
                icon: TrendingUp,
                color: "from-green-500 to-emerald-600",
                bgColor: "bg-green-50"
              },
              { 
                label: "Funded", 
                value: fundedProjects,
                icon: Target,
                color: "from-yellow-500 to-amber-600",
                bgColor: "bg-yellow-50"
              },
              { 
                label: "Completed", 
                value: completedProjects,
                icon: CheckCircle,
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50"
              },
            ].map((item, i) => (
              <CounterCard key={i} {...item} inView={inView} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTER BAR - MODERNIZED ===== */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl relative"
      >
        {/* Glowing border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="flex items-center w-full md:w-2/5 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all hover:border-white/20">
              <Search className="h-5 w-5 text-blue-400 mr-3" />
              <Input
                placeholder="Search by name, location or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-none bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-400 hidden md:block" />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white font-semibold rounded-xl w-40 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white font-semibold rounded-xl w-40 hover:border-green-400 transition-colors">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border-2 border-yellow-400/30 text-white font-semibold rounded-xl w-44 hover:border-yellow-400 transition-colors">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="highest_raised">Highest Raised</SelectItem>
                  <SelectItem value="highest_yield">Highest Yield</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== PROJECT GRID - ENHANCED ===== */}
      <section className="container mx-auto px-6 py-16 relative z-10">
        {displayed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
          >
            <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-blue-200">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((project) => {
              const raised = project.current_funding ?? project.raised_amount ?? 0;
              const target = project.target_funding ?? project.target_amount ?? 1;
              const pct = Math.min(100, (raised / target) * 100);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                  className="group relative bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all border-2 border-white/10 hover:border-blue-400/50"
                >
                  {/* Glowing hover effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-700">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                        <Building2 className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`
                        ${project.funding_status === 'active' ? 'bg-green-500 text-white' : ''}
                        ${project.funding_status === 'funded' ? 'bg-blue-500 text-white' : ''}
                        ${project.funding_status === 'completed' ? 'bg-purple-500 text-white' : ''}
                        px-3 py-1 font-bold capitalize shadow-lg
                      `}>
                        {project.funding_status ?? "Active"}
                      </Badge>
                    </div>

                    {/* Location badge */}
                    {project.location && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        <span className="text-xs font-semibold text-slate-700">{project.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-blue-200 line-clamp-2 mb-4 leading-relaxed">
                      {project.short_description ?? "A premium real estate investment opportunity."}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-blue-300">Funding Progress</span>
                        <span className="text-xs font-bold text-yellow-400">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden border border-white/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-yellow-500 rounded-full shadow-lg shadow-blue-500/50"
                          style={{ width: `${Math.min(100, pct)}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, pct)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-blue-300 mb-1">Raised</div>
                        <div className="text-sm font-bold text-white">{money(raised)}</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-blue-300 mb-1">Target</div>
                        <div className="text-sm font-bold text-white">{money(target)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-400/30">
                        <div className="text-xs text-green-300 mb-1">Expected Yield</div>
                        <div className="text-sm font-bold text-green-400">{project.expected_yield}%</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-400/30">
                        <div className="text-xs text-blue-300 mb-1">Investors</div>
                        <div className="text-sm font-bold text-blue-400">{project.investors || 0}</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link to={`/projects/${project.slug || project.id}`}>
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all group">
                        View Details
                        <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-500/20 font-semibold rounded-xl disabled:opacity-30 text-white"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl border-2 border-blue-400/30 shadow-lg">
              <span className="text-sm font-bold text-white">
                Page {page} of {totalPages}
              </span>
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-500/20 font-semibold rounded-xl disabled:opacity-30 text-white"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function CounterCard({ label, value, inView, icon: Icon, color, bgColor }) {
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.05, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Glowing border on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${color} rounded-2xl opacity-0 group-hover:opacity-75 blur transition duration-500`}></div>
      
      <div className="relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all p-6 text-center group-hover:border-white/40">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4`}>
          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <motion.h3
          className={`text-4xl font-black text-white drop-shadow-lg mb-2`}
          initial={{ count: 0 }}
          animate={{ count: inView ? value : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {Math.round(value)}
        </motion.h3>
        <p className="text-sm font-semibold text-blue-200">{label}</p>
        
        {/* Decorative glow */}
        <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${color} rounded-full opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
      </div>
    </motion.div>
  );
}

function money(n) {
  if (typeof n !== "number") return "₵0";
  return `₵${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
