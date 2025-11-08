import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UsersTable({ users = [], onApprove, onReject, onToggleAdmin }) {
  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr className="text-sm text-slate-600">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {users.map(u => (
            <tr key={u.id}>
              <td className="px-4 py-3">
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-slate-500">{u.username}</div>
              </td>
              <td className="px-4 py-3 text-sm">{u.email}</td>
              <td className="px-4 py-3 text-sm">{u.is_admin ? "Admin" : "User"}</td>
              <td className="px-4 py-3 text-sm"><Badge className={u.is_approved ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"}>{u.is_approved ? "Approved" : "Pending"}</Badge></td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {!u.is_approved && <Button onClick={() => onApprove(u.id)}>Approve</Button>}
                  {!u.is_approved && <Button variant="outline" onClick={() => onReject(u.id)}>Reject</Button>}
                  <Button variant="ghost" onClick={() => onToggleAdmin(u.id)}>{u.is_admin ? "Revoke Admin" : "Make Admin"}</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}