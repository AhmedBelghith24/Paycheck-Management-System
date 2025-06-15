// src/components/PrivateRoute.js
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) return null // Prevent routing until auth state is known

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
