"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const MyJobsPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "employer") {
      router.push("/");
      return;
    }

    if (!user) return;

    const fetchMyJobs = async () => {
      try {
        // Assuming there's an endpoint to get employer's jobs
        // If not, we might need to filter from /jobs endpoint
        const response = await apiClient.get("/jobs");
        const allJobs = response?.data?.data || response?.data?.jobs || response?.data || [];
        
        // Filter jobs created by current employer
        // Backend should ideally provide /jobs/my-jobs or filter by employer
        // For now, we'll use all jobs (backend should filter by user)
        setJobs(Array.isArray(allJobs) ? allJobs : []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setError(
          error?.response?.data?.message ||
            "Failed to load your jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "employer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Job Postings</h1>
            <p className="text-slate-600 mt-2">
              Manage your job postings and view applicants.
            </p>
          </div>
          <button
            onClick={() => router.push("/jobs/create")}
            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg"
          >
            + Create New Job
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-slate-600 mb-6">
              Create your first job posting to start attracting candidates.
            </p>
            <button
              onClick={() => router.push("/jobs/create")}
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Create Job Posting
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job._id || job.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-slate-600 mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                      <span>{job.location}</span>
                      {job.jobType && <span>• {job.jobType}</span>}
                      {job.salaryRange && <span>• {job.salaryRange}</span>}
                    </div>
                    {job.description && (
                      <p className="text-slate-700 line-clamp-2 mb-4">
                        {job.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => router.push(`/jobs/${job._id || job.id}/applicants`)}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm"
                    >
                      View Applicants
                    </button>
                    <button
                      onClick={() => router.push(`/jobs/${job._id || job.id}/edit`)}
                      className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-sm"
                    >
                      Edit Job
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

export default MyJobsPage;

