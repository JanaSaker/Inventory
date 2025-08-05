import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/authContext'; // ✅ adjust path
import './index.css'; // must be after tailwind installed


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ wrap your app in the provider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
