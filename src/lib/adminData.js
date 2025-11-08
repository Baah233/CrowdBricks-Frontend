// Lightweight admin data store & helpers (localStorage-backed demo)
// This simulates server-side admin operations for the CrowdBricks Admin Dashboard.
// In production replace with API calls to your backend (POST /admin/...).

const LS_KEY = "cb_admin_users_v1";
const LS_AUDIT = "cb_admin_audit_v1";

const sampleUsers = [
  {
    id: "u_dev_1",
    name: "GoldKey Ltd",
    email: "dev@goldkey.com",
    type: "developer",
    status: "pending", // pending | approved | suspended | deleted
    createdAt: "2025-01-10T09:00:00Z",
    credentials: {
      idVerified: false,
      docs: [
        { name: "company_certificate.pdf", url: "/docs/company_certificate.pdf" },
      ],
    },
  },
  {
    id: "u_dev_2",
    name: "BlueWave Developers",
    email: "info@bluewave.com",
    type: "developer",
    status: "approved",
    createdAt: "2024-11-02T09:00:00Z",
    credentials: {
      idVerified: true,
      docs: [{ name: "title.pdf", url: "/docs/title.pdf" }],
    },
  },
  {
    id: "u_inv_1",
    name: "Ada Investor",
    email: "ada@example.com",
    type: "investor",
    status: "pending",
    createdAt: "2025-03-12T10:30:00Z",
    credentials: {
      idVerified: false,
      docs: [{ name: "id_front.jpg", url: "/docs/id_front.jpg" }],
    },
  },
  {
    id: "u_inv_2",
    name: "Kwame Mensah",
    email: "kwame@example.com",
    type: "investor",
    status: "approved",
    createdAt: "2024-09-20T08:20:00Z",
    credentials: {
      idVerified: true,
      docs: [],
    },
  },
];

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(sampleUsers));
      return [...sampleUsers];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("adminData read error", e);
    return [...sampleUsers];
  }
}

function writeStore(users) {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

function readAudit() {
  try {
    const raw = localStorage.getItem(LS_AUDIT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function audit(action, actor = "system", details = {}) {
  const entries = readAudit();
  const entry = {
    id: `audit_${Date.now()}`,
    action,
    actor,
    details,
    timestamp: new Date().toISOString(),
  };
  entries.unshift(entry);
  localStorage.setItem(LS_AUDIT, JSON.stringify(entries));
  return entry;
}

// Public API
export const adminData = {
  listUsers: async (filter = {}) => {
    // Simulate server latency
    await new Promise((r) => setTimeout(r, 200));
    const all = readStore();
    let result = all;
    if (filter.type) result = result.filter((u) => u.type === filter.type);
    if (filter.status) result = result.filter((u) => u.status === filter.status);
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q));
    }
    return result;
  },

  getUser: async (id) => {
    await new Promise((r) => setTimeout(r, 120));
    return readStore().find((u) => u.id === id) ?? null;
  },

  updateUserStatus: async (id, status, actor = "admin") => {
    await new Promise((r) => setTimeout(r, 250));
    const users = readStore();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    users[idx] = { ...users[idx], status };
    writeStore(users);
    audit("update_status", actor, { id, status });
    return users[idx];
  },

  verifyCredentials: async (id, actor = "admin") => {
    await new Promise((r) => setTimeout(r, 400));
    const users = readStore();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    users[idx].credentials = users[idx].credentials || {};
    users[idx].credentials.idVerified = true;
    users[idx].status = users[idx].status === "pending" ? "approved" : users[idx].status;
    writeStore(users);
    const entry = audit("verify_credentials", actor, { id });
    return { user: users[idx], audit: entry };
  },

  deleteUser: async (id, actor = "admin") => {
    await new Promise((r) => setTimeout(r, 200));
    let users = readStore();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    // Soft-delete: mark deleted
    users[idx].status = "deleted";
    writeStore(users);
    audit("delete_user", actor, { id });
    return users[idx];
  },

  restoreUser: async (id, actor = "admin") => {
    await new Promise((r) => setTimeout(r, 200));
    let users = readStore();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    users[idx].status = "approved";
    writeStore(users);
    audit("restore_user", actor, { id });
    return users[idx];
  },

  addUser: async (user, actor = "system") => {
    await new Promise((r) => setTimeout(r, 200));
    const users = readStore();
    const newUser = { id: `u_${Date.now()}`, createdAt: new Date().toISOString(), ...user };
    users.unshift(newUser);
    writeStore(users);
    audit("create_user", actor, { id: newUser.id });
    return newUser;
  },

  getAuditLog: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return readAudit();
  },
};