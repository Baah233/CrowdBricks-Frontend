import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AIChatToggle from "@/components/AIChatToggle"; // ✅ add this

// Pages
import Homepage from "@/pages/Homepage";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import InvestorDashboard from "@/pages/InvestorDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import ProjectUploader from "@/pages/ProjectUploader";
import Blog from "@/pages/Blog";
import BlogDetails from "@/pages/BlogDetails";
import Raise from "@/pages/Raise";
import News from "@/pages/News";
import Resources from "@/pages/Resources";


const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetails />} /> 
                <Route path="/raise" element={<Raise />} />
                <Route path="/news" element={<News />} /> 
                <Route path="/resources" element={<Resources />} />

                <Route
                  path="/auth/login"
                  element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="/project-uploader" element={<ProjectUploader />} />
                <Route path="/auth/register" element={<Register />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <AIChatToggle /> {/* ✅ this makes the chat button appear */}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
