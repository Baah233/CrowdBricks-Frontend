import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, TrendingUp, MapPin } from "lucide-react";
import api from "@/lib/api";

export function ProjectWatchlist({ dark }) {
  const [watchlist, setWatchlist] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWatchlist();
    loadAvailableProjects();
  }, []);

  const loadWatchlist = async () => {
    try {
      const stored = localStorage.getItem("project_watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load watchlist", err);
    }
  };

  const loadAvailableProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects?status=active&limit=5");
      if (res?.data) {
        setAvailableProjects(Array.isArray(res.data) ? res.data : res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (projectId) => {
    const newWatchlist = watchlist.includes(projectId)
      ? watchlist.filter(id => id !== projectId)
      : [...watchlist, projectId];
    
    setWatchlist(newWatchlist);
    localStorage.setItem("project_watchlist", JSON.stringify(newWatchlist));
  };

  const isWatched = (projectId) => watchlist.includes(projectId);

  return (
    <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
          <Eye className="h-5 w-5 text-blue-500" />
          Project Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-20 rounded-lg animate-pulse ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
            ))}
          </div>
        ) : availableProjects.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No projects available
          </div>
        ) : (
          <div className="space-y-3">
            {availableProjects.map(project => (
              <div
                key={project.id}
                className={`p-3 rounded-lg border transition-all ${
                  isWatched(project.id)
                    ? dark
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-blue-500 bg-blue-50"
                    : dark
                    ? "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {project.title}
                      {isWatched(project.id) && (
                        <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-600 border-blue-600">
                          Watching
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </span>
                      )}
                      {project.expected_roi && (
                        <span className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          {project.expected_roi}% ROI
                        </span>
                      )}
                    </div>
                    
                    {project.target_funding && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-medium">
                            {Math.round((project.current_funding / project.target_funding) * 100)}%
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, (project.current_funding / project.target_funding) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWatchlist(project.id)}
                    className="ml-2"
                  >
                    {isWatched(project.id) ? (
                      <EyeOff className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
