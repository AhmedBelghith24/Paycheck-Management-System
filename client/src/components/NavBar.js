// src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Shell-Logo.png";
import AuthContext from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { label: "Accueil", to: "/home" },
    { label: "Fournisseurs", to: "/supplier" },
    { label: "Banque", to: "/bank" },
    { label: "Chèques payés", to: "/payed-check" },
  ];

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        {/* Logo only */}
        <Link to="/home" className="navbar-brand">
          <img src={logo} alt="Logo" />
        </Link>

        {/* Tabs */}
        <ul className="nav-links">
          {tabs.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={
                  "nav-link-custom" +
                  (location.pathname === to ? " active" : "")
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout pill */}
        <button onClick={handleLogout} className="logout-tab">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
