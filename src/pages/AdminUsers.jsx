import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import UsersTable from "@/components/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Check, X, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AdminUsers() {
  const [dark, setDark] = useState(() => localStorage.getItem("cb_user_theme_pref") === "dark");
  const [users, setUsers] = useState([]);
  const [phoneChangeRequests, setPhoneChangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(()=>{ document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (e) {
      setUsers([]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadPhoneChangeRequests = async () => {
    setLoadingRequests(true);
    try {
      console.log("Fetching phone change requests...");
      const res = await api.get("/admin/phone-change-requests");
      console.log("Phone change requests - Full response:", res);
      console.log("Phone change requests - res.data:", res.data);
      console.log("Phone change requests - res.data.requests:", res.data?.requests);
      
      // Backend returns { ok: true, requests: [...] }
      const requests = res.data?.requests || res.data || [];
      console.log("Phone change requests - Final requests array:", requests);
      console.log("Phone change requests - Array length:", requests.length);
      
      setPhoneChangeRequests(requests);
    } catch (e) {
      setPhoneChangeRequests([]);
      console.error("Error loading phone change requests:", e);
      console.error("Error response:", e.response);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(()=>{ 
    console.log("🚀 AdminUsers Component Loaded - Version: Nov 7, 2025 - Latest");
    console.log("📊 Initial state - phoneChangeRequests:", phoneChangeRequests.length);
    load();
    loadPhoneChangeRequests();
  }, []);

  const approveUser = async (id) => { await api.post(`/admin/users/${id}/approve`); load(); };
  const rejectUser = async (id) => { await api.post(`/admin/users/${id}/reject`); load(); };
  const toggleAdmin = async (id) => { await api.post(`/admin/users/${id}/toggle-admin`); load(); };

  const approvePhoneChange = async (id) => {
    try {
      await api.post(`/admin/phone-change/${id}/approve`);
      alert("Phone change approved successfully");
      loadPhoneChangeRequests();
      load();
    } catch (e) {
      alert("Failed to approve phone change");
      console.error(e);
    }
  };

  const rejectPhoneChange = async (id) => {
    try {
      await api.post(`/admin/phone-change/${id}/reject`);
      alert("Phone change rejected");
      loadPhoneChangeRequests();
      load();
    } catch (e) {
      alert("Failed to reject phone change");
      console.error(e);
    }
  };

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-900 text-slate-100" : "bg-[#f7fbff] text-slate-900"}`}>
      <AdminNavbar dark={dark} onToggleDark={() => setDark(d => !d)} />
      <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3"><AdminSidebar /></div>
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <h1 className="text-xl font-bold">User management</h1>
          
          {/* UPDATED VERSION - 2025-11-07 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg mb-4">
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
              🔧 DEBUG PANEL - Updated Version (Nov 7, 2025)
            </p>
            <div className="space-y-2">
              <p className="text-sm font-mono">
                <strong>Phone Change Requests Count:</strong> {phoneChangeRequests.length}
              </p>
              <p className="text-sm font-mono">
                <strong>Loading Status:</strong> {loadingRequests ? '⏳ Loading...' : '✅ Loaded'}
              </p>
              {phoneChangeRequests.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-bold mb-1">Request Data:</p>
                  <pre className="text-xs bg-white dark:bg-slate-800 p-2 rounded overflow-auto max-h-60 border">
                    {JSON.stringify(phoneChangeRequests, null, 2)}
                  </pre>
                </div>
              )}
              {phoneChangeRequests.length === 0 && !loadingRequests && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  ⚠️ No phone change requests found. Check console for API response.
                </p>
              )}
            </div>
          </div>
          
          {/* Phone Change Requests */}
          {phoneChangeRequests.length > 0 && (
            <Card className={dark ? "bg-slate-800 border-slate-700" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-500" />
                  Phone Change Requests
                  <Badge className="bg-orange-500">{phoneChangeRequests.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                    <p className="text-sm text-gray-500 mt-2">Loading requests...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {phoneChangeRequests.map((request) => (
                      <div key={request.id} className={`p-4 rounded-lg border ${dark ? "bg-slate-900/50 border-slate-700" : "bg-gray-50"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{request.first_name} {request.last_name}</span>
                              <Badge variant="outline">{request.email}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className={dark ? "text-slate-400" : "text-gray-500"}>Old: </span>
                                <span className="font-mono">{request.phone || "Not set"}</span>
                              </div>
                              <span className="text-orange-500">→</span>
                              <div>
                                <span className={dark ? "text-slate-400" : "text-gray-500"}>New: </span>
                                <span className="font-mono font-medium text-green-600">{request.phone_change_request}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => approvePhoneChange(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => rejectPhoneChange(request.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
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
          )}
          
          <UsersTable users={users} onApprove={approveUser} onReject={rejectUser} onToggleAdmin={toggleAdmin} />
        </main>
      </div>
    </div>
  );
}