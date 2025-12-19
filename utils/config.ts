// The API_URL is now configurable via an environment variable.
// In local development, it defaults to the local backend server.
// In production (on Vercel/Railway), VITE_API_URL must be set to the deployed backend's URL.
export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';