// In development (Vite proxy): /api works directly
// In production (Render): use the backend URL from env variable
const API_BASE = import.meta.env.VITE_API_URL || ''

export function apiUrl(path) {
  return `${API_BASE}${path}`
}
