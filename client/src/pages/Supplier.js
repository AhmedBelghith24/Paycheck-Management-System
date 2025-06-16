import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";
import Navbar from "../components/NavBar";
import { PencilFill, Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./supplier.css"; // ✅ Styles améliorés

function Supplier() {
  const [form, setForm] = useState({
    SupplierName: "",
    SupplierPhoneNumber: "",
    SupplierAddress: "",
    SupplierTaxCode: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/suppliers");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs :", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/suppliers", form);
      setMessage("Fournisseur ajouté avec succès");
      setShowAlert(true);
      setForm({
        SupplierName: "",
        SupplierPhoneNumber: "",
        SupplierAddress: "",
        SupplierTaxCode: "",
      });
      fetchSuppliers();
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Échec de l'ajout du fournisseur"
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?"))
      return;
    setLoading(true);
    try {
      await axios.delete(`/api/suppliers/${id}`);
      setMessage("Fournisseur supprimé avec succès");
      setShowAlert(true);
      fetchSuppliers();
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      setMessage("Échec de la suppression du fournisseur");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = (id) => {
    navigate(`/supplier/edit/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="supplier-container">
        <div className="supplier-content">
          {/* En-tête de page */}
          <h1 className="supplier-header">Gestion des fournisseurs</h1>

          {/* Section d’alertes */}
          <Alert message={message} show={showAlert} />

          {/* Formulaire d’ajout */}
          <div className="supplier-form-section">
            <h2 className="supplier-subheader">Ajouter un fournisseur</h2>

            <form
              onSubmit={onSubmitHandler}
              className={loading ? "supplier-loading" : ""}
            >
              <div className="supplier-form-grid">
                <div className="supplier-form-group">
                  <label className="supplier-form-label">
                    Nom du fournisseur
                  </label>
                  <input
                    type="text"
                    className="supplier-form-control"
                    name="SupplierName"
                    value={form.SupplierName}
                    onChange={onChangeHandler}
                    placeholder="Entrez le nom"
                    required
                  />
                </div>

                <div className="supplier-form-group">
                  <label className="supplier-form-label">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    className="supplier-form-control"
                    name="SupplierPhoneNumber"
                    value={form.SupplierPhoneNumber}
                    onChange={onChangeHandler}
                    placeholder="Entrez le numéro"
                    required
                  />
                </div>

                <div className="supplier-form-group">
                  <label className="supplier-form-label">Adresse</label>
                  <input
                    type="text"
                    className="supplier-form-control"
                    name="SupplierAddress"
                    value={form.SupplierAddress}
                    onChange={onChangeHandler}
                    placeholder="Entrez l'adresse"
                    required
                  />
                </div>

                <div className="supplier-form-group">
                  <label className="supplier-form-label">Code fiscal</label>
                  <input
                    type="text"
                    className="supplier-form-control"
                    name="SupplierTaxCode"
                    value={form.SupplierTaxCode}
                    onChange={onChangeHandler}
                    placeholder="Entrez le code fiscal"
                    required
                  />
                </div>
              </div>

              <div
                className="supplier-form-group"
                style={{ marginTop: "2rem" }}
              >
                <button
                  type="submit"
                  className="supplier-btn supplier-btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Ajout en cours…" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>

          {/* Liste des fournisseurs */}
          <div className="supplier-table-section">
            <h2 className="supplier-subheader">Liste des fournisseurs</h2>

            {suppliers.length === 0 ? (
              <div className="supplier-empty-state">
                Aucun fournisseur trouvé. Ajoutez-en un ci-dessus.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="supplier-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Téléphone</th>
                      <th>Adresse</th>
                      <th>Code fiscal</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier._id}>
                        <td>
                          <strong>{supplier.SupplierName}</strong>
                        </td>
                        <td>{supplier.SupplierPhoneNumber}</td>
                        <td>{supplier.SupplierAddress}</td>
                        <td>
                          <code>{supplier.SupplierTaxCode}</code>
                        </td>
                        <td>
                          <div className="supplier-action-buttons">
                            <button
                              className="supplier-action-btn supplier-btn-warning"
                              onClick={() => handleModify(supplier._id)}
                              disabled={loading}
                            >
                              <PencilFill className="supplier-icon" />
                              Modifier
                            </button>
                            <button
                              className="supplier-action-btn supplier-btn-outline-danger"
                              onClick={() => handleDelete(supplier._id)}
                              disabled={loading}
                            >
                              <Trash3Fill className="supplier-icon" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section statistiques */}
          {suppliers.length > 0 && (
            <div
              className="supplier-stats"
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background:
                  "linear-gradient(135deg, var(--shell-red) 0%, var(--shell-yellow) 100%)",
                borderRadius: "var(--border-radius-lg)",
                color: "white",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                fontWeight: "600",
              }}
            >
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "1.25rem",
                  fontWeight: "bolder",
                }}
              >
                Nombre total de fournisseurs : {suppliers.length}
              </h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Gérez efficacement votre réseau de fournisseurs
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Supplier;
