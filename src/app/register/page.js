"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios.config";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const roles = useMemo(
    () => [
      { label: "Job Seeker", value: "jobseeker" },
      { label: "Employer", value: "employer" },
    ],
    []
  );

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await apiClient.post("/auth/register", formData);

      setFeedback({
        type: "success",
        message: "Registration successful! Redirecting to login...",
      });

      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to register. Please try again.";

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
            <p className="text-sm font-medium text-blue-500">
              Join the talent collective
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Create an account
            </h2>
            <p className="text-sm text-slate-500">
              It only takes a minute to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-600"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Rahim Uddin"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

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
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Role radio buttons */}
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-slate-600"
              >
                Role
              </label>
              <div className="flex gap-3">
                {roles.map((roleOption) => (
                  <label
                    key={roleOption.value}
                    className={`flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      formData.role === roleOption.value
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={roleOption.value}
                      checked={formData.role === roleOption.value}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    {roleOption.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Feedback */}
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
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Redirect to login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-semibold text-blue-600 underline-offset-4 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
