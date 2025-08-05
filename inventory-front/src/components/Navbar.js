import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <Link to="/" className="text-lg font-semibold">
        Inventory System
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">
              Welcome, <strong>{user.username}</strong> ({user.role})
            </span>
            <button onClick={handleLogout} className="text-red-400 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
