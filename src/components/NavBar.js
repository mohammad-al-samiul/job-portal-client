"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <h1 className="text-2xl font-bold text-slate-900">JobPortal</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === "jobseeker" && (
                  <>
                    <button
                      onClick={() => router.push("/jobs")}
                      className="text-slate-700 hover:text-slate-900 font-medium transition"
                    >
                      Browse Jobs
                    </button>
                    <button
                      onClick={() => router.push("/applied-jobs")}
                      className="text-slate-700 hover:text-slate-900 font-medium transition"
                    >
                      Applied Jobs
                    </button>
                    <button
                      onClick={() => router.push("/profile")}
                      className="text-slate-700 hover:text-slate-900 font-medium transition"
                    >
                      Profile
                    </button>
                  </>
                )}
                {user.role === "employer" && (
                  <>
                    <button
                      onClick={() => router.push("/jobs/my-jobs")}
                      className="text-slate-700 hover:text-slate-900 font-medium transition"
                    >
                      My Jobs
                    </button>
                    <button
                      onClick={() => router.push("/jobs/create")}
                      className="text-slate-700 hover:text-slate-900 font-medium transition"
                    >
                      Post Job
                    </button>
                    <button
                      onClick={() => router.push("/profile")}
                      className="text-slate-700 hover:text-slate-900 font-medium transition"
                    >
                      Profile
                    </button>
                  </>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.name || "User"}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

