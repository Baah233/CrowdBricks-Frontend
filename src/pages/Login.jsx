import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api"; // ✅ imported centralized axios instance

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

  // ✅ Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle login
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

    // ✅ Laravel returns user + token + message
    const { user, token, message } = response.data;

    toast({
      title: "Login Successful 🎉",
      description: message || `Welcome back, ${user.name}!`,
    });

    // ✅ Save token to localStorage for authenticated routes
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);

    // Redirect to dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Crowdbricks
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your Crowdbricks account
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value)}
              className="space-y-6"
            >
              {/* User Type Selector */}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="investor">Investor</TabsTrigger>
                <TabsTrigger value="developer">Developer</TabsTrigger>
              </TabsList>

              {/* Investor Form */}
              <TabsContent value="investor" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="investor-email">Email Address</Label>
                    <Input
                      id="investor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="investor-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="investor-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="investor-ghana-card">
                      Ghana Card Number (Optional)
                    </Label>
                    <Input
                      id="investor-ghana-card"
                      placeholder="GHA-123456789-1"
                      value={formData.ghanaCard}
                      onChange={(e) =>
                        handleInputChange("ghanaCard", e.target.value)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Developer Form */}
              <TabsContent value="developer" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="developer-email">Email Address</Label>
                    <Input
                      id="developer-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="developer-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="developer-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="developer-ghana-card">
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
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                className="w-full"
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
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">📱 Mobile Money</Button>
                  <Button variant="outline">🏦 Bank Account</Button>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don’t have an account?{" "}
                </span>
                <Link
                  to="/auth/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
