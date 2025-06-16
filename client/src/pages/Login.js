import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./style.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", form);
      login(res.data.token);
      setLoading(false);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur s'est produite lors de la connexion"
      );
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      <div className="form-section">
        <div className="form-content">
          <h3 className="form-title">Connexion</h3>
          {error && (
            <div className="alert" role="alert">
              <strong>Erreur :</strong> {error}
            </div>
          )}
          <form onSubmit={onSubmitHandler} noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={form.email}
                onChange={onChangeHandler}
                placeholder="votre.nom@shell.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={form.password}
                onChange={onChangeHandler}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <div className="checkbox-container">
              <input type="checkbox" id="remember" className="checkbox" />
              <label htmlFor="remember" className="checkbox-label">
                Se souvenir de moi
              </label>
            </div>
            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>

              <Link to="/signup" className="btn btn-secondary">
                CRÉER UN COMPTE
              </Link>
            </div>
          </form>
          <div className="help-text">
            Forgotten your login details?{" "}
            <a href="#" className="help-link">
              Obtenir de l'aide pour se connecter
            </a>
          </div>
        </div>
      </div>
      <div className="image-section">
        <div className="image-content">
          <div className="welcome-text">BIENVENUE À</div>
          <h1 className="brand-title">Société 3C</h1>
          <p className="subtitle">
            Connectez-vous pour accéder au tableau de bord
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
