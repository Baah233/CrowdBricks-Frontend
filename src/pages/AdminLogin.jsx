import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setToken, setUserType } = useAuth();

  const handleAdminLogin = async () => {
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please enter email and password", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", { 
        email, 
        password, 
        user_type: "admin" // Backend requires user_type
      });
      const { user, token } = res.data.data || res.data; // Handle nested data structure

      if (user.user_type !== "admin") {
        toast({ title: "Access denied", description: "This account is not an admin", variant: "destructive" });
        return;
      }

      setUser(user);
      setToken(token);
      setUserType("admin");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", "admin");

      toast({ title: "Welcome Admin 🎯", description: `Hello ${user.first_name}` });

      navigate("/dashboard/admin");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Invalid credentials or network issue";
      toast({ title: "Login failed", description: errorMsg, variant: "destructive" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-md boarder border-blue-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-slate-800">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input className="text-slate-900 bg-white" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input className="text-slate-900 bg-white" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button onClick={handleAdminLogin} disabled={loading} className="w-full bg-blue-600 text-white">
            {loading ? "Signing in..." : "Login as Admin"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
