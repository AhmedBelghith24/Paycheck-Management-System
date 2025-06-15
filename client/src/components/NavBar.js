import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Shell-Logo.png'
import AuthContext from '../context/AuthContext'

function Navbar() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img
            src={logo}
            alt="logo"
            width="40"
            height="40"
            className="d-inline-block align-text-top me-2"
          />
          <span className="fw-bold">
            Societe <span style={{ color: 'red' }}>3C</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/supplier">
                Supplier
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bank">
                Bank
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/payed-check">
                Payed Check
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-danger btn btn-link"
                style={{ textDecoration: 'none' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
