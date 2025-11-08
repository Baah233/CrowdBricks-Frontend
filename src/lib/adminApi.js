// Lightweight admin API wrapper used by AdminDashboard.
// It uses your existing axios instance (src/lib/api) and normalizes errors and responses.
// Replace or extend endpoints to match your backend routes as needed.

import api from "@/lib/api";

const handle = async (p) => {
  try {
    const res = await p;
    // Check if backend already wrapped response with ok/data structure
    if (res.data && typeof res.data === 'object' && 'ok' in res.data) {
      // Backend already has {ok: true, data: ...} format
      return res.data;
    }
    // Otherwise wrap it
    return { ok: true, data: res.data };
  } catch (err) {
    // Normalize error
    const e = err?.response?.data || { message: err?.message || "Request failed" };
    return { ok: false, error: e };
  }
};

export async function fetchUsers() {
  return handle(api.get("/admin/users"));
}

export async function fetchStats() {
  return handle(api.get("/admin/stats"));
}


export async function approveUser(id) {
  return handle(api.post(`/admin/users/${id}/approve`));
}

export async function rejectUser(id) {
  return handle(api.post(`/admin/users/${id}/reject`));
}

export async function toggleAdminRole(id) {
  return handle(api.post(`/admin/users/${id}/toggle-admin`));
}

export async function fetchProjects() {
  return handle(api.get("/admin/projects"));
}

export async function approveProject(id) {
  return handle(api.post(`/admin/projects/${id}/approve`));
}

export async function fetchInvestments() {
  return handle(api.get("/admin/investments"));
}

export async function updateInvestmentStatus(id, status) {
  return handle(api.patch(`/admin/investments/${id}/status`, { status }));
}

// Notifications (SSE fallback)
export function connectNotificationsSSE(onMessage, onError) {
  // expect backend SSE endpoint: /admin/notifications/stream
  try {
    const url = `${api.defaults.baseURL?.replace(/\/$/, "") || ""}/admin/notifications/stream`;
    const es = new EventSource(url, { withCredentials: true });
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        onMessage && onMessage(data);
      } catch (e) {
        onMessage && onMessage({ title: "notification", body: ev.data });
      }
    };
    es.onerror = (err) => {
      onError && onError(err);
      // We don't close here; caller decides
    };
    return es;
  } catch (e) {
    onError && onError(e);
    return null;
  }
}

// Fallback polling if SSE not available
export async function fetchNotifications() {
  return handle(api.get("/admin/notifications"));
}

export async function markNotificationRead(id) {
  return handle(api.post(`/notifications/${id}/read`));
}

export async function markAllNotificationsRead() {
  return handle(api.post("/notifications/read-all"));
}

export async function deleteNotification(id) {
  return handle(api.delete(`/notifications/${id}`));
}

// Phone change requests
export async function fetchPhoneChangeRequests() {
  return handle(api.get("/admin/phone-change-requests"));
}

export async function approvePhoneChange(id) {
  return handle(api.post(`/admin/phone-change/${id}/approve`));
}

export async function rejectPhoneChange(id) {
  return handle(api.post(`/admin/phone-change/${id}/reject`));
}

// Support tickets
export async function fetchSupportTickets(params = {}) {
  return handle(api.get("/admin/support-tickets", { params }));
}

export async function fetchUnreadTicketCount() {
  return handle(api.get("/admin/support-tickets/unread-count"));
}

export async function fetchSupportTicketById(id) {
  return handle(api.get(`/admin/support-tickets/${id}`));
}

export async function respondToSupportTicket(id, data) {
  return handle(api.post(`/admin/support-tickets/${id}/respond`, data));
}

export async function updateSupportTicketStatus(id, status) {
  return handle(api.patch(`/admin/support-tickets/${id}/status`, { status }));
}

export async function assignSupportTicket(id, adminId) {
  return handle(api.patch(`/admin/support-tickets/${id}/assign`, { admin_id: adminId }));
}

export async function updateSupportTicketPriority(id, priority) {
  return handle(api.patch(`/admin/support-tickets/${id}/priority`, { priority }));
}

// News management
export async function fetchNews() {
  return handle(api.get("/admin/news"));
}

export async function createNews(data) {
  return handle(api.post("/admin/news", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));
}

export async function updateNews(id, data) {
  // Laravel doesn't support PUT with file uploads well, use POST with _method override
  data.append('_method', 'PUT');
  return handle(api.post(`/admin/news/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));
}

export async function deleteNews(id) {
  return handle(api.delete(`/admin/news/${id}`));
}

export async function toggleNewsPublish(id) {
  return handle(api.post(`/admin/news/${id}/toggle-publish`));
}