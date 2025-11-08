import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AIChatToggle from "@/components/AIChatToggle";
import { useAuth } from "@/context/AuthContext"; // ✅ global auth

// Pages
import Homepage from "@/pages/Homepage";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import InvestorDashboard from "@/pages/InvestorDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import DeveloperDashboardNew from "@/pages/DeveloperDashboardNew"; // NEW comprehensive dashboard
import AdminDashboard from "@/pages/AdminDashboard"; // ✅ added admin dashboard
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import ProjectUploader from "@/pages/ProjectUploader";
import Raise from "@/pages/Raise";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Resources from "@/pages/Resources";
import Events from "@/pages/Events";
import Testimonials from "@/pages/Testimonials";
import TaxOverview from "@/pages/TaxOverview";
import Statistics from "@/pages/Statistics";
import HowItWorks from "@/pages/HowItWorks";
import Help from "@/pages/Help";
import Contacts from "@/pages/Contacts";
import InvestorSettings from "@/pages/InvestorSettings";
import Profile from "@/pages/ProfileEnhanced";
import Unauthorized from "@/pages/Unauthorized";
import AdminLogin from "@/pages/AdminLogin";
import AdminUsers from "@/pages/AdminUsers";
import AdminProjects from "@/pages/AdminProjects";
import AdminInvestments from "@/pages/AdminInvestments";
import ProtectedAdmin from "@/components/ProtectedAdmin";


const queryClient = new QueryClient();

// ✅ Role-based protected route
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { token, userType } = useAuth();

  if (!token) return <Navigate to="/auth/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userType))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

const App = () => {
  const { token, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard/');

  // ✅ Auto-redirect logged-in users away from login page
  useEffect(() => {
    const path = window.location.pathname;

    if (token && path.startsWith("/auth/login")) {
      // redirect based on role
      const redirectPath =
        userType === "admin"
          ? "/dashboard/admin"
          : userType === "investor"
          ? "/dashboard/investor"
          : "/dashboard/developer";

      navigate(redirectPath, { replace: true });
    }
  }, [token, userType, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Only show Navbar on non-dashboard routes */}
          {!isDashboardRoute && <Navbar />}
          <main className="flex-1">
            <Routes>
              {/* 🌍 Public pages */}
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/raise" element={<Raise />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/taxoverview" element={<TaxOverview />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/howitworks" element={<HowItWorks />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/investorsettings" element={<InvestorSettings />} />
              <Route path="/project-uploader" element={<ProjectUploader />} />
              
              {/* 👤 Profile route */}
              <Route path="/profile" element={<Profile />} />

              {/* 🔐 Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/admin-login" element={<AdminLogin />} />

              <Route element={<ProtectedAdmin />}>
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/investments" element={<AdminInvestments />} />
              <Route path="/admin" element={<AdminProjects />} /> {/* dashboard landing */}
            </Route>

              {/* 🧭 Protected dashboards */}
              <Route
                path="/dashboard/investor"
                element={
                  <ProtectedRoute allowedRoles={["investor"]}>
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/developer"
                element={
                  <ProtectedRoute allowedRoles={["developer"]}>
                    <DeveloperDashboardNew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/developer/old"
                element={
                  <ProtectedRoute allowedRoles={["developer"]}>
                    <DeveloperDashboard />
                  </ProtectedRoute>
                }
              />
              {/* ✅ New admin dashboard route */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 🚫 Unauthorized and 404 */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Only show Footer on non-dashboard routes */}
          {!isDashboardRoute && <Footer />}
          <AIChatToggle />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
