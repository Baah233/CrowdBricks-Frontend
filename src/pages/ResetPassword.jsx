import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      toast({
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [token, email, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.password_confirmation) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/reset-password", {
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      toast({
        title: "Success! ✅",
        description: response.data.message || "Your password has been reset successfully",
      });

      setResetSuccess(true);

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.password?.[0] ||
        "Failed to reset password. Please try again.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Password Reset Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              All Set!
            </h3>
            <p className="text-slate-600">
              Your password has been changed successfully. Redirecting to login...
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate("/auth/login")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <div className="mb-6">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex flex-col items-center group cursor-pointer">
            <img
              src="/CB.png"
              alt="CrowdBricks logo"
              className="w-32 h-auto object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
            />
            <div className="mt-3 text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Reset Your Password
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Choose a new secure password
              </p>
            </div>
          </Link>
        </div>

        <Card className="shadow-2xl border-2 border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Create New Password
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Display */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm">
                <span className="text-slate-600">Resetting password for: </span>
                <span className="font-bold text-slate-900">{email}</span>
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-slate-800 mb-2 block">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 8 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-2 border-slate-300 focus:border-blue-500 h-12 pr-12"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10"
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

              {/* Confirm Password */}
              <div>
                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-800 mb-2 block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="border-2 border-slate-300 focus:border-blue-500 h-12 pr-12"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-600" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-slate-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.password === formData.password_confirmation && formData.password ? 'bg-green-500' : 'bg-slate-300'}`} />
                    Passwords match
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-12 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-600">
          <p>
            Remember your password?{" "}
            <Link to="/auth/login" className="text-blue-600 hover:underline font-semibold">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
