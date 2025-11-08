import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, Mail, Phone, Shield, Calendar, Edit, Save, X, Camera,
  Check, AlertCircle, Upload, Loader2, Lock, RefreshCw
} from "lucide-react";
import api from "@/lib/api";

export default function ProfileEnhanced() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile picture upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Phone verification states
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  
  // Mandatory 2FA modal
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [enabling2FA, setEnabling2FA] = useState(false);
  
  // Edit form state
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/profile");
      const userData = response.data;
      setUser(userData);
      setEditData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
      
      // Check if 2FA is required (mandatory after admin approval)
      if (userData.two_factor_required && !userData.two_factor_enabled) {
        setShow2FAModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await api.post("/user/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUser({ ...user, profile_picture: response.data.profile_picture });
      alert("Profile picture uploaded successfully!");
      fetchProfile(); // Refresh to update completion
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSendPhoneVerification = async () => {
    if (!user.phone) {
      alert("Please add a phone number first");
      return;
    }

    setSendingCode(true);
    try {
      const response = await api.post("/user/phone/send-verification");
      alert(`Verification code sent to ${user.phone}. Code: ${response.data.code}`);
      setShowPhoneVerification(true);
    } catch (error) {
      console.error("Failed to send verification code:", error);
      alert("Failed to send verification code");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneCode || phoneCode.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setVerifyingPhone(true);
    try {
      await api.post("/user/phone/verify", { code: phoneCode });
      alert("Phone verified successfully!");
      setShowPhoneVerification(false);
      setPhoneCode("");
      fetchProfile();
    } catch (error) {
      console.error("Phone verification failed:", error);
      alert("Invalid verification code");
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleRequestPhoneChange = async (newPhone) => {
    try {
      await api.post("/user/phone/change-request", { phone: newPhone });
      alert("Phone change request submitted for admin approval");
      fetchProfile();
    } catch (error) {
      console.error("Phone change request failed:", error);
      alert("Failed to request phone change");
    }
  };

  const handleEnable2FA = async () => {
    setEnabling2FA(true);
    try {
      const response = await api.post("/user/2fa/enable");
      setTwoFactorSecret(response.data.secret);
      alert(`Your 2FA code is: ${response.data.secret}. Please save it securely.`);
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
      alert("Failed to enable 2FA");
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setEnabling2FA(true);
    try {
      await api.post("/user/2fa/verify", { code: twoFactorCode });
      alert("2FA enabled successfully!");
      setShow2FAModal(false);
      setTwoFactorCode("");
      fetchProfile();
    } catch (error) {
      console.error("2FA verification failed:", error);
      alert("Invalid 2FA code");
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleSave = async () => {
    if (!editData.first_name || !editData.last_name || !editData.email) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if phone changed
    if (editData.phone !== user.phone && editData.phone) {
      await handleRequestPhoneChange(editData.phone);
    }

    setSaving(true);
    try {
      const response = await api.put("/user/profile", {
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
      });

      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Failed to load profile</p>
            <Button onClick={() => navigate("/dashboard/investor")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Profile Completion */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          {/* Profile Completion Progress */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Profile Completion</span>
                <span className="text-2xl font-bold">{user.profile_completion || 0}%</span>
              </div>
              <Progress value={user.profile_completion || 0} className="h-2 bg-white/20" />
              <p className="text-xs text-white/80 mt-2">
                Complete your profile to unlock all features
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Picture Card */}
        <Card className="mb-6 shadow-lg relative">
          <div className="absolute top-4 right-4">
            {!editing && (
              <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={handleProfilePictureClick}
                >
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="text-center text-white">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-xs mt-1">{uploadProgress}%</p>
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">
                    <span className="text-blue-600">{user.first_name}</span>
                    {" "}
                    <span className="text-yellow-500">{user.last_name}</span>
                  </h2>
                  {user.status === 'approved' && user.verification_id && (
                    <Badge className="bg-green-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified • {user.verification_id}
                    </Badge>
                  )}
                </div>
                <Badge className="mb-4">{user.user_type || "Investor"}</Badge>

                {editing ? (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <Input
                          value={editData.first_name}
                          onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name *</label>
                        <Input
                          value={editData.last_name}
                          onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="+233 XX XXX XXXX"
                      />
                      {editData.phone !== user.phone && editData.phone && (
                        <p className="text-xs text-orange-600 mt-1">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          Phone changes require admin approval
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditing(false)} variant="outline" className="flex-1">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium">{user.phone || "Not set"}</p>
                        {user.phone_verified && <Check className="h-3 w-3 text-green-500 inline ml-1" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Verification Section */}
            {user.phone && !user.phone_verified && !editing && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900">Phone Not Verified</p>
                      <p className="text-sm text-orange-700">Verify your phone to enable SMS notifications and secure transactions</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendPhoneVerification}
                    disabled={sendingCode}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {sendingCode ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Verify Now
                  </Button>
                </div>
              </div>
            )}

            {/* Phone Change Request Status */}
            {user.phone_change_request && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Phone Change Pending</p>
                    <p className="text-sm text-blue-700">
                      Request to change phone to {user.phone_change_request} is awaiting admin approval
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/investor?tab=settings")}>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium">Security Settings</p>
              <p className="text-xs text-gray-600">Manage 2FA & Password</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/investor?tab=settings")}>
            <CardContent className="p-4 text-center">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-gray-600">Email & SMS Preferences</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/investor")}>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium">Dashboard</p>
              <p className="text-xs text-gray-600">View Your Investments</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Phone Verification Modal */}
      {showPhoneVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Verify Phone Number</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to {user.phone}
              </p>
              <Input
                type="text"
                maxLength={6}
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl font-mono mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleVerifyPhone} disabled={verifyingPhone} className="flex-1 bg-green-600">
                  {verifyingPhone ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verify
                </Button>
                <Button onClick={() => setShowPhoneVerification(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mandatory 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Two-Factor Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900 font-medium">
                  Your account requires two-factor authentication to be enabled.
                </p>
                <p className="text-xs text-red-700 mt-1">
                  This is a security requirement set by the administrator.
                </p>
              </div>

              {!twoFactorSecret ? (
                <Button onClick={handleEnable2FA} disabled={enabling2FA} className="w-full bg-blue-600">
                  {enabling2FA ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Enable 2FA Now
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Your 2FA Secret Code:</p>
                    <p className="text-2xl font-mono font-bold text-center text-blue-600">{twoFactorSecret}</p>
                    <p className="text-xs text-gray-600 mt-2">Save this code securely!</p>
                  </div>
                  <Input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter code to verify"
                    className="text-center text-lg font-mono"
                  />
                  <Button onClick={handleVerify2FA} disabled={enabling2FA} className="w-full bg-green-600">
                    {enabling2FA ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Verify & Complete Setup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
