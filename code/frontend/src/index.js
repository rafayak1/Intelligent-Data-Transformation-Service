import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new createRoot API
import App from './components/App';
import { AuthProvider } from './context/AuthContext'; // Wrap app in AuthProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  </React.StrictMode>
);