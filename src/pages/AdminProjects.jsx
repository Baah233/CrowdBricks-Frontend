import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import api from "@/lib/api";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/admin/projects");
      setProjects(res.data);
    } catch (e) { setProjects([]); console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => { await api.post(`/admin/projects/${id}/approve`); load(); };
  const reject = async (id) => { await api.post(`/admin/projects/${id}/reject`); load(); };

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3"><AdminSidebar /></div>
        <main className="col-span-12 lg:col-span-9">
          <h1 className="text-xl font-bold mb-4">Project approvals</h1>
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="p-3 bg-white rounded border flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.developer?.name} • {p.location}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(p.id)} className="bg-emerald-600 text-white px-3 py-1 rounded">Approve</button>
                  <button onClick={() => reject(p.id)} className="bg-rose-500 text-white px-3 py-1 rounded">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}