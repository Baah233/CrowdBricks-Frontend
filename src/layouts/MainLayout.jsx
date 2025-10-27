import React from "react";
import AIChatToggle from "@/components/AIChatToggle";

/*
  MainLayout
  - Simple layout wrapper used by top-level pages (Homepage, Raise, ProjectDetails, etc.)
  - Keeps Navbar and Footer consistent and places the AIChatToggle globally.
  - Usage: wrap page content with <MainLayout> ... </MainLayout>
*/

export default function MainLayout({ children, }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-slate-900 px-
    ">
 

      <main className="flex-1">{children}</main>

 

      {/* Global AI assistant toggle */}
      <AIChatToggle />
    </div>
  );
}
