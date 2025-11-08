import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userType, token, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const learnRef = useRef(null);
  const userMenuRef = useRef(null);
  const isAuthenticated = !!token;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast({
      title: "You’ve been logged out 👋",
      description: "See you soon!",
    });
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Invest", path: "/projects" },
    { name: "Raise", path: "/raise" },
    { name: "News", path: "/news" },
  ];

  const learnItems = [
    { name: "Help / FAQs", path: "/help" },
    { name: "How It Works", path: "/howitworks" },
    { name: "Statistics", path: "/statistics" },
    { name: "Tax Overview", path: "/taxoverview" },
    { name: "Customer Feedback", path: "/testimonials" },
    { name: "Training & Events", path: "/events" },
    { name: "Free Resources", path: "/resources" },
    { name: "Blog", path: "/news" },
  ];

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "U";

  // detect scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (learnRef.current && !learnRef.current.contains(e.target)) setLearnOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setOpenUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out border-b ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-blue-50 shadow-md"
          : "bg-transparent border-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 transition-colors duration-700">
        {/* ===== Logo ===== */}
        <Link
          to="/"
          className={`flex items-center gap-2 sm:gap-3 group transition-all duration-500 ${
            scrolled ? "text-blue-700" : "text-white"
          }`}
          aria-label="CrowdBricks home"
        >
          <motion.span
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              scrolled ? "text-blue-600" : "text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className={scrolled ? "text-blue-400" : "text-blue-600"}>Crowd</span><span className={scrolled ? "text-yellow-400" : "text-yellow-300"}>Bricks</span>
          </motion.span>
        </Link>

        {/* ===== Desktop Nav ===== */}
        <nav
          className={`hidden lg:flex items-center space-x-6 font-medium transition-colors duration-500 ${
            scrolled ? "text-slate-700" : "text-white"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative py-1 text-sm transition-colors ${
                isActive(item.path)
                  ? scrolled
                    ? "text-blue-700 font-semibold"
                    : "text-yellow-300 font-semibold"
                  : scrolled
                  ? "text-slate-600 hover:text-blue-700"
                  : "text-white/80 hover:text-yellow-300"
              }`}
            >
              {item.name}
              {isActive(item.path) && (
                <motion.div
                  layoutId="underline"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                    scrolled ? "bg-yellow-400" : "bg-white"
                  }`}
                />
              )}
            </Link>
          ))}

          {/* ===== Learn Dropdown ===== */}
          <div className="relative" ref={learnRef}>
            <button
              onClick={() => setLearnOpen((s) => !s)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                scrolled ? "text-slate-700 hover:text-blue-700" : "text-white hover:text-yellow-300"
              }`}
            >
              Learn
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  learnOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {learnOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-blue-100 rounded-lg shadow-lg py-2"
                >
                  {learnItems.map((li) => (
                    <Link
                      key={li.path}
                      to={li.path}
                      onClick={() => setLearnOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50"
                    >
                      {li.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ===== Auth / User Section ===== */}
        <div className="hidden lg:flex items-center space-x-3 transition-all duration-500">
          {!isAuthenticated ? (
            <>
              <Link to="/auth/login">
                <Button
                  variant="ghost"
                  className={`font-medium transition-all duration-300 ${
                    scrolled
                      ? "text-slate-700 hover:text-blue-700"
                      : "text-white hover:text-yellow-300"
                  }`}
                >
                  <User className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button
                  className={`transition-all duration-300 ${
                    scrolled
                      ? "bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                      : "bg-yellow-300 text-slate-900 hover:bg-yellow-400"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setOpenUserMenu((s) => !s)}
                className={`flex items-center gap-3 px-3 py-1 rounded-full border transition-all duration-500 ${
                  scrolled
                    ? "bg-blue-50 border-blue-100 text-blue-700"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    scrolled ? "bg-blue-600 text-white" : "bg-yellow-400 text-slate-900"
                  }`}
                >
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.first_name || "User"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 ${
                    scrolled ? "text-slate-500" : "text-yellow-200"
                  } transition-colors`}
                />
              </button>

              <AnimatePresence>
                {openUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-md shadow-lg py-2"
                  >
                    {userType === "investor" && (
                      <Link
                        to="/dashboard/investor"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50"
                      >
                        Investor Dashboard
                      </Link>
                    )}
                    {userType === "developer" && (
                      <Link
                        to="/dashboard/developer"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50"
                      >
                        Developer Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ===== Mobile Menu ===== */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className={`h-5 w-5 ${scrolled ? "text-blue-700" : "text-white"}`} />}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] sm:w-[340px] bg-white/95 backdrop-blur-md">
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <img src="/CB.png" alt="CrowdBricks" className="w-28 object-contain" />
                  <span className="text-lg font-bold text-blue-600">
                    Crowd<span className="text-yellow-400">Bricks</span>
                  </span>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 px-3 rounded text-sm font-medium ${
                      isActive(item.path)
                        ? "text-blue-700 bg-blue-50"
                        : "text-slate-700 hover:text-blue-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Learn */}
                <div className="mt-4 border-t pt-3">
                  <button
                    onClick={() => setMobileLearnOpen((s) => !s)}
                    className="w-full flex items-center justify-between text-sm font-medium text-slate-700"
                  >
                    Learn
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileLearnOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileLearnOpen && (
                    <div className="mt-2 space-y-1">
                      {learnItems.map((li) => (
                        <Link
                          key={li.path}
                          to={li.path}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 px-3 rounded text-sm text-slate-700 hover:bg-blue-50"
                        >
                          {li.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auth Buttons */}
                <div className="mt-6 border-t pt-4">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" /> Login
                        </Button>
                      </Link>
                      <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full mt-2 bg-yellow-400 text-slate-900">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {userType === "investor" && (
                        <Link
                          to="/dashboard/investor"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full mt-2">Investor Dashboard</Button>
                        </Link>
                      )}
                      {userType === "developer" && (
                        <Link
                          to="/dashboard/developer"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full mt-2">Developer Dashboard</Button>
                        </Link>
                      )}
                      <Button
                        variant="destructive"
                        className="w-full mt-2"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
