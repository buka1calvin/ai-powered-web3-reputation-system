import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getStoredUserData } from "../api/signin";
import { logoutApi } from "../api/logout";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userData = getStoredUserData();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    checkAuth();
  };

  const logout = async() => {
    await logoutApi()
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};