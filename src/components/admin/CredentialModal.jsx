import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Check, X } from "lucide-react";

/*
  CredentialModal
  - props:
    open, onOpenChange, user, onVerify
  - shows uploaded docs and ability to mark credentials verified
*/

export const CredentialModal = ({ open, onOpenChange, user, onVerify, verifying }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Credentials — {user.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-slate-700">Account status: <strong className="capitalize">{user.status}</strong></div>
          <div>
            <h4 className="font-semibold">Identity documents</h4>
            <div className="mt-2 space-y-2">
              {(user.credentials?.docs || []).length ? (
                user.credentials.docs.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div className="text-sm">
                        <div>{d.name}</div>
                        <div className="text-xs text-slate-500">{d.url}</div>
                      </div>
                    </div>
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View</a>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No documents uploaded.</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}><X className="h-4 w-4 mr-2" />Close</Button>
            <Button onClick={() => onVerify(user.id)} disabled={verifying}><Check className="h-4 w-4 mr-2" />Verify & Approve</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialModal;