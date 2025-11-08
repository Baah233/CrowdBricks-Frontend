import React, { useState, useEffect, useRef } from "react";
import { Bell, Settings, User, Search, Sun, Moon, X } from "lucide-react";
import api from "@/lib/api";

export default function AdminNavbar({ dark, onToggleDark, query, setQuery }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Component mount logging
  useEffect(() => {
    console.log("🔔 AdminNavbar Loaded - Version: Nov 7, 2025 - With Notifications");
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/notifications");
      console.log("Notifications response:", res.data);
      if (res.data.ok && res.data.data) {
        setNotifications(res.data.data);
        const unread = res.data.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (e) {
      console.error("Error loading notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Error marking notification as read:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? Math.max(0, prev - 1) : prev;
      });
    } catch (e) {
      console.error("Error deleting notification:", e);
    }
  };

  const toggleNotifications = () => {
    if (!showNotifications) {
      loadNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b dark:border-slate-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/CB.png" alt="CrowdBricks" className="h-8" />
          <div className="hidden md:block">
            <div className="font-bold">Crowd<span className="text-yellow-400">Bricks</span></div>
            <div className="text-xs text-slate-500">Admin Console</div>
          </div>
        </div>

        <div className="flex-1 mx-6 max-w-2xl hidden md:block">
          <label htmlFor="admin-search" className="sr-only">Search</label>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
            <Search className="h-4 w-4 text-slate-500" />
            <input id="admin-search" value={query} onChange={(e) => setQuery?.(e.target.value)} className="ml-2 w-full bg-transparent outline-none text-sm" placeholder="Search users, projects, investments..." />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleNotifications}
              aria-label="Notifications" 
              className="relative p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 max-h-96 overflow-hidden flex flex-col z-50">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30">
                  <div>
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-xs text-slate-500">Updated Nov 7, 2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="p-8 text-center text-slate-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <Bell className="h-12 w-12 mx-auto opacity-30 mb-2" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {notification.body}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{notification.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-xs"
                                title="Mark as read"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-xs text-red-500"
                              title="Delete"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={onToggleDark} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"><Settings className="h-5 w-5" /></button>
          <a href="/profile" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-slate-700">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </a>
        </div>
      </div>
    </header>
  );
}
