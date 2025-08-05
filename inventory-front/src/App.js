import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Inventory from './Pages/Inventory';
import PrivateRoute from './auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* ✅ ToastContainer must be outside Routes */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
