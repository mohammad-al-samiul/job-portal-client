"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const AdminApplicationsPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    const fetchAllApplications = async () => {
      try {
        const response = await apiClient.get("/admin/applications");
        const applicationsData =
          response?.data?.data ||
          response?.data?.applications ||
          response?.data ||
          [];

        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setError(
          error?.response?.data?.message ||
            "Failed to load applications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplications();
  }, [user, authLoading, router]);

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
          <h1 className="text-3xl font-bold text-slate-900">All Applications</h1>
          <p className="text-slate-600 mt-2">
            View all job applications in the system ({applications.length})
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No applications found
            </h3>
            <p className="text-slate-600">
              There are no job applications in the system yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => {
              const applicant = application.user || application.applicant || {};
              const job = application.job || {};
              const status = application.status || "pending";
              const appliedDate = application.appliedAt || application.createdAt;

              return (
                <div
                  key={application._id || application.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                          {applicant?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {applicant?.name || "Applicant"}
                          </h3>
                          <p className="text-slate-600">{applicant?.email}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          Applied for:
                        </p>
                        <p className="text-slate-900 font-semibold">
                          {job?.title || "Job Title"}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {job?.company || "Company Name"}
                        </p>
                      </div>

                      {applicant?.skills && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-2">
                            Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {typeof applicant.skills === "string" ? (
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                {applicant.skills}
                              </span>
                            ) : (
                              applicant.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {appliedDate && (
                        <p className="text-xs text-slate-500">
                          Applied: {new Date(appliedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;

