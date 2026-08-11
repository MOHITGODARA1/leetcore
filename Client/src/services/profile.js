import axios from "axios";
import { csrfRequestInterceptor } from "./csrf";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const AUTH_TOKEN_KEY = "leetcore_auth_token";

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.request.use(csrfRequestInterceptor);

export const getPublicProfile = async (username) => {
  const response = await apiClient.get(`/profiles/${encodeURIComponent(username)}`);
  return response.data.profile;
};

export const updateMyProfile = async (payload) => {
  const response = await apiClient.patch("/users/me/profile", payload);
  return response.data.user;
};

export const getPublicProfileUrl = (username) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/profile/${encodeURIComponent(username || "")}`;
};
