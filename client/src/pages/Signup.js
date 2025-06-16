import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (form.password !== form.confirmPassword) {
      setError(
        "Les mots de passe ne correspondent pas. Veuillez vérifier votre saisie."
      );
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères pour votre sécurité."
      );
      return;
    }

    if (!form.email.includes("@")) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/signup", {
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur s'est produite lors de la création du compte"
      );
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      <div className="form-section">
        <div className="form-content">
          <h3 className="form-title">Inscription</h3>

          {error && (
            <div className="alert" role="alert">
              <strong>Attention :</strong> {error}
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
                placeholder="prenom.nom@shell.com"
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
                placeholder="Minimum 8 caractères"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                className="form-input"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChangeHandler}
                placeholder="Répétez votre mot de passe"
                required
                autoComplete="new-password"
              />
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
                    Création...
                  </>
                ) : (
                  "Créer un compte"
                )}
              </button>

              <Link to="/login" className="btn btn-secondary">
                Se connecter
              </Link>
            </div>
          </form>

          <div className="help-text">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="help-link">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      <div className="image-section">
        <div className="image-content">
          <div className="welcome-text">REJOINDRE</div>
          <h1 className="brand-title"> Société 3C</h1>
          <p className="subtitle">Create Account to Access Dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
