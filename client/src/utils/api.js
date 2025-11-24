// API Configuration for development and production
const API_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = () => API_URL;

export default API_URL;
