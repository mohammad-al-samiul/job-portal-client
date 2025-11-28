import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://job-porta1-backend.vercel.app/api",
  withCredentials: true, // Required to send httpOnly cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Note: Token is stored in httpOnly cookie (jobPortalToken) by backend
// Cookies are automatically sent with requests when withCredentials: true
// Backend checks cookie first, then falls back to Bearer token if needed

export default apiClient;
