"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const ApplicantsPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  const { user, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
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

    if (!user || !jobId) return;

    const fetchData = async () => {
      try {
        // Fetch job details and applicants
        const [jobResponse, applicantsResponse] = await Promise.all([
          apiClient.get(`/jobs/${jobId}`).catch(() => ({ data: null })),
          apiClient.get(`/jobs/${jobId}/applicants`),
        ]);

        const jobData = jobResponse?.data?.data || jobResponse?.data || null;
        setJob(jobData);

        const applicantsData =
          applicantsResponse?.data?.data ||
          applicantsResponse?.data?.applicants ||
          applicantsResponse?.data ||
          [];

        setApplicants(Array.isArray(applicantsData) ? applicantsData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(
          error?.response?.data?.message ||
            "Failed to load applicants. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, jobId, router]);

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
        <div className="mb-8">
          <button
            onClick={() => router.push("/jobs/my-jobs")}
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
            Back to My Jobs
          </button>
          {job && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {job.title}
              </h1>
              <p className="text-slate-600 mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{job.location}</span>
                {job.jobType && <span>• {job.jobType}</span>}
                {job.salaryRange && <span>• {job.salaryRange}</span>}
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold text-slate-900">
            Applicants ({applicants.length})
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {applicants.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No applicants yet
            </h3>
            <p className="text-slate-600">
              Applicants will appear here once they apply to this job.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applicants.map((applicant) => {
              const applicantUser = applicant.user || applicant;
              const application = applicant.application || applicant;
              const status = application?.status || applicant.status || "pending";
              const appliedDate = application?.appliedAt || applicant.appliedAt || applicant.createdAt;

              return (
                <div
                  key={applicant._id || applicant.id || applicantUser._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                          {applicantUser?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {applicantUser?.name || "Applicant"}
                          </h3>
                          <p className="text-slate-600">
                            {applicantUser?.email || "No email provided"}
                          </p>
                        </div>
                      </div>

                      {applicantUser?.skills && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-2">
                            Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {typeof applicantUser.skills === "string" ? (
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                {applicantUser.skills}
                              </span>
                            ) : (
                              applicantUser.skills.map((skill, idx) => (
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

                      {applicantUser?.experience && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Experience:
                          </p>
                          <p className="text-slate-700 text-sm">
                            {applicantUser.experience}
                          </p>
                        </div>
                      )}

                      {applicantUser?.education && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Education:
                          </p>
                          <p className="text-slate-700 text-sm">
                            {applicantUser.education}
                          </p>
                        </div>
                      )}

                      {applicantUser?.resume && (
                        <a
                          href={applicantUser.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Resume
                        </a>
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

export default ApplicantsPage;

