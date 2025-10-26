import React from "react";
import { projects } from "@/lib/data";
import api from "@/lib/api";

const ProjectUploader = () => {
  const handleUpload = async () => {
    try {
      for (const project of projects) {
        const formData = new FormData();

        formData.append("title", project.title);
        formData.append("short_description", project.description);
        formData.append("full_description", project.description);
        formData.append("target_amount", project.targetFunding);
        formData.append("raised_amount", project.currentFunding || 0);
        formData.append("category", project.type || "general");
        formData.append("is_active", true);

        // ✅ match the backend field name for the image
        if (project.image) {
          try {
            const response = await fetch(project.image);
            const blob = await response.blob();
            const file = new File([blob], `${project.title}.jpg`, { type: blob.type });
            formData.append("image", file);
          } catch (imgError) {
            console.warn(`⚠️ Could not attach image for ${project.title}`, imgError);
          }
        }

        // ✅ Send request
        const res = await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(`✅ Uploaded: ${project.title}`, res.data);
      }

      alert("🎉 All projects uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.response?.data || error);
      alert("Upload failed — check console for details.");
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Upload Dummy Projects to Backend
      </h1>
      <button
        onClick={handleUpload}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Upload All Projects
      </button>
    </div>
  );
};

export default ProjectUploader;
