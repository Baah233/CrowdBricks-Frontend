import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || null);
  const [loading, setLoading] = useState(true);

  // 🔐 Attach token automatically to every request
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 🧠 Persist auth state
  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");

    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token");

    userType
      ? localStorage.setItem("userType", userType)
      : localStorage.removeItem("userType");
  }, [user, token, userType]);

  // 🔁 Restore session once token is available
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/user");
        setUser(res.data.user);
        setUserType(res.data.user?.user_type || null);
      } catch (err) {
        console.error("Failed to restore user session:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]); // ✅ run when token changes

  // 🚪 Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    setUserType(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        userType,
        setUserType,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
