import React, { useEffect, useState } from "react";
import InputGroup from "../components/InputGroup";
import RowDetails from "../components/RowDetails";
import axios from "axios";
import Alert from "../components/Alert";
import StationBanner from "../components/StationBanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  // const [filterMonth, setFilterMonth] = useState(null)
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
      console.error("Error fetching bills:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/api/suppliers");
      setSupplierList(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await axios.get("/api/banks");
      setBankList(res.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const onMarkAsPaid = async (id) => {
    await axios.patch(`/api/bills/mark-paid/${id}`);
    fetchBills();
    setMessage("Moved to Payed Paycheck");
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Define required fields
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

    // Check for any missing field
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // If there are any errors, set and show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("⚠️ Please fill all required fields.");
      setShow(true);
      setTimeout(() => setShow(false), 4000);
      return;
    }

    // If no errors, submit form
    axios
      .post("/api/bills", form)
      .then((res) => {
        setMessage(res.data.message);
        setForm({});
        setErrors({});
        setShow(true);
        fetchBills();
        setTimeout(() => setShow(false), 4000);
      })
      .catch((err) => setErrors(err.response.data));
  };

  const OnDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios.delete(`/api/bills/${id}`).then((res) => {
        setMessage(res.data.message);
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

  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedIds(
  //       selectedIds.filter(
  //         (id) => !paginatedBills.some((bill) => bill._id === id)
  //       )
  //     )
  //   } else {
  //     const newIds = paginatedBills.map((bill) => bill._id)
  //     setSelectedIds([...new Set([...selectedIds, ...newIds])])
  //   }
  // }

  const handleSelectAll = () => {
    const visibleIds = paginatedBills.map((bill) => bill._id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allVisibleSelected) {
      // Deselect all visible ones
      setSelectedIds((prevSelected) =>
        prevSelected.filter((id) => !visibleIds.includes(id))
      );
    } else {
      // Select all visible ones
      setSelectedIds((prevSelected) => [
        ...new Set([...prevSelected, ...visibleIds]),
      ]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id) // unselect
          : [...prevSelected, id] // select
    );
  };

  return (
    <div className="row p-4 mt-5">
      <Navbar />
      <StationBanner />
      <div className="mt-4">
        <Alert message={message} show={show} />
      </div>

      <div className="mt-4">
        <h2>Add New Paycheck</h2>{" "}
      </div>
      <div className="col-12 col-lg-4">
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label className="form-label">Supplier</label>
            <select
              className="form-select"
              name="Supplier"
              value={form.Supplier || ""}
              onChange={onChangeHandler}
            >
              <option value="">Select a supplier</option>
              {supplierList.map((s) => (
                <option key={s._id} value={s.SupplierName}>
                  {s.SupplierName}
                </option>
              ))}
            </select>
            {errors.Supplier && (
              <div className="invalid-feedback d-block">{errors.Supplier}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Bank</label>
            <select
              className="form-select"
              name="Bank"
              value={form.Bank || ""}
              onChange={onChangeHandler}
            >
              <option value="">Select a bank</option>
              {bankList.map((b) => (
                <option key={b._id} value={b.BankName}>
                  {b.BankName}
                </option>
              ))}
            </select>
            {errors.Bank && (
              <div className="invalid-feedback d-block">{errors.Bank}</div>
            )}
          </div>

          <InputGroup
            label="Bill Number"
            type="text"
            name="BillNumber"
            onChangeHandler={onChangeHandler}
            errors={errors.BillNumber}
            value={form.BillNumber || ""}
          />

          <div className="mb-3">
            <label className="form-label mb-2">Receiving Date</label>
            <DatePicker
              selected={
                form.ReceivingDate ? new Date(form.ReceivingDate) : null
              }
              onChange={(date) => handleDateChange("ReceivingDate", date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              showTimeSelect={false}
              placeholderText="Select a date"
            />
            {errors.ReceivingDate && (
              <div className="invalid-feedback d-block">
                {errors.ReceivingDate}
              </div>
            )}
          </div>

          <InputGroup
            label="Bill Amount"
            type="text"
            name="BillAmount"
            onChangeHandler={onChangeHandler}
            errors={errors.BillAmount}
            value={form.BillAmount || ""}
          />
          <InputGroup
            label="Paycheck Number"
            type="text"
            name="PaycheckNumber"
            onChangeHandler={onChangeHandler}
            errors={errors.PaycheckNumber}
            value={form.PaycheckNumber || ""}
          />
          <InputGroup
            label="Amount"
            type="text"
            name="Amount"
            onChangeHandler={onChangeHandler}
            errors={errors.Amount}
            value={form.Amount || ""}
          />

          <div className="mb-3">
            <label className="form-label mb-2">Payment Date</label>
            <DatePicker
              selected={form.PaymentDate ? new Date(form.PaymentDate) : null}
              onChange={(date) => handleDateChange("PaymentDate", date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              showTimeSelect={false}
              placeholderText="Select a date"
            />
            {errors.PaymentDate && (
              <div className="invalid-feedback d-block">
                {errors.PaymentDate}
              </div>
            )}
          </div>

          <button className="btn btn-danger" type="submit">
            Add Bill
          </button>
        </form>
      </div>
      <div className="col-12 col-lg-8">
        <div className="d-flex mb-3 gap-3 align-items-center">
          <select
            className="form-select"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">All Suppliers</option>
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
            <option value="">All Banks</option>
            {bankList.map((b) => (
              <option key={b._id} value={b.BankName}>
                {b.BankName}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm w-auto"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="ReceivingDate">Receiving Month</option>
            <option value="PaymentDate">Payment Month</option>
          </select>

          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setFilterRange(update)}
            isClearable
            placeholderText="Filter by Date Range"
            className="form-control w-auto"
          />
        </div>

        <h4 className="fw-bold mb-3">Paycheck List</h4>

        <table className="table table-bordered table-hover text-center">
          <thead className="table-warning">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Supplier</th>
              <th>Bank</th>
              <th>Bill #</th>
              <th>Receiving Date</th>
              <th>Bill Amount</th>
              <th>Paycheck #</th>
              <th>Amount</th>
              <th>Payment Date</th>
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

                // onSelect={() => handleSelect(bill._id)}
              />
            ))}
          </tbody>
        </table>

        <div className="text-end fw-bold">
          Total Selected Amount: ${totalSelectedAmount.toFixed(2)}
        </div>

        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
  );
}

export default Home;
