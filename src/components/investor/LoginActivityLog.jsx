import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet, MapPin, Clock, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function LoginActivityLog({ dark }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/login-activities");
      if (res?.data) {
        setActivities(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Failed to load login activities", err);
      toast({
        title: "Error",
        description: "Failed to load login activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logoutDevice = async (id) => {
    try {
      await api.post(`/user/logout-device/${id}`);
      toast({
        title: "Success",
        description: "Device logged out successfully",
      });
      loadActivities();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to logout device",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (activity) => {
    if (activity.is_current) {
      return (
        <Badge className="bg-green-500/20 text-green-600 border-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active Now
        </Badge>
      );
    }
    
    if (activity.status === "failed") {
      return (
        <Badge variant="destructive">
          Failed
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-slate-500">
        Logged Out
      </Badge>
    );
  };

  return (
    <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
          <Monitor className="h-5 w-5 text-blue-500" />
          Login Activity & Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-24 rounded-lg animate-pulse ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No login activities found
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map(activity => (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border ${
                  activity.is_suspicious
                    ? dark
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-orange-500 bg-orange-50"
                    : activity.is_current
                    ? dark
                      ? "border-green-500 bg-green-500/10"
                      : "border-green-500 bg-green-50"
                    : dark
                    ? "border-slate-700 bg-slate-900/50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 ${activity.is_current ? "text-green-500" : dark ? "text-slate-400" : "text-slate-600"}`}>
                      {getDeviceIcon(activity.device_type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium">{activity.device}</div>
                        {getStatusBadge(activity)}
                        {activity.is_suspicious && (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-600 border-orange-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            New Device
                          </Badge>
                        )}
                      </div>
                      
                      <div className={`text-sm space-y-1 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location} • {activity.ip_address}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(activity.login_at).toLocaleString()}
                          </span>
                        </div>
                        
                        {activity.logout_at && (
                          <div className="text-xs text-slate-500">
                            Logged out: {new Date(activity.logout_at).toLocaleString()}
                            {activity.session_duration && ` (${activity.session_duration} min)`}
                          </div>
                        )}
                        
                        <div className="text-xs">
                          {activity.browser} • {activity.platform}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {activity.is_current && !activity.logout_at && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoutDevice(activity.id)}
                      className="ml-2"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className={`mt-4 p-3 rounded-lg ${dark ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs">
              <div className="font-medium text-blue-600">Security Tip</div>
              <div className={dark ? "text-slate-300" : "text-slate-600"}>
                If you see any suspicious activity or unrecognized devices, logout those sessions immediately and change your password.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
