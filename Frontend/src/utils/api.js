// Base URL for all API calls.
// In dev: empty string → Vite proxy forwards /api/* to localhost:7000
// In production: set VITE_API_URL in .env.production (e.g. https://api.viwaha.com)
export const API = import.meta.env.VITE_API_URL ?? "";
