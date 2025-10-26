import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";


export const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

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
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Insight", path: "/blog" },

  ];

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-md border-b border-border shadow-sm ">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
      <Link
  to="/"
  className="flex items-center gap-3 group cursor-pointer select-none"
>
  <motion.img
    src="/CB.png"
    alt="CrowdBricks Logo"
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    whileHover={{ scale: 1.05, rotate: 2 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="w-200 h-10 object-contain drop-shadow-md group-hover:drop-shadow-lg"
  />

  <motion.h1
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors"
  >
   
  </motion.h1>
</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <Link
                  to="/"
                  className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                >
                  Crowdbricks
                </Link>
              </SheetHeader>
              <div className="flex flex-col mt-6 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-2">
                  {isAuthenticated ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link to="/auth/login" className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/auth/register" className="w-full">
                        <Button
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          Get Started
                        </Button>
                      </Link>
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
