"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const JobsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Assuming there's a GET /api/jobs endpoint to list all jobs
        const response = await apiClient.get("/jobs");
        const jobsData =
          response?.data?.data ||
          response?.data?.jobs ||
          response?.data ||
          [];

        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setFeedback({
          type: "error",
          message: "Failed to load jobs. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setApplyingTo(jobId);
    setFeedback({ type: "", message: "" });

    try {
      await apiClient.post(`/jobs/${jobId}/apply`);
      setFeedback({
        type: "success",
        message: "Application submitted successfully!",
      });

      // Optionally refresh the jobs list or update the specific job
      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to apply. Please try again.";

      setFeedback({ type: "error", message });
    } finally {
      setApplyingTo(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Browse Jobs</h1>
          <p className="text-slate-600 mt-2">
            Find your next opportunity from thousands of listings.
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
              No jobs available
            </h3>
            <p className="text-slate-600">
              Check back later for new job listings.
            </p>
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
                    <p className="text-slate-500 text-sm mb-4">
                      {job.location || "Location not specified"}
                    </p>
                    {job.description && (
                      <p className="text-slate-700 line-clamp-3 mb-4">
                        {job.description}
                      </p>
                    )}
                    {job.salary && (
                      <p className="text-slate-700 font-medium mb-2">
                        Salary: {job.salary}
                      </p>
                    )}
                    {job.requirements && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-600 mb-2">
                          Requirements:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {Array.isArray(job.requirements) ? (
                            job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))
                          ) : (
                            <li>{job.requirements}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => handleApply(job._id || job.id)}
                      disabled={applyingTo === (job._id || job.id)}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {applyingTo === (job._id || job.id)
                        ? "Applying..."
                        : "Apply Now"}
                    </button>
                    {job.type && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {job.type}
                      </span>
                    )}
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

export default JobsPage;

