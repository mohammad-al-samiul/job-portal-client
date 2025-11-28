"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const PendingEmployersPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    if (!user) return;

    const fetchPendingEmployers = async () => {
      try {
        const response = await apiClient.get("/admin/pending-employers");
        const employersData =
          response?.data?.data ||
          response?.data?.employers ||
          response?.data ||
          [];

        setEmployers(Array.isArray(employersData) ? employersData : []);
      } catch (error) {
        console.error("Failed to fetch pending employers:", error);
        setError(
          error?.response?.data?.message ||
            "Failed to load pending employers. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEmployers();
  }, [user, authLoading, router]);

  const handleApprove = async (employerId) => {
    setApproving(employerId);
    setFeedback({ type: "", message: "" });

    try {
      await apiClient.patch(`/admin/employers/${employerId}/approve`);

      setFeedback({
        type: "success",
        message: "Employer approved successfully!",
      });

      // Remove approved employer from list
      setEmployers((prev) =>
        prev.filter((emp) => (emp._id || emp.id) !== employerId)
      );

      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to approve employer. Please try again.";

      setFeedback({ type: "error", message });
    } finally {
      setApproving(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            Pending Employers
          </h1>
          <p className="text-slate-600 mt-2">
            Review and approve employer registrations ({employers.length})
          </p>
        </div>

        {feedback.message && (
          <div
            className={`rounded-xl px-4 py-3 mb-6 ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {employers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-slate-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No pending employers
            </h3>
            <p className="text-slate-600">
              All employers have been approved or there are no pending
              registrations.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {employers.map((employer) => (
              <div
                key={employer._id || employer.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                        {employer?.name?.charAt(0)?.toUpperCase() || "E"}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {employer.name || "Employer"}
                        </h3>
                        <p className="text-slate-600">{employer.email}</p>
                        {employer.company && (
                          <p className="text-slate-500 text-sm mt-1">
                            Company: {employer.company}
                          </p>
                        )}
                      </div>
                    </div>

                    {employer.bio && (
                      <p className="text-slate-700 mb-4">{employer.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                      <span>
                        Registered:{" "}
                        {employer.createdAt
                          ? new Date(employer.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleApprove(employer._id || employer.id)}
                      disabled={approving === (employer._id || employer.id)}
                      className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-sm disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {approving === (employer._id || employer.id)
                        ? "Approving..."
                        : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingEmployersPage;

