const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

let csrfTokenPromise = null;

const fetchCsrfToken = async () => {
  const response = await fetch(`${API_URL}/api/v1/csrf-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await response.json();
  return data.csrfToken;
};

export const getCsrfToken = () => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetchCsrfToken().catch((error) => {
      csrfTokenPromise = null;
      throw error;
    });
  }

  return csrfTokenPromise;
};

export const csrfRequestInterceptor = async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (["post", "put", "patch", "delete"].includes(method)) {
    try {
      const token = await getCsrfToken();
      config.headers = config.headers || {};
      config.headers["x-csrf-token"] = token;
    } catch {
      // Let the request proceed; the server may not enforce CSRF.
    }
  }

  return config;
};
