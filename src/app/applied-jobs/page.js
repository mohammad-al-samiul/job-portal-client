"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const AppliedJobsPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!user) return;

    const fetchAppliedJobs = async () => {
      try {
        const response = await apiClient.get("/users/applied-jobs");
        const jobs =
          response?.data?.data ||
          response?.data?.appliedJobs ||
          response?.data ||
          [];

        setAppliedJobs(Array.isArray(jobs) ? jobs : []);
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
        setError(
          error?.response?.data?.message ||
            "Failed to load applied jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user, authLoading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading applied jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Applied Jobs</h1>
          <p className="text-slate-600 mt-2">
            Track all the jobs you have applied to.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {appliedJobs.length === 0 ? (
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
              No applications yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start applying to jobs to see them here.
            </p>
            <button
              onClick={() => router.push("/jobs")}
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {appliedJobs.map((application) => {
              const job = application.job || application;
              const status = application.status || "pending";
              const appliedDate =
                application.appliedAt || application.createdAt;

              return (
                <div
                  key={application._id || application.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {job.title || "Job Title"}
                      </h3>
                      <p className="text-slate-600 mb-2">
                        {job.company || "Company Name"}
                      </p>
                      <p className="text-slate-500 text-sm mb-4">
                        {job.location || "Location not specified"}
                      </p>
                      {job.description && (
                        <p className="text-slate-700 line-clamp-2">
                          {job.description}
                        </p>
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

                  {job.salary && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-slate-700 font-medium">
                        Salary: {job.salary}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsPage;
