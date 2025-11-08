import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import api from "@/lib/api";

export default function AdminInvestments() {
  const [investments, setInvestments] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/admin/investments");
      setInvestments(res.data.data || res.data || []);
    } catch (e) { setInvestments([]); console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => { await api.patch(`/admin/investments/${id}/status`, { status }); load(); };

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3"><AdminSidebar /></div>
        <main className="col-span-12 lg:col-span-9">
          <h1 className="text-xl font-bold mb-4">Investment approvals</h1>
          <div className="space-y-3">
            {investments.map(inv => (
              <div key={inv.id} className="p-3 bg-white rounded border flex items-center justify-between">
                <div>
                  <div className="font-semibold">{inv.project_title} • ₵{inv.amount.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{inv.investor_name} — {inv.method || inv.payment_method}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(inv.id, "confirmed")} className="bg-emerald-600 text-white px-3 py-1 rounded">Confirm</button>
                  <button onClick={() => updateStatus(inv.id, "failed")} className="bg-rose-500 text-white px-3 py-1 rounded">Fail</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}