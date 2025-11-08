import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, Slash, UserCheck } from "lucide-react";

/*
  UserRow: simple row for user listing with actions
  props:
    user, onApprove, onSuspend, onDelete, onViewCred
*/

export const UserRow = ({ user, onApprove, onSuspend, onDelete, onViewCred }) => {
  const statusClass = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-50 text-blue-700",
    suspended: "bg-rose-100 text-rose-700",
    deleted: "bg-slate-100 text-slate-600",
  }[user.status] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="p-3 border rounded flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-medium text-slate-700">
          {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-slate-500">{user.email} • {user.type}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className={statusClass}>{user.status}</Badge>
        <Button size="sm" variant="outline" onClick={() => onViewCred(user)}><UserCheck className="h-4 w-4 mr-2" />Creds</Button>
        {user.status !== "approved" && (
          <Button size="sm" onClick={() => onApprove(user.id)}><Check className="h-4 w-4 mr-2" />Approve</Button>
        )}
        {user.status !== "suspended" && user.status !== "deleted" && (
          <Button size="sm" variant="destructive" onClick={() => onSuspend(user.id)}><Slash className="h-4 w-4 mr-2" />Suspend</Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onDelete(user.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default UserRow;