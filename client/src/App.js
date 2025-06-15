// src/App.js
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Supplier from './pages/Supplier'
import Bank from './pages/Bank'
import EditSupplier from './pages/EditSupplier'
import EditBank from './pages/EditBank'
import Details from './pages/Details'
import PayedCheckPage from './pages/PayedPaycheck'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplier"
            element={
              <PrivateRoute>
                <Supplier />
              </PrivateRoute>
            }
          />
          <Route
            path="/bank"
            element={
              <PrivateRoute>
                <Bank />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplier/edit/:id"
            element={
              <PrivateRoute>
                <EditSupplier />
              </PrivateRoute>
            }
          />
          <Route
            path="/bank/edit/:id"
            element={
              <PrivateRoute>
                <EditBank />
              </PrivateRoute>
            }
          />
          <Route
            path="/bill/edit/:id"
            element={
              <PrivateRoute>
                <Details />
              </PrivateRoute>
            }
          />
          <Route
            path="/payed-check"
            element={
              <PrivateRoute>
                <PayedCheckPage />
              </PrivateRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
