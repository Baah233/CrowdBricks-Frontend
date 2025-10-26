import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Pages
import Homepage from "@/pages/Homepage";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import InvestorDashboard from "@/pages/InvestorDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About"; // 👈 newly added
import ProjectUploader from "@/pages/ProjectUploader";

const queryClient = new QueryClient();

// ✅ Reusable protected route wrapper
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} /> {/* 👈 About page */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                 <Route
                    path="/auth/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />}
                  />
                  <Route path="/project-uploader" element={<ProjectUploader />} />

                <Route path="/auth/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard/investor"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <InvestorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/developer"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <DeveloperDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
