import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { BRAND } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

/*
  Modernized Register page (src/pages/Register.jsx)
  - Applies CrowdBricks brand (BRAND.primary, BRAND.accent)
  - Cleaner UX, stronger form validation, password strength indicator
  - Developer registration supports attaching Ghana Card file (required)
  - Developer accounts are NOT auto-signed-in — they are created as "pending" and require admin approval
  - Investors are signed-in automatically when token returned
  - Improved accessibility and small animations
*/

const initialForm = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  ghanaCardNumber: "",
  ghanaCardFile: null, // file for developers (id)
};

function passwordStrength(pw = "") {
  // simple strength heuristic: length + variety
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // normalize 0..5 -> 0..100
  return Math.min(100, Math.round((score / 5) * 100));
}

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [userType, setUserType] = useState("investor"); // investor | developer
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const brandStyle = useMemo(() => ({
    "--cb-primary": BRAND.primary,
    "--cb-accent": BRAND.accent,
  }), []);

  const pwStrength = useMemo(() => passwordStrength(form.password), [form.password]);
  const pwLabel = useMemo(() => {
    if (!form.password) return "Empty";
    if (pwStrength < 40) return "Weak";
    if (pwStrength < 70) return "Fair";
    if (pwStrength < 90) return "Strong";
    return "Excellent";
  }, [pwStrength, form.password]);

  const handleChange = (field) => (e) => {
    const value = e?.target?.files ? e.target.files[0] : e.target.value;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast({ title: "Missing name", description: "Please enter your full name", variant: "destructive" });
      return false;
    }
    if (!form.email.trim()) {
      toast({ title: "Missing email", description: "Please enter your email address", variant: "destructive" });
      return false;
    }
    if (form.password.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters", variant: "destructive" });
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match", variant: "destructive" });
      return false;
    }
    if (!agree) {
      toast({ title: "Accept terms", description: "You must agree to Terms & Privacy", variant: "destructive" });
      return false;
    }
    if (userType === "developer") {
      if (!form.ghanaCardNumber.trim()) {
        toast({ title: "Ghana Card required", description: "Enter Ghana Card number", variant: "destructive" });
        return false;
      }
      if (!form.ghanaCardFile) {
        toast({ title: "Upload ID", description: "Please upload a copy of your Ghana Card (jpg/pdf)", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // Build FormData for file upload support
      const fd = new FormData();
      fd.append("first_name", form.firstName.trim());
      fd.append("last_name", form.lastName.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("password", form.password);
      fd.append("password_confirmation", form.confirmPassword);
      fd.append("user_type", userType); // "investor" or "developer"
      if (form.company) fd.append("company", form.company);
      if (userType === "developer") {
        fd.append("ghana_card", form.ghanaCardNumber.trim());
        fd.append("ghana_card_file", form.ghanaCardFile);
      }

      // POST to /register (backend should handle developer pending status if needed)
      const res = await api.post("/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend response handling:
      // - If investor: return token -> sign in, navigate to investor dashboard
      // - If developer: likely account pending approval — do NOT auto-login; show pending message

      const data = res?.data ?? {};
      if (userType === "investor" && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { email: form.email, name: form.firstName }));
        toast({
          title: "Welcome to CrowdBricks",
          description: "Your investor account is ready. Redirecting to your dashboard.",
        });
        navigate("/dashboard/investor");
      } else {
        // Developer or no token returned
        toast({
          title: "Application received",
          description: "Your account has been created and is pending verification. We'll notify you when it's approved.",
        });
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.message);
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white" >
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: marketing / culture */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block rounded-xl p-8 text-white"
            style={{
              background: `linear-gradient(180deg, ${BRAND.primary}22 0%, ${BRAND.accent}11 100%)`,
            }}
          >
            <h2 className="text-3xl font-extrabold mb-3 text-blue-600" >
              Crowd<span className="text-yellow-400">Bricks</span>
            </h2>
            <p className="mb-4 text-lg text-slate-800">
              Community • Transparency • Impact — Invest in vetted property projects across Ghana.
            </p>

            <div className="space-y-4 text-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: BRAND.primary }} />
                <div>
                  <div className="font-semibold">Vetted Developers</div>
                  <div className="text-sm">We perform due diligence before listing projects.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: BRAND.accent }} />
                <div>
                  <div className="font-semibold">Low Minimums</div>
                  <div className="text-sm">Start investing from small amounts and grow your portfolio.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: BRAND.primary }} />
                <div>
                  <div className="font-semibold">Transparent Reporting</div>
                  <div className="text-sm">Real-time updates and clear returns projections.</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/about">
                <Button className="text-white bg-blue-600 hover:bg-blue-700">
                  Learn more about CrowdBricks
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: form */}
          <Card className="shadow-xl bg-gradient-to-br from-white via-blue-70 to-yellow-100">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-slate-900 ">Create your account</CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs value={userType} onValueChange={setUserType} className="space-y-4">
                <TabsList className="grid grid-cols-2 gap-2 mb-4 bg-blue-600 rounded">
                  <TabsTrigger value="investor" className="hover:bg-yellow-400 ">Investor</TabsTrigger>
                  <TabsTrigger value="developer" className="hover:bg-yellow-400 ">Developer</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold font-bold text-slate-900">First name *</Label>
                    <Input  className="bg-white text-slate-900"
                    value={form.firstName} onChange={(e) => handleChange("firstName")(e)} placeholder="First name" />
                  </div>
                  <div>
                    <Label className="font-semibold font-bold text-slate-900">Last name *</Label>
                    <Input  className="bg-white text-slate-900"
                    value={form.lastName} 
                    onChange={(e) => handleChange("lastName")(e)} 
                    placeholder="Last name " />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className=" font-bold text-slate-900">Email address *</Label>
                    <Input className="bg-white text-slate-900" variant="outline" type="email" value={form.email} onChange={(e) => handleChange("email")(e)} placeholder="you@domain.com" />
                  </div>
                  <div>
                    <Label  variant="outline"  className="font-bold text-slate-900">Phone</Label>
                    <Input className="bg-white text-slate-900" variant="outline" value={form.phone} onChange={(e) => handleChange("phone")(e)} placeholder="+233 20 123 4567" />
                  </div>
                </div>

                <div className="mt-2">
                  <Label className="font-semibold font-bold text-slate-900">Company (optional)</Label>
                  <Input className="bg-white text-slate-900" variant="outline" value={form.company} onChange={(e) => handleChange("company")(e)} placeholder="Company name" />
                </div>

                {userType === "developer" && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold font-bold text-slate-900">Ghana Card number *</Label>
                      <Input className="bg-white text-slate-900" value={form.ghanaCardNumber} onChange={(e) => handleChange("ghanaCardNumber")(e)} placeholder="GHA-123456789-1" />
                    </div>

                    <div>
                      <Label className="font-semibold font-bold text-slate-900">Upload Ghana Card (JPG / PDF) *</Label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded bg-white text-sm text-slate-700 hover:bg-slate-50">
                          <UploadCloud className="h-4 w-4" />
                          <span>{form.ghanaCardFile ? form.ghanaCardFile.name : "Choose file"}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleChange("ghanaCardFile")(e)}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className=" font-bold text-slate-900">Password *</Label>
                    <div className="relative">
                      <Input
                       className="bg-white text-slate-900"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => handleChange("password")(e)}
                        placeholder="Create a secure password"
                        aria-describedby="pw-strength"
                      />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-slate-900" onClick={() => setShowPassword((s) => !s)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="mt-2">
                      <div id="pw-strength" className="flex items-center justify-between text-xs">
                        <div className="text-slate-500">Strength: <strong>{pwLabel}</strong></div>
                        <div className="w-40 text-right text-slate-500">{pwStrength}%</div>
                      </div>
                      <div className="w-full bg-slate-100 rounded h-2 mt-1 overflow-hidden">
                        <div
                          className="h-2"
                          style={{
                            width: `${pwStrength}%`,
                            background: pwStrength < 40 ? "#F97316" : pwStrength < 70 ? "#FBBF24" : "#10B981",
                            transition: "width 240ms ease",
                          }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Use 8+ chars, mix upper/lowercase, numbers & symbols.</div>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold font-bold text-slate-900">Confirm password *</Label>
                    <div className="relative">
                      <Input
                      className="bg-white text-slate-900"
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword")(e)}
                        placeholder="Confirm password"
                      />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-slate-900" onClick={() => setShowConfirm((s) => !s)}>
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-4">
                  <Checkbox className="text-slate-900" id="agree" checked={agree} onCheckedChange={(val) => setAgree(val === true)} />
                  <Label htmlFor="agree" className="text-sm text-slate-900">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-500 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-500 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleRegister}
                    className="w-full"
                    size="lg"
                    style={{
                      background: userType === "developer" ? BRAND.accent : BRAND.primary,
                      color: "#0f172a",
                      borderColor: `${userType === "developer" ? BRAND.accent : BRAND.primary}`,
                    }}
                    disabled={loading}
                  >
                    {loading ? "Working..." : userType === "developer" ? "Apply as Developer" : "Create Investor Account"}
                  </Button>
                </div>

                <div className="text-center text-sm mt-3">
                  <span className="text-slate-900">Already a member? </span>
                  <Link to="/auth/login" className="text-blue-500 font-bold hover:underline">Sign in</Link>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}