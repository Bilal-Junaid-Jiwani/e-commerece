// API Configuration for development and production
// We use relative paths ('') so that Vercel rewrites in vercel.json handle the routing to the backend.
const API_URL = '';

export const getApiUrl = () => API_URL;

export default API_URL;
