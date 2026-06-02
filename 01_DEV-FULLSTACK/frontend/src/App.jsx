import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'

// Pages
import LandingP from './components/LandingP'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/Forgotpw'
import ResetPassword from './components/ResetPassword'
import VerifyOtp from './components/VerifyOtp'

// ProtectedRoute
import Dashboard from './pages/Dashboard'
import Activity from './pages/Activity'
import Profile from './pages/Profile'
import WeeklyActivity from './pages/WeeklyActivity'

// Toast
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingP />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/weekly-activity" element={<WeeklyActivity />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
