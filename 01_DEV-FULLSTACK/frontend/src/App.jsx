import { useState } from 'react'
import './App.css'
// React Router
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
// Pages
import LandingP from './components/LandingP'
import ButterflyWelcome from './components/ButterflyWelcome'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/Forgotpw'
import ResetPassword from './components/ResetPassword'

// ProtectedRoute
import Dashboard from './pages/Dashboard'
import Activity from './pages/Activity'
import Profile from './pages/Profile'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingP />} />
        {/* <Route path="/Welcome" element={<ButterflyWelcome /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
