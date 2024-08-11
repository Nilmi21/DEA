import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/AuthenticationApi";

export default function Navbar({ selected }) {
  const navigate = useNavigate();
  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-dark nav-align"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <span className="navbar-brand">Lahiru Auto International</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link fw-bold ${
                    selected === "customerInvoices" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Customer Invoices
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-bold ${
                    selected === "supplierInvoices" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/supplier-invoices"
                >
                  Supplier Invoices
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-bold ${
                    selected === "products" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/products"
                >
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-bold ${
                    selected === "customers" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/customers"
                >
                  Customers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-bold ${
                    selected === "suppliers" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/suppliers"
                >
                  Suppliers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-bold ${
                    selected === "administration" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/administration"
                >
                  Administration
                </Link>
              </li>
            </ul>
            <div className="d-flex">
              <button
                className="btn btn-light fw-bold"
                type="button"
                onClick={() => {
                  logout(navigate);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
