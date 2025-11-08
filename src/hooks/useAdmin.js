import { useEffect, useState, useCallback } from "react";
import { adminData } from "@/lib/adminData";

/*
  useAdmin - small hook exposing admin operations and data
  - list: fetch users with filters
  - get: single user
  - approve / suspend / delete / verify
  - audit log
*/

export function useAdmin() {
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async (filter = {}) => {
    setLoading(true);
    try {
      const data = await adminData.listUsers(filter);
      setUsers(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => loadUsers(), [loadUsers]);

  useEffect(() => {
    loadUsers();
    (async () => {
      const log = await adminData.getAuditLog();
      setAudit(log);
    })();
  }, [loadUsers]);

  const approve = useCallback(async (id, actor) => {
    const u = await adminData.updateUserStatus(id, "approved", actor);
    await loadUsers();
    return u;
  }, [loadUsers]);

  const suspend = useCallback(async (id, actor) => {
    const u = await adminData.updateUserStatus(id, "suspended", actor);
    await loadUsers();
    return u;
  }, [loadUsers]);

  const del = useCallback(async (id, actor) => {
    const u = await adminData.deleteUser(id, actor);
    await loadUsers();
    return u;
  }, [loadUsers]);

  const restore = useCallback(async (id, actor) => {
    const u = await adminData.restoreUser(id, actor);
    await loadUsers();
    return u;
  }, [loadUsers]);

  const verify = useCallback(async (id, actor) => {
    const res = await adminData.verifyCredentials(id, actor);
    await loadUsers();
    return res;
  }, [loadUsers]);

  const getAudit = useCallback(async () => {
    const log = await adminData.getAuditLog();
    setAudit(log);
    return log;
  }, []);

  return {
    users,
    audit,
    loading,
    loadUsers,
    refresh,
    approve,
    suspend,
    deleteUser: del,
    restore,
    verify,
    getAudit,
  };
}