import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Grid, Layers, Users, PieChart, Settings } from "lucide-react";

/**
 * Sidebar
 * - collapsible / responsive by the parent layout (here kept expanded)
 * - highlights active route
 */
const nav = [
  { path: "/admin", label: "Overview", icon: <Grid className="h-5 w-5" /> },
  { path: "/admin/projects", label: "Projects", icon: <Layers className="h-5 w-5" /> },
  { path: "/admin/investments", label: "Investments", icon: <PieChart className="h-5 w-5" /> },
  { path: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
  { path: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

export default function Sidebar({ compact = false }) {
  const loc = useLocation();
  return (
    <aside className={`w-64 ${compact ? "hidden lg:block" : ""}`}>
      <nav className="sticky top-16 p-4 space-y-1">
        {nav.map((n) => {
          const active = loc.pathname === n.path || loc.pathname.startsWith(n.path + "/");
          return (
            <Link
              key={n.path}
              to={n.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 ${active ? "" : "text-slate-500"}`}>{n.icon}</span>
              <span className="truncate">{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}