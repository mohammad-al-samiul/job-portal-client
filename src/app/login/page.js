"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios.config";

const LoginPage = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      // Backend will set httpOnly cookie here
      const response = await apiClient.post("/auth/login", credentials);

      // Try to read user from different possible response shapes
      const user =
        response?.data?.data?.user ||
        response?.data?.user ||
        response?.data?.data ||
        null;

      // Optional: store user info in localStorage for UI (not for auth)
      if (typeof window !== "undefined" && user) {
        localStorage.setItem("job-portal-user", JSON.stringify(user));
      }

      setFeedback({
        type: "success",
        message: "Login successful! Redirecting...",
      });

      // Redirect to home page
      setTimeout(() => router.push("/"), 1200);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password.";

      setFeedback({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="relative max-w-md w-full">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center space-y-2">
            <p className="text-sm font-medium text-blue-500">Welcome back</p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Sign in to continue
            </h2>
            <p className="text-sm text-slate-500">
              Access your personalized job dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-600"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="rahim@gmail.com"
                value={credentials.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-600"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••"
                value={credentials.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Feedback message */}
            {feedback.message && (
              <p
                className={`rounded-2xl px-4 py-3 text-sm ${
                  feedback.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {feedback.message}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Redirect to register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            New to the platform?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-semibold text-blue-600 underline-offset-4 hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
