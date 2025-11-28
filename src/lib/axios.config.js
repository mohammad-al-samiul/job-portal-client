import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://job-porta1-backend.vercel.app/api",
  withCredentials: true, // Required to send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
