import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setUser, setToken, setUserType } = useAuth();

  const redirectTo = new URLSearchParams(location.search).get("redirect");
  const [showPassword, setShowPassword] = useState(false);
  const [userTypeTab, setUserTypeTab] = useState("investor");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ghanaCard: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: formData.email,
        password: formData.password,
        ghana_card: formData.ghanaCard || null,
        user_type: userTypeTab,
      });

      // Backend returns: { success, message, data: { token, user } }
      const { user, token } = response.data.data;
      const message = response.data.message;

      // ✅ Store globally
      setUser(user);
      setToken(token);
      setUserType(user.user_type || userTypeTab);

      // ✅ Save to localStorage (for reload persistence)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", user.user_type || userTypeTab);

      // ✅ Set default header for future API requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast({
        title: "Login Successful 🎉",
        description: message || `Welcome back, ${user.first_name || user.name}!`,
      });

      // ✅ Redirect logic
      setTimeout(() => {
        const role = user.user_type || userTypeTab;

        if (redirectTo) {
          navigate(redirectTo);
        } else if (role === "developer") {
          navigate("/dashboard/developer");
        } else {
          navigate("/dashboard/investor");
        }
      }, 800);
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        "Invalid email or password.";

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* ✅ Logo & heading */}
          <div className="flex flex-col items-center mb-6">
            <Link to="/" className="flex flex-col items-center group cursor-pointer">
              <img
                src="/CB.png"
                alt="CrowdBricks logo"
                className="w-36 h-auto object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
              />
              <div className="mt-3 text-center">
                <h1 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                  Welcome Back
                </h1>
                <p className="text-sm text-slate-600">
                  Sign in to your{" "}
                  <span className="font-semibold text-blue-600">Crowd</span>
                  <span className="font-semibold text-yellow-400">Bricks</span>{" "}
                  account
                </p>
              </div>
            </Link>
          </div>

          <Card className="shadow-soft-lg border border-slate-100 bg-blue/80 backdrop-blur-md">
            <CardHeader className="bg-blue/50">
              <CardTitle className="text-center text-lg md:text-xl text-slate-800 font-semibold">
                Login to your account
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs
                value={userTypeTab}
                onValueChange={(v) => setUserTypeTab(v)}
                className="space-y-6"
              >
                {/* User Type Selector */}
                <TabsList className="grid w-full grid-cols-2 bg-primary-100 rounded-md p-1">
                  <TabsTrigger
                    value="investor"
                    className={`${
                      userTypeTab === "investor"
                        ? "bg-blue-600 shadow-sm text-white"
                        : "text-slate-700"
                    } rounded-md`}
                  >
                    Investor
                  </TabsTrigger>
                  <TabsTrigger
                    value="developer"
                    className={`${
                      userTypeTab === "developer"
                        ? "bg-blue-600 shadow-sm text-white"
                        : "text-slate-700"
                    } rounded-md`}
                  >
                    Developer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={userTypeTab} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-800 mb-1 block">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-blue-50 text-slate-900 border border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-800 mb-1 block">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="bg-blue-50 text-slate-900 border border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 px-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {userTypeTab === "developer" && (
                      <div>
                        <Label
                          htmlFor="ghanaCard"
                          className="text-sm font-semibold text-slate-800 mb-1 block"
                        >
                          Ghana Card Number (Required)
                        </Label>
                        <Input
                          id="ghanaCard"
                          placeholder="GHA-123456789-1"
                          value={formData.ghanaCard}
                          onChange={(e) => handleInputChange("ghanaCard", e.target.value)}
                          className="bg-blue-50 text-slate-900 border border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <Button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  size="lg"
                  disabled={loading}
                >
                  {loading
                    ? "Signing In..."
                    : `Sign In as ${userTypeTab === "investor" ? "Investor" : "Developer"}`}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline font-semibold"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="text-center text-sm mt-4">
                  <span className="text-slate-700">Don’t have an account? </span>
                  <Link
                    to="/auth/register"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-8 text-xs text-slate-600">
            <p>
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:underline font-semibold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline font-semibold">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <section className="text-center px-6 py-10 bg-gradient-to-br from-white via-blue-50 to-yellow-50">
        <p className="text-slate-700 text-sm md:text-base mb-4">
          Investing involves risk, including loss of capital and illiquidity.
          Please read the full Risk Warning before investing.
        </p>
        <p className="text-slate-600 text-xs md:text-sm mt-4 italic font-semibold">
          For login issues, contact{" "}
          <a
            href="mailto:support@crowdbricks.io"
            className="text-blue-600 font-medium hover:underline"
          >
            support@crowdbricks.io
          </a>
        </p>
      </section>
    </section>
  );
};

export default Login;
