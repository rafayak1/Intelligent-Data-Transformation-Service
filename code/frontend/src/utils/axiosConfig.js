import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://104.196.225.212:5000', // Replace with your backend URL
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Fetch token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
  }
  return config;
});

export default axiosInstance;