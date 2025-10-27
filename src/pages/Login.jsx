import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api"; // ✅ centralized axios instance

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("investor");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ghanaCard: "",
    user_type: "",
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
        user_type: userType,
      });

      const { user, token, message } = response.data;

      toast({
        title: "Login Successful 🎉",
        description: message || `Welcome back, ${user.name}!`,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);

      setTimeout(() => {
        navigate(
          userType === "investor"
            ? "/dashboard/investor"
            : "/dashboard/developer"
        );
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
          {/* ✅ Top logo area */}
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
              <CardTitle className="text-center text-lg md:text-xl">
                <span className="text-slate-800 font-semibold">
                  Login to your account
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs
                value={userType}
                onValueChange={(value) => setUserType(value)}
                className="space-y-6"
              >
                {/* User Type Selector */}
                <TabsList className="grid w-full grid-cols-2 bg-primary-100 rounded-md p-1">
                  <TabsTrigger
                    value="investor"
                    className={`${
                      userType === "investor"
                        ? "bg-blue-600 shadow-sm text-white"
                        : "text-slate-700"
                    } rounded-md`}
                  >
                    Investor
                  </TabsTrigger>
                  <TabsTrigger
                    value="developer"
                    className={`${
                      userType === "developer"
                        ? "bg-blue-600 shadow-sm text-white"
                        : "text-slate-700"
                    } rounded-md`}
                  >
                    Developer
                  </TabsTrigger>
                </TabsList>

                {/* Investor Form */}
                <TabsContent value="investor" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="investor-email"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="investor-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1 pr-12 bg-blue-50 text-slate-900 placeholder-slate-500 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="investor-password"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Password
                      </Label>

                      <div className="relative">
                        <Input
                          id="investor-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="mt-1 pr-12 bg-blue-50 text-slate-900 placeholder-slate-500 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 px-2"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="investor-ghana-card"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Ghana Card Number (Optional)
                      </Label>
                      <Input
                        id="investor-ghana-card"
                        placeholder="GHA-123456789-1"
                        value={formData.ghanaCard}
                        onChange={(e) =>
                          handleInputChange("ghanaCard", e.target.value)
                        }
                        className="mt-1 pr-12 bg-blue-50 text-slate-900 placeholder-slate-500 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Developer Form */}
                <TabsContent value="developer" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="developer-email"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="developer-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1 pr-12 bg-blue-50 text-slate-900 placeholder-slate-500 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="developer-password"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="developer-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="mt-1 pr-12 bg-blue-50 text-slate-900 placeholder-slate-500 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 px-2"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="developer-ghana-card"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Ghana Card Number (Required)
                      </Label>
                      <Input
                        id="developer-ghana-card"
                        placeholder="GHA-123456789-1"
                        value={formData.ghanaCard}
                        onChange={(e) =>
                          handleInputChange("ghanaCard", e.target.value)
                        }
                        required
                        className="mt-1 pr-12 bg-blue-50 text-slate-900 placeholder-slate-500 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  size="lg"
                  disabled={loading}
                >
                  {loading
                    ? "Signing In..."
                    : `Sign In as ${
                        userType === "investor" ? "Investor" : "Developer"
                      }`}
                </Button>

                {/* Extra Links */}
                <div className="space-y-4">
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline font-semibold"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden
                    >
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-700"
                    >
                      📱 Mobile Money
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-700"
                    >
                      🏦 Bank Account
                    </Button>
                  </div>
                </div>

                <div className="text-center text-sm">
                  <span className="text-slate-700">
                    Don’t have an account?{" "}
                  </span>
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
              <Link
                to="/terms"
                className="text-blue-600 hover:underline font-semibold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-600 hover:underline font-semibold"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Extra legal / info section */}
      <section className="text-center px-6 py-10 bg-gradient-to-br from-white via-blue-50 to-yellow-50">
        <p className="text-slate-700 text-sm md:text-base mb-4">
          Investing through this platform is not covered by the Financial
          Services Compensation Scheme (FSCS). Investing involves risk,
          including loss of capital and illiquidity. It should only be done as
          part of a diversified portfolio. Please read the full Risk Warning
          before investing.
        </p>

        <p className="text-slate-700 text-sm md:text-base mb-4">
          <span className="text-blue-600">Crowd</span>
          <span className="text-yellow-600">Bricks</span> does not make
          investment recommendations. Always consult a qualified financial
          advisor if unsure about any opportunity.
        </p>

        <p className="text-slate-700 text-sm md:text-base">
          Investing and raising capital on{" "}
          <span className="text-blue-600">Crowd</span>
          <span className="text-yellow-600">Bricks</span> is subject to approval
          and due diligence requirements.
        </p>

        <p className="text-slate-600 text-xs md:text-sm mt-4 italic font-semibold">
          For any issues with login or registration, contact{" "}
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
