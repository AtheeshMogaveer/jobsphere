import axios from "axios";

// Base URL — switches between dev and production automatically
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Interceptor — automatically adds token to every request
// You set it once here, never think about it again in components
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// JOBS
export const searchJobs = (params) => API.get("/jobs/search", { params });
export const searchByCompany = (name, params) =>
  API.get(`/jobs/company/${name}`, { params });
export const getJobDetails = (id) => API.get(`/jobs/detail/${id}`);
export const getSearchHistory = () => API.get("/jobs/history");

// SAVED JOBS
export const saveJob = (data) => API.post("/saved", data);
export const getSavedJobs = () => API.get("/saved");
export const deleteSavedJob = (jobId) => API.delete(`/saved/${jobId}`);
export const checkIfSaved = (jobId) => API.get(`/saved/check/${jobId}`);

export default API;
