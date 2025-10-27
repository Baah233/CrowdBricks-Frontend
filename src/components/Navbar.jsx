import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User, Search as SearchIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

/*
  Navbar with "LEARN" dropdown
  - Desktop: LEARN opens a dropdown containing help/faqs, statistics, tax overview, customer feedback,
    free resources and blog.
  - Mobile (Sheet): LEARN is rendered as an expandable section with the same links.
  - Accessible: aria-haspopup / aria-expanded, closes on outside click or Escape.
*/

export const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [query, setQuery] = useState("");
  const userMenuRef = useRef(null);
  const learnRef = useRef(null);
  const [learnOpen, setLearnOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);

    toast({
      title: "Logout Successful 👋",
      description: "You’ve been logged out successfully.",
    });

    navigate("/");
  };

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "INVEST", path: "/projects" },
    { name: "RAISE", path: "/raise" },
    
    // LEARN will be rendered as a dropdown
    { name: "ABOUT", path: "/about" },
    { name: "NEWS", path: "/news" },

  ];

   const learnItems = [
    { name: "HELP / FAQs", path: "/help" },
    { name: "HOW IT WORKS", path: "/how-it-works" },
    { name: "STATISTICS", path: "/statistics" },
    { name: "TAX OVERVIEW", path: "/tax-overview" },
    { name: "CUSTOMER FEEDBACK", path: "/feedback" },
    { name: "TRAINING AND EVENT", path: "/training-and-event" },
    { name: "FREE RESOURCE", path: "/resources" },
    { name: "BLOG", path: "/news" },
  ];
 

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/projects?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  // close learn dropdown on outside click or Esc
  useEffect(() => {
    function onOutside(e) {
      if (learnRef.current && !learnRef.current.contains(e.target)) {
        setLearnOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setLearnOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer select-none"
          aria-label="CrowdBricks home"
        >
          <motion.img
            src="/CB.png"
            alt="CrowdBricks Logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-36 h-10 object-contain drop-shadow-sm"
          />

          <div className="hidden sm:flex flex-col leading-none">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
            >
              <span className="text-blue-600">Crowd</span>
              <span className="text-yellow-400">Bricks</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16 }}
              className="text-xs text-slate-500"
            >
              Building Ghana For Better Tomorrow..
            </motion.span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "text-primary-600 underline underline-offset-4 decoration-primary-200"
                  : "text-slate-600 hover:text-primary-600"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* LEARN dropdown */}
          <div className="relative" ref={learnRef}>
            <button
              onClick={() => setLearnOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={learnOpen}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 focus:outline-none"
            >
              LEARN
              <ChevronDown className="h-4 w-4" />
            </button>

            {learnOpen && (
              <div
                role="menu"
                aria-label="Learn menu"
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-md shadow-lg py-2 z-50"
              >
                {learnItems.map((li) => (
                  <Link
                    key={li.path}
                    to={li.path}
                    role="menuitem"
                    onClick={() => setLearnOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {li.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Search (desktop) */}
        <form
          onSubmit={onSearchSubmit}
          className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-lg px-3 py-1"
          role="search"
          aria-label="Search projects"
        >
          <SearchIcon className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="ml-2 w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
            aria-label="Search projects"
          />
        </form>

        {/* Desktop Auth / CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" className="text-slate-700">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-yellow-200 px-4">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                ref={userMenuRef}
                onClick={() => setOpenUserMenu((s) => !s)}
                className="inline-flex items-center gap-3 rounded-full px-3 py-1 bg-slate-50 border border-slate-100 hover:shadow-sm"
                aria-haspopup="true"
                aria-expanded={openUserMenu}
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-sm font-medium text-slate-800">
                    {user?.name || "Investor"}
                  </span>
                  <span className="text-xs text-slate-500">Account</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>

              {openUserMenu && (
                <div role="menu" className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-md shadow-lg py-2">
                  <Link to="/dashboard" onClick={() => setOpenUserMenu(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setOpenUserMenu(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Profile
                  </Link>
                  <button onClick={() => { handleLogout(); setOpenUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] sm:w-[340px]">
              <SheetHeader>
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <img src="/CB.png" alt="CrowdBricks" className="w-28 h-8 object-contain" />
                  <div className="text-sm font-semibold text-slate-700">CrowdBricks</div>
                </Link>
              </SheetHeader>

              <div className="mt-4 space-y-3">
                <form onSubmit={(e) => { e.preventDefault(); navigate(`/projects?search=${encodeURIComponent(query)}`); setIsOpen(false); }}>
                  <div className="flex items-center gap-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-100"
                      aria-label="Search projects"
                    />
                    <Button type="submit" variant="ghost" className="p-2">
                      <SearchIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                <div className="flex flex-col mt-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`py-2 px-2 rounded text-sm font-medium ${isActive(item.path) ? "text-primary-600" : "text-slate-700 hover:text-primary-600"}`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile LEARN expandable */}
                  <div className="mt-2 border-t pt-3">
                    <button
                      onClick={() => setMobileLearnOpen((s) => !s)}
                      className="w-full flex items-center justify-between py-2 px-2 text-sm font-medium text-slate-700"
                      aria-expanded={mobileLearnOpen}
                      aria-controls="mobile-learn"
                    >
                      LEARN
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileLearnOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div id="mobile-learn" className={`${mobileLearnOpen ? "block" : "hidden"} mt-2 space-y-1`}>
                      {learnItems.map((li) => (
                        <Link key={li.path} to={li.path} onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded text-sm text-slate-700 hover:bg-slate-50">
                          {li.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" /> Login
                        </Button>
                      </Link>
                      <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full mt-2 bg-yellow-400 text-slate-900">Get Started</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">Dashboard</Button>
                      </Link>
                      <Button variant="destructive" className="w-full mt-2" onClick={() => { handleLogout(); setIsOpen(false); }}>
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