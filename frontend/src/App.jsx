import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './pages/landing'
import Navbar from './pages/Navbar'
import Profile from './pages/FarmerProfile'
import FindVegetables from './pages/Find-vegs'
import ManageVegetables from './pages/ManageVegetables'
import Login from './pages/Login';
import Register from './pages/Register';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import FarmerOrders from './pages/FarmerOrders'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Landing />} />

      {/* Protected routes - require authentication */}
      <Route path="/orders" element={
        <ProtectedRoute>
          <FarmerOrders />
        </ProtectedRoute>
      } />
      <Route path="/sell" element={
        <ProtectedRoute>
          <ManageVegetables />
        </ProtectedRoute>
      } />
      <Route path="/market" element={
        <ProtectedRoute>
          <FindVegetables />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;