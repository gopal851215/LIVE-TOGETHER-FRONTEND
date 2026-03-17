import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const parseUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("AuthContext: failed to parse user from localStorage", error);
    localStorage.removeItem("user");
    return null;
  }
};

const getToken = () => localStorage.getItem("token");

const hasTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(parseUser);
  const [initializing, setInitializing] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const data = response.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  useEffect(() => {
    const syncFromStorage = () => {
      const stored = parseUser();
      const storedToken = getToken();

      if (!stored || !storedToken || hasTokenExpired(storedToken)) {
        logout();
        setInitializing(false);
        return;
      }

      setUser(stored);
      setInitializing(false);
    };

    syncFromStorage();

    const handleStorage = (event) => {
      if (event.key === "user" || event.key === "token") {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      initializing,
      login,
      register,
      logout,
      setUser,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
