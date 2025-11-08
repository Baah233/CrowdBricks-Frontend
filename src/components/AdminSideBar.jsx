import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Layers, DollarSign } from "lucide-react";

export default function AdminSidebar() {
  const loc = useLocation();
  const nav = [
    { path: "/admin", label: "Overview", icon: <Layers className="h-5 w-5" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/projects", label: "Projects", icon: <Layers className="h-5 w-5" /> },
    { path: "/admin/investments", label: "Investments", icon: <DollarSign className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 hidden lg:block">
      <nav className="sticky top-16 p-4 space-y-2">
        {nav.map((n) => {
          const active = loc.pathname === n.path || loc.pathname.startsWith(n.path + "/");
          return (
            <Link key={n.path} to={n.path} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}