"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios.config";

const UsersManagementPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blocking, setBlocking] = useState(null);
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

    // Note: Assuming there's an endpoint to get all users
    // If not available, you might need to create one or use a different approach
    const fetchUsers = async () => {
      try {
        // This endpoint might need to be created on backend
        // For now, we'll show a message if it doesn't exist
        const response = await apiClient.get("/admin/users").catch(() => {
          throw new Error("Users endpoint not available");
        });

        const usersData =
          response?.data?.data ||
          response?.data?.users ||
          response?.data ||
          [];

        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load users. Please check if the endpoint exists."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, authLoading, router]);

  const handleBlockToggle = async (userId, currentStatus) => {
    setBlocking(userId);
    setFeedback({ type: "", message: "" });

    try {
      await apiClient.patch(`/admin/users/${userId}/block`, {
        isBlocked: !currentStatus,
      });

      setFeedback({
        type: "success",
        message: `User ${!currentStatus ? "blocked" : "unblocked"} successfully!`,
      });

      // Update user status in list
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId
            ? { ...u, isBlocked: !currentStatus }
            : u
        )
      );

      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user status. Please try again.";

      setFeedback({ type: "error", message });
    } finally {
      setBlocking(null);
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
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-2">
            Block or unblock users in the system ({users.length})
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

        {users.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No users found
            </h3>
            <p className="text-slate-600">
              {error
                ? "Please check if the users endpoint is available on the backend."
                : "There are no users in the system."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {users.map((userItem) => {
              const isBlocked = userItem.isBlocked || false;
              const userRole = userItem.role || "unknown";

              return (
                <div
                  key={userItem._id || userItem.id}
                  className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition ${
                    isBlocked ? "opacity-75 border-2 border-red-200" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                          {userItem?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-slate-900">
                              {userItem.name || "User"}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                userRole === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : userRole === "employer"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {userRole}
                            </span>
                            {isBlocked && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                Blocked
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600">{userItem.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                        <span>
                          Joined:{" "}
                          {userItem.createdAt
                            ? new Date(userItem.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          handleBlockToggle(
                            userItem._id || userItem.id,
                            isBlocked
                          )
                        }
                        disabled={blocking === (userItem._id || userItem.id)}
                        className={`px-6 py-2 font-semibold rounded-xl transition text-sm disabled:cursor-not-allowed disabled:opacity-70 ${
                          isBlocked
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {blocking === (userItem._id || userItem.id)
                          ? "Processing..."
                          : isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
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

export default UsersManagementPage;

