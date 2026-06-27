import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

const DEFAULT_API_BASE_URL = "https://mern-ai-moneymap-app.onrender.com/api";

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_API_BASE_URL;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    return DEFAULT_API_BASE_URL;
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (host === "github.io" || host.endsWith(".github.io")) {
    return DEFAULT_API_BASE_URL;
  }

  const urlWithoutTrailingSlash = configuredUrl.replace(/\/+$/, "");
  return urlWithoutTrailingSlash.endsWith("/api")
    ? urlWithoutTrailingSlash
    : `${urlWithoutTrailingSlash}/api`;
};

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const auth = (getState() as RootState).auth;
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
    }
    return headers;
  },
});

export const apiClient = createApi({
  reducerPath: "api", // Add API client reducer to root reducer
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true, // Refetch on mount or arg change
  tagTypes: ["transactions", "analytics", "billingSubscription"], // Tag types for RTK Query
  endpoints: () => ({}), // Endpoints for RTK Query
});
