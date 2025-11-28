"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios.config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cookies are automatically sent with withCredentials: true
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        const userData = response?.data?.data || response?.data || null;
        setUser(userData);

        // Store user data in localStorage for UI purposes (not for auth)
        if (userData && typeof window !== "undefined") {
          localStorage.setItem("job-portal-user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Clear user data if authentication fails
        if (typeof window !== "undefined") {
          localStorage.removeItem("job-portal-user");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login function
  // Backend sets httpOnly cookie (jobPortalToken) automatically
  // Token is not returned in response body for security
  const login = async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);

      // Extract user from response (token is in httpOnly cookie)
      const data = response?.data?.data || response?.data || {};
      const userData = data?.user || data || null;

      // Store user data in localStorage for UI purposes (not for auth)
      if (userData && typeof window !== "undefined") {
        localStorage.setItem("job-portal-user", JSON.stringify(userData));
      }

      // Set user in context
      setUser(userData);

      return { user: userData };
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  // Note: Backend should have a logout endpoint that clears the cookie
  // For now, we'll clear local state and let backend handle cookie on next request
  const logout = async () => {
    try {
      // Optionally call backend logout endpoint if it exists
      // await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("job-portal-user");
      }
      setUser(null);
      router.push("/login");
    }
  };

  // Update user function (after profile update)
  const updateUser = (userData) => {
    setUser(userData);
    if (typeof window !== "undefined" && userData) {
      localStorage.setItem("job-portal-user", JSON.stringify(userData));
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      const userData = response?.data?.data || response?.data || null;
      setUser(userData);

      if (userData && typeof window !== "undefined") {
        localStorage.setItem("job-portal-user", JSON.stringify(userData));
      }

      return userData;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
