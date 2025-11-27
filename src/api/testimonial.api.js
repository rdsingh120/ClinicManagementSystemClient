import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyDoctorTestimonials = async () => {

  const res = await API.get("/testimonials/my");

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to load testimonials");
  }

  return res.data.data || [];
};
