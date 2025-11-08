import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

/**
 * ProjectForm
 * - Create or edit a project with a form that matches ProjectController@store payload
 *
 * Fix in this version:
 * - Send both "target_funding" and "target_amount" (some backends expect one or the other)
 * - Send both the human-friendly `type` and a normalized slug variant (`project_type` / `type_normalized`)
 *   to maximize compatibility with differing backend expectations.
 * - Surface server validation errors for `target_amount` and `type`.
 * - Keep multipart/form-data header override for uploads.
 * - Keep aria-describedby on DialogContent for accessibility.
 */

export default function ProjectForm({ open, onOpenChange, initial = null, onSaved = () => {} }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title || "");
  const [shortDescription, setShortDescription] = useState(initial?.short_description || initial?.shortDescription || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [minimumInvestment, setMinimumInvestment] = useState(initial?.minimum_investment ?? initial?.minimumInvestment ?? 0);
  const [targetFunding, setTargetFunding] = useState(initial?.target_funding ?? initial?.targetFunding ?? 0);
  const [expectedYield, setExpectedYield] = useState(initial?.expected_yield ?? initial?.expectedYield ?? 0);
  const [timeline, setTimeline] = useState(initial?.timeline || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [type, setType] = useState(initial?.type || initial?.project_type || "Residential"); // human-friendly
  const [categories, setCategories] = useState((initial?.categories || []).join?.(",") || "");
  const [tags, setTags] = useState((initial?.tags || []).join?.(",") || "");
  const [milestones, setMilestones] = useState(initial?.milestones || [{ title: "", months: 1 }]);
  const [images, setImages] = useState([]); // File[]
  const [documents, setDocuments] = useState([]); // File[]
  const [submitForApproval, setSubmitForApproval] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) {
      if (!isEdit) {
        setTitle(""); setShortDescription(""); setDescription("");
        setMinimumInvestment(0); setTargetFunding(0); setExpectedYield(0); setTimeline("");
        setLocation(""); setType("Residential"); setCategories(""); setTags(""); setMilestones([{ title: "", months: 1 }]);
        setImages([]); setDocuments([]); setSubmitForApproval(false);
      }
      setError("");
      setFieldErrors({});
    }
  }, [open, isEdit]);

  const addMilestone = () => setMilestones((m) => [...m, { title: "", months: 1 }]);
  const updateMilestone = (idx, key, value) => setMilestones((m) => m.map((mm, i) => i === idx ? { ...mm, [key]: value } : mm));
  const removeMilestone = (idx) => setMilestones((m) => m.filter((_, i) => i !== idx));
  const handleFiles = (e, setter) => setter(Array.from(e.target.files || []));

  const dumpFormData = (fd) => {
    const obj = {};
    for (const pair of fd.entries()) {
      const [k, v] = pair;
      if (v instanceof File) {
        obj[k] = obj[k] || [];
        obj[k].push({ name: v.name, size: v.size, type: v.type });
      } else {
        obj[k] = obj[k] === undefined ? v : [].concat(obj[k], v);
      }
    }
    console.info("ProjectForm FormData:", obj);
  };

  const normalizeType = (t) => {
    if (!t) return "";
    return t.toString().trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w_]/g, "");
  };

  const handleSubmit = async () => {
    setError("");
    setFieldErrors({});
    if (!title || !shortDescription) {
      setError("Title and short description are required.");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("short_description", shortDescription);
      fd.append("description", description);
      fd.append("minimum_investment", String(minimumInvestment));
      fd.append("target_funding", String(targetFunding));
      // include alias expected by some backends
      fd.append("target_amount", String(targetFunding));

      fd.append("expected_yield", String(expectedYield));
      fd.append("timeline", timeline);
      fd.append("location", location);

      // send both forms of type: human and normalized slug
      fd.append("type", type);
      fd.append("project_type", normalizeType(type));
      fd.append("type_normalized", normalizeType(type));

      fd.append("submit_for_approval", submitForApproval ? "1" : "0");

      fd.append("categories", JSON.stringify(categories.split(",").map(s => s.trim()).filter(Boolean)));
      fd.append("tags", JSON.stringify(tags.split(",").map(s => s.trim()).filter(Boolean)));
      fd.append("milestones", JSON.stringify(milestones.map(m => ({ title: m.title, months: Number(m.months) }))));

      images.forEach((f) => fd.append("images[]", f, f.name));
      documents.forEach((f) => fd.append("documents[]", f, f.name));

      // debug
      dumpFormData(fd);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      let res;
      if (isEdit && initial?.id) {
        res = await api.patch(`/projects/${initial.id}`, fd, config);
      } else {
        res = await api.post("/projects", fd, config);
      }

      onSaved(res.data);
    } catch (e) {
      console.error("project save failed", e);
      if (e?.response) {
        const resp = e.response;
        console.warn("Validation errors", resp.data);
        const validationErrors = resp.data?.errors || null;
        if (validationErrors && typeof validationErrors === "object") {
          setFieldErrors(validationErrors);
          const joined = Object.values(validationErrors).flat().join(" ");
          setError(joined || resp.data.message || "Validation failed");
        } else {
          setError(resp.data?.message || `Request failed with status ${resp.status}`);
        }
      } else {
        setError(e.message || "Failed to save project");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="project-form-desc" className="max-w-3xl bg-white dark:bg-white-900">
        <div id="project-form-desc" className="sr-only">
          Form to create or edit a project, including uploads and milestones.
        </div>

        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "Create new project"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          {error && <div className="text-sm text-rose-500">{error}</div>}

          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          {fieldErrors.title && <div className="text-xs text-rose-500">{fieldErrors.title.join(" ")}</div>}

          <Label>Short description</Label>
          <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
          {fieldErrors.short_description && <div className="text-xs text-rose-500">{fieldErrors.short_description.join(" ")}</div>}

          <Label>Full description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
          {fieldErrors.description && <div className="text-xs text-rose-500">{fieldErrors.description.join(" ")}</div>}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Minimum investment (GHS)</Label>
              <Input type="number" value={minimumInvestment} onChange={(e) => setMinimumInvestment(e.target.value)} />
              {fieldErrors.minimum_investment && <div className="text-xs text-rose-500">{fieldErrors.minimum_investment.join(" ")}</div>}
            </div>
            <div>
              <Label>Target funding (GHS)</Label>
              <Input type="number" value={targetFunding} onChange={(e) => setTargetFunding(e.target.value)} />
              {fieldErrors.target_funding && <div className="text-xs text-rose-500">{fieldErrors.target_funding.join(" ")}</div>}
              {fieldErrors.target_amount && <div className="text-xs text-rose-500">{fieldErrors.target_amount.join(" ")}</div>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Expected yield (%)</Label>
              <Input type="number" value={expectedYield} onChange={(e) => setExpectedYield(e.target.value)} />
            </div>
            <div>
              <Label>Timeline (e.g., 12 months)</Label>
              <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Project type</Label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded border px-2 py-1">
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Mixed-use">Mixed-use</option>
              <option value="Land">Land</option>
              <option value="Other">Other</option>
            </select>
            {fieldErrors.type && <div className="text-xs text-rose-500">{fieldErrors.type.join(" ")}</div>}
          </div>

          <div>
            <Label>Tags (comma separated)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          <div>
            <Label>Milestones</Label>
            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input placeholder="Milestone title" value={m.title} onChange={(e) => updateMilestone(idx, "title", e.target.value)} />
                  <Input type="number" className="w-28" value={m.months} onChange={(e) => updateMilestone(idx, "months", e.target.value)} />
                  <Button variant="outline" onClick={() => removeMilestone(idx)}>Remove</Button>
                </div>
              ))}
              <div><Button onClick={addMilestone}>Add milestone</Button></div>
            </div>
          </div>

          <div>
            <Label>Images (hero/gallery) — multiple</Label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e, setImages)} />
            {fieldErrors['images.*'] && <div className="text-xs text-rose-500">{fieldErrors['images.*'].join(" ")}</div>}
          </div>

          <div>
            <Label>Documents (PDFs)</Label>
            <input type="file" accept=".pdf,.doc,.docx" multiple onChange={(e) => handleFiles(e, setDocuments)} />
            {fieldErrors['documents.*'] && <div className="text-xs text-rose-500">{fieldErrors['documents.*'].join(" ")}</div>}
          </div>

          <div className="flex items-center gap-3">
            <input id="submit_for_approval" type="checkbox" checked={submitForApproval} onChange={(e) => setSubmitForApproval(e.target.checked)} />
            <label htmlFor="submit_for_approval" className="text-sm">Submit for admin approval now</label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}