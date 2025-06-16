import React, { useEffect, useState } from "react";
import InputGroup from "../components/InputGroup";
import RowDetails from "../components/RowDetails";
import axios from "axios";
import Alert from "../components/Alert";
import StationBanner from "../components/StationBanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css"; // ✅ Import enhanced styles
import Navbar from "../components/NavBar";

function Home() {
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const [supplierList, setSupplierList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [filterRange, setFilterRange] = useState([null, null]);
  const [startDate, endDate] = filterRange;

  const [filterBy, setFilterBy] = useState("ReceivingDate");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedIds, setSelectedIds] = useState([]);

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (name, date) => {
    setForm({
      ...form,
      [name]: date,
    });
  };

  const fetchBills = async () => {
    try {
      const res = await axios.get("/api/bills?paid=false");
      setBills(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des factures :", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/api/suppliers");
      setSupplierList(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs :", error);
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await axios.get("/api/banks");
      setBankList(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des banques :", error);
    }
  };

  const onMarkAsPaid = async (id) => {
    await axios.patch(`/api/bills/mark-paid/${id}`);
    fetchBills();
    setMessage("Marqué comme payé");
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const requiredFields = [
      "Supplier",
      "Bank",
      "BillNumber",
      "ReceivingDate",
      "BillAmount",
      "PaycheckNumber",
      "Amount",
      "PaymentDate",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]) {
        newErrors[field] = "Ce champ est requis";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("⚠️ Veuillez remplir tous les champs requis.");
      setShow(true);
      setTimeout(() => setShow(false), 4000);
      return;
    }

    axios
      .post("/api/bills", form)
      .then((res) => {
        setMessage("Facture ajoutée avec succès");
        setForm({});
        setErrors({});
        setShow(true);
        fetchBills();
        setTimeout(() => setShow(false), 4000);
      })
      .catch((err) => setErrors(err.response.data));
  };

  const OnDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet enregistrement ?")) {
      axios.delete(`/api/bills/${id}`).then((res) => {
        setMessage("Enregistrement supprimé");
        setShow(true);
        fetchBills();
        setTimeout(() => setShow(false), 4000);
      });
    }
  };

  useEffect(() => {
    fetchBills();
    fetchSuppliers();
    fetchBanks();
  }, []);

  const filteredBills = bills.filter((bill) => {
    const matchesSupplier =
      !selectedSupplier || bill.Supplier === selectedSupplier;
    const matchesBank = !selectedBank || bill.Bank === selectedBank;

    let matchesRange = true;
    if (startDate && endDate) {
      const dateToCompare = bill[filterBy];
      if (dateToCompare) {
        const billDate = new Date(dateToCompare);
        matchesRange = billDate >= startDate && billDate <= endDate;
      } else {
        matchesRange = false;
      }
    }

    return matchesSupplier && matchesBank && matchesRange;
  });

  const totalSelectedAmount = filteredBills
    .filter((bill) => selectedIds.includes(bill._id))
    .reduce((acc, bill) => acc + parseFloat(bill.Amount || 0), 0);

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const allSelected =
    paginatedBills.length > 0 &&
    paginatedBills.every((bill) => selectedIds.includes(bill._id));

  const handleSelectAll = () => {
    const visibleIds = paginatedBills.map((bill) => bill._id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allVisibleSelected) {
      setSelectedIds((prevSelected) =>
        prevSelected.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedIds((prevSelected) => [
        ...new Set([...prevSelected, ...visibleIds]),
      ]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid p-4 mt-5">
        <StationBanner />

        {/* Section d'alertes */}
        <div className="mt-4 fade-in-up">
          <Alert message={message} show={show} />
        </div>

        {/* Conteneur principal */}
        <div className="paycheck-container fade-in-up">
          <div className="grid-container">
            {/* Section d'ajout */}
            <div>
              <h2 className="section-header">Ajouter un nouveau paiement</h2>
              <div className="form-container">
                <form onSubmit={onSubmitHandler}>
                  <div className="form-group">
                    <label className="form-label">Fournisseur</label>
                    <select
                      className="form-select"
                      name="Supplier"
                      value={form.Supplier || ""}
                      onChange={onChangeHandler}
                    >
                      <option value="">Choisissez un fournisseur</option>
                      {supplierList.map((s) => (
                        <option key={s._id} value={s.SupplierName}>
                          {s.SupplierName}
                        </option>
                      ))}
                    </select>
                    {errors.Supplier && (
                      <div className="invalid-feedback d-block">
                        {errors.Supplier}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Banque</label>
                    <select
                      className="form-select"
                      name="Bank"
                      value={form.Bank || ""}
                      onChange={onChangeHandler}
                    >
                      <option value="">Choisissez une banque</option>
                      {bankList.map((b) => (
                        <option key={b._id} value={b.BankName}>
                          {b.BankName}
                        </option>
                      ))}
                    </select>
                    {errors.Bank && (
                      <div className="invalid-feedback d-block">
                        {errors.Bank}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <InputGroup
                      label="N° facture"
                      type="text"
                      name="BillNumber"
                      onChangeHandler={onChangeHandler}
                      errors={errors.BillNumber}
                      value={form.BillNumber || ""}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date de réception</label>
                    <DatePicker
                      selected={
                        form.ReceivingDate ? new Date(form.ReceivingDate) : null
                      }
                      onChange={(date) =>
                        handleDateChange("ReceivingDate", date)
                      }
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Sélectionnez une date"
                    />
                    {errors.ReceivingDate && (
                      <div className="invalid-feedback d-block">
                        {errors.ReceivingDate}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <InputGroup
                      label="Montant facture"
                      type="text"
                      name="BillAmount"
                      onChangeHandler={onChangeHandler}
                      errors={errors.BillAmount}
                      value={form.BillAmount || ""}
                    />
                  </div>

                  <div className="form-group">
                    <InputGroup
                      label="N° règlement"
                      type="text"
                      name="PaycheckNumber"
                      onChangeHandler={onChangeHandler}
                      errors={errors.PaycheckNumber}
                      value={form.PaycheckNumber || ""}
                    />
                  </div>

                  <div className="form-group">
                    <InputGroup
                      label="Montant"
                      type="text"
                      name="Amount"
                      onChangeHandler={onChangeHandler}
                      errors={errors.Amount}
                      value={form.Amount || ""}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date de paiement</label>
                    <DatePicker
                      selected={
                        form.PaymentDate ? new Date(form.PaymentDate) : null
                      }
                      onChange={(date) => handleDateChange("PaymentDate", date)}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Sélectionnez une date"
                    />
                    {errors.PaymentDate && (
                      <div className="invalid-feedback d-block">
                        {errors.PaymentDate}
                      </div>
                    )}
                  </div>

                  <button className="btn btn-danger w-100" type="submit">
                    Ajouter la facture
                  </button>
                </form>
              </div>
            </div>

            {/* Section de liste */}
            <div>
              <h2 className="section-header">Liste des paiements</h2>

              {/* Contrôles de filtre */}
              <div className="filter-container">
                <div className="filter-row">
                  <select
                    className="form-select"
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                  >
                    <option value="">Tous les fournisseurs</option>
                    {supplierList.map((s) => (
                      <option key={s._id} value={s.SupplierName}>
                        {s.SupplierName}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">Toutes les banques</option>
                    {bankList.map((b) => (
                      <option key={b._id} value={b.BankName}>
                        {b.BankName}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="ReceivingDate">Mois de réception</option>
                    <option value="PaymentDate">Mois de paiement</option>
                  </select>

                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setFilterRange(update)}
                    isClearable
                    placeholderText="Filtrer par plage de dates"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Tableau */}
              <div className="table-container">
                <table className="table table-hover text-center">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Fournisseur</th>
                      <th>Banque</th>
                      <th>N° facture</th>
                      <th>Date de réception</th>
                      <th>Montant facture</th>
                      <th>N° règlement</th>
                      <th>Montant</th>
                      <th>Date de paiement</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBills.map((bill) => (
                      <RowDetails
                        key={bill._id}
                        Id={bill._id}
                        Supplier={bill.Supplier}
                        Bank={bill.Bank}
                        BillNumber={bill.BillNumber}
                        ReceivingDate={bill.ReceivingDate}
                        BillAmount={bill.BillAmount}
                        PaycheckNumber={bill.PaycheckNumber}
                        Amount={bill.Amount}
                        PaymentDate={bill.PaymentDate}
                        paid={bill.paid}
                        OnDelete={OnDelete}
                        onMarkAsPaid={onMarkAsPaid}
                        isSelected={selectedIds.includes(bill._id)}
                        onSelect={() => handleSelect(bill._id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Montant total */}
              <div className="total-amount">
                Montant total sélectionné&nbsp;: $
                {totalSelectedAmount.toFixed(2)}
              </div>

              {/* Pagination */}
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => handlePageChange(i + 1)}
                        className="page-link"
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
