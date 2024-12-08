import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://34.145.69.213:5000', // Backend VM's public IP
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