import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import ProjectForm from "@/components/ProjectForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * ProjectManager
 * - lists the current user's projects (GET /user/projects)
 * - allows edit, upload updates, add milestones, submit for approval
 * - listens for 'cb.projects.changed' event (created/edited) to refresh
 */
export default function ProjectManager({ query = "", onRefresh = () => {} }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateFiles, setUpdateFiles] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/projects");
      if (res?.data) setProjects(res.data);
    } catch (e) {
      console.warn("Failed to fetch user projects, using empty list", e);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onChanged = () => load();
    window.addEventListener("cb.projects.changed", onChanged);
    return () => window.removeEventListener("cb.projects.changed", onChanged);
  }, []);

  useEffect(() => {
    // allow external refresh to re-fetch projects
    load();
  }, [query, onRefresh]);

  const openEdit = (p) => {
    setEditing(p);
    setShowEditForm(true);
  };

  const openUpdate = (p) => {
    setSelectedProject(p);
    setShowUpdateDialog(true);
  };

  const submitForApproval = async (p) => {
    try {
      await api.post(`/projects/${p.id}/submit`);
      await load();
      onRefresh();
      alert("Project submitted for admin approval");
    } catch (e) {
      console.error(e);
      alert("Submission failed");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedProject) return;
    const fd = new FormData();
    fd.append("title", updateTitle);
    fd.append("content", updateContent);
    updateFiles.forEach((f) => fd.append("files[]", f, f.name));
    try {
      await api.post(`/projects/${selectedProject.id}/updates`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowUpdateDialog(false);
      setUpdateTitle(""); setUpdateContent(""); setUpdateFiles([]);
      await load();
    } catch (e) {
      console.error("update upload failed", e);
      alert("Failed to add update");
    }
  };

  return (
    <div>
      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-500">Loading projects…</div>}

        {!loading && projects.length === 0 && <div className="p-4 text-sm text-slate-500">You have no projects yet.</div>}

        {projects.map((p) => (
          <div key={p.id} className="p-3 bg-white dark:bg-slate-800 border rounded flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-slate-500">{p.location} • {p.investors} investors</div>
              <div className="mt-2 flex gap-2">
                <Badge className="bg-blue-50 text-blue-700">{p.status || "draft"}</Badge>
                {p.approval_status === "pending" && <Badge className="bg-yellow-100 text-yellow-800">Pending approval</Badge>}
                {p.approval_status === "approved" && <Badge className="bg-emerald-100 text-emerald-800">Approved</Badge>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
              <Button variant="outline" onClick={() => openUpdate(p)}>Add update</Button>
              <Button onClick={() => submitForApproval(p)}>Submit</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create form dialog */}
      <ProjectForm
        open={showEditForm}
        onOpenChange={(v) => {
          setShowEditForm(v);
          if (!v) setEditing(null);
        }}
        initial={editing}
        onSaved={() => {
          load();
          onRefresh();
          setShowEditForm(false);
        }}
      />

      {/* Update dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add update for {selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 p-2">
            <Label>Title</Label>
            <Input value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
            <Label>Content</Label>
            <textarea className="w-full border rounded p-2" rows={5} value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} />
            <Label>Files (optional)</Label>
            <input type="file" multiple onChange={(e) => setUpdateFiles(Array.from(e.target.files || []))} />
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdateSubmit}>Post update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}