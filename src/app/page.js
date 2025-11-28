"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to Job Portal
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Connect with top employers or find the perfect candidate for your
            team. Your next opportunity starts here.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === "jobseeker" ? (
                <>
                  <button
                    onClick={() => router.push("/jobs")}
                    className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition shadow-lg"
                  >
                    Browse Jobs
                  </button>
                  <button
                    onClick={() => router.push("/applied-jobs")}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
                  >
                    View Applications
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/jobs/create")}
                    className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition shadow-lg"
                  >
                    Post a Job
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
                  >
                    Manage Profile
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {user && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">
                {user.role === "jobseeker" ? "Find Jobs" : "Post Jobs"}
              </h3>
              <p className="text-slate-300">
                {user.role === "jobseeker"
                  ? "Discover opportunities that match your skills and interests."
                  : "Reach qualified candidates and grow your team."}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">
                Build Profile
              </h3>
              <p className="text-slate-300">
                {user.role === "jobseeker"
                  ? "Showcase your skills and experience to employers."
                  : "Create a compelling company profile to attract talent."}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Connected
              </h3>
              <p className="text-slate-300">
                {user.role === "jobseeker"
                  ? "Track your applications and get updates in real-time."
                  : "Manage applications and communicate with candidates."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
