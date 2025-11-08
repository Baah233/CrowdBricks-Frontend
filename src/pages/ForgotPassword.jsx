import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/forgot-password", { email });

      toast({
        title: "Email Sent! ✉️",
        description: response.data.message || "Password reset instructions have been sent to your email",
      });

      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        "Failed to send reset email. Please try again.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                Forgot Password?
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                No worries, we'll send you reset instructions
              </p>
            </div>
          </Link>
        </div>

        <Card className="shadow-2xl border-2 border-slate-200 overflow-hidden">
          {!emailSent ? (
            <>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Reset Your Password
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-800 mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-slate-300 focus:border-blue-500 h-12 text-base"
                      disabled={loading}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Enter the email address associated with your account
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-12 shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Email Sent Successfully
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Check Your Email
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-sm text-slate-700">
                  <p className="font-semibold mb-2">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>Check your email inbox</li>
                    <li>Click the reset link in the email</li>
                    <li>Create a new password</li>
                    <li>Log in with your new password</li>
                  </ol>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => navigate("/auth/login")}
                    variant="outline"
                    className="w-full border-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </div>

                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Didn't receive the email? Try again
                </button>
              </CardContent>
            </>
          )}
        </Card>

        <div className="text-center mt-6 text-sm text-slate-600">
          <p>
            Need help?{" "}
            <Link
              to="/contacts"
              className="text-blue-600 hover:underline font-semibold"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
