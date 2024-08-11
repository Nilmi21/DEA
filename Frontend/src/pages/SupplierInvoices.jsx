import Navbar from "../assets/components/Navbar";
import FormModal from "../assets/components/FormModal";
import { requireAuth } from "../api/AuthenticationApi";
import { redirect, useActionData, useLoaderData } from "react-router-dom";
import {
  addCustomerInvoice,
  deleteCustomerInvoice,
  searchCustomerInvoices,
} from "../api/CustomerInvoicesApi";
import { getUserList } from "../api/UserApi";
import { searchCustomers } from "../api/CustomersApi";
import { getProductlist, searchProducts } from "../api/ProductsApi";
import { roundToTwoDecimals, stringifyProducts } from "../utils/StringUtils";
import { useEffect, useState } from "react";
import {
  addSupplierInvoice,
  deleteSupplierInvoice,
  searchSupplierInvoices,
} from "../api/SupplierInvoicesApi";
import { searchSuppliers } from "../api/SuppliersApi";

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (!loggedIn) {
    throw redirect("login");
  }
  const invoices = await searchSupplierInvoices();
  const users = await getUserList();
  const { suppliers } = await searchSuppliers();
  const products = await getProductlist();
  const productDetails = await searchProducts();

  return { invoices, users, suppliers, products, productDetails };
}

export async function action({ request }) {
  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "add") {
    const supplierInvoice = formData.get("supplierInvoice");
    let response = await addSupplierInvoice(supplierInvoice);
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Supplier Invoice successfully added.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "delete") {
    const supplierInvoiceId = formData.get("supplierInvoiceId");
    let response = await deleteSupplierInvoice(supplierInvoiceId);
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Supplier successfully deleted.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  }
  return null;
}

export default function SupplierInvoices() {
  const { invoices, users, suppliers, products, productDetails } =
    useLoaderData();
  const [modal, setModal] = useState({
    supplierInvoiceId: "",
    invoiceDate: "",
    supplierId: "",
    userId: "",
    invoiceProducts: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const response = useActionData();
  useEffect(() => {
    if (
      response !== undefined &&
      response !== null &&
      response.message !== undefined
    ) {
      if (response.formType === "add" && response.message.success) {
        document.getElementById("addModalClose").click();
        setTimeout(function () {
          clearModalData();
        }, 0);
      }
      if (response.formType === "delete" && response.message.success) {
        document.getElementById("deleteModalClose").click();
        setTimeout(function () {
          clearModalData();
        }, 0);
      }
    }
  }, [response]);
  const dataGrid = invoices?.map((invoice) => {
    return (
      <tr key={invoice.supplierInvoiceId}>
        <td>{invoice.supplierInvoiceId}</td>
        <td>{invoice.invoiceDate}</td>
        <td>
          {
            suppliers.filter(
              (supplier) => supplier.supplierId === invoice.supplierId
            )[0].supplierName
          }
        </td>
        <td>{stringifyProducts(invoice.invoiceProducts, products)}</td>
        <td>
          {users.filter((user) => user.id === invoice.userId)[0]?.description}
        </td>
        <td className="text-end">
          <button
            type="button"
            className="btn btn-danger fw-bold ms-3"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
            onClick={() => {
              loadModalData(invoice.supplierInvoiceId);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  function clearModalData() {
    setModal(() => {
      return {
        supplierInvoiceId: "",
        invoiceDate: "",
        supplierId: "",
        userId: "",
        invoiceProducts: [],
      };
    });
  }
  function loadModalData(supplierInvoiceId) {
    const invoice = invoices.filter(
      (invoice) => invoice.supplierInvoiceId === supplierInvoiceId
    )[0];
    setModal(() => {
      return {
        supplierInvoiceId: invoice.supplierInvoiceId,
        invoiceDate: invoice.invoiceDate,
        supplierId: invoice.supplierId,
        userId: invoice.userId,
        invoiceProducts: invoice.invoiceProducts,
      };
    });
  }

  const supplierOptions = suppliers.map((supplier) => {
    return (
      <option key={supplier.supplierId} value={supplier.supplierId}>
        {supplier.supplierName}
      </option>
    );
  });

  const productOptions = products
    .filter(
      (product) =>
        modal.invoiceProducts.filter(
          (invoiceProduct) => invoiceProduct.productId == product.id
        ).length === 0
    )
    .map((product) => {
      const productDetail = productDetails.filter(
        (productDetail) => productDetail.productId == product.id
      )[0];
      if (productDetail.supplierId != modal.supplierId) {
        return null;
      }
      return (
        <option key={product.id} value={product.id}>
          {product.description}
        </option>
      );
    });

  const activeProductGrid = modal.invoiceProducts.map((invoiceProduct) => {
    return (
      <tr key={invoiceProduct.productId} className="text-start">
        <td>
          {
            products.filter(
              (product) => product.id == invoiceProduct.productId
            )[0]?.description
          }
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            value={invoiceProduct.quantity}
            onChange={(event) => {
              const newInvoiceProducts = modal.invoiceProducts.map((x) => x);
              const index = modal.invoiceProducts.indexOf(invoiceProduct);
              newInvoiceProducts.splice(index, 1, {
                productId: invoiceProduct.productId,
                quantity: event.target.value,
              });
              setModal((prev) => {
                return {
                  ...prev,
                  invoiceProducts: newInvoiceProducts,
                };
              });
            }}
          />
        </td>
      </tr>
    );
  });

  const inactiveProductGrid = modal.invoiceProducts.map((invoiceProduct) => {
    return (
      <tr key={invoiceProduct.productId} className="text-start">
        <td>
          {
            products.filter(
              (product) => product.id == invoiceProduct.productId
            )[0]?.description
          }
        </td>
        <td>{roundToTwoDecimals(invoiceProduct.quantity)}</td>
      </tr>
    );
  });

  return (
    <>
      <Navbar selected="supplierInvoices" />
      <div className="content">
        <h1 className="content-heading">Supplier Invoices</h1>
        <div className="row mb-3">
          <div className="col text-end">
            <button
              type="button"
              className="btn btn-dark fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#addModal"
              onClick={() => {
                clearModalData();
              }}
            >
              Add Supplier Invoice
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Invoice ID</th>
              <th scope="col">Invoice Date</th>
              <th scope="col">Supplier</th>
              <th scope="col">Products</th>
              <th scope="col">User</th>
              <th scope="col" className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{dataGrid}</tbody>
        </table>
      </div>
      <FormModal
        title="Add Supplier Invoice"
        modalId="addModal"
        formId="addForm"
        buttonText="Add Supplier Invoice"
        modalType="add"
        formContent={
          <>
            <div className="mb-4">
              <label htmlFor="customerId" className="form-label">
                Supplier
              </label>
              <select
                className="form-select"
                id="customerId"
                name="customerId"
                value={modal.supplierId}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierId: event.target.value,
                    };
                  });
                }}
              >
                <option value="" disabled>
                  &nbsp;
                </option>
                {supplierOptions}
              </select>
            </div>
            <div className="mb-3 text-end">
              <div className="row mb-2">
                <div className="col col-8">
                  <select
                    className="form-select form-select-sm"
                    value={selectedProduct}
                    onChange={(event) => {
                      setSelectedProduct(() => event.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select a Product...
                    </option>
                    {productOptions}
                  </select>
                </div>
                <div className="col col-4">
                  {" "}
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      const newInvoiceProducts = modal.invoiceProducts.map(
                        (x) => x
                      );
                      newInvoiceProducts.push({
                        productId: selectedProduct,
                        quantity: 0,
                      });
                      setModal((prev) => {
                        return {
                          ...prev,
                          invoiceProducts: newInvoiceProducts,
                        };
                      });
                      setSelectedProduct(() => "");
                    }}
                  >
                    Add Product
                  </button>
                </div>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="text-start">
                      Product
                    </th>
                    <th scope="col" className="text-start">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>{activeProductGrid}</tbody>
              </table>
            </div>
            <input type="hidden" name="formType" value="add" readOnly={true} />
            <input
              type="hidden"
              name="supplierInvoice"
              value={JSON.stringify(modal)}
              readOnly={true}
            />
          </>
        }
      />
      <FormModal
        title="Delete Supplier Invoice"
        modalId="deleteModal"
        formId="deleteForm"
        buttonText="Delete Supplier Invoice"
        modalType="delete"
        formContent={
          <>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row">Invoice ID</th>
                  <td>{modal.supplierInvoiceId}</td>
                </tr>
                <tr>
                  <th scope="row">Invoice Date</th>
                  <td>{modal.invoiceDate}</td>
                </tr>
                <tr>
                  <th scope="row">Supplier</th>
                  <td>
                    {
                      suppliers.filter(
                        (supplier) => supplier.supplierId === modal.supplierId
                      )[0]?.supplierName
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Last Modified User</th>
                  <td>
                    {
                      users.filter((user) => user.id === modal.userId)[0]
                        ?.description
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" className="text-start">
                    Product
                  </th>
                  <th scope="col" className="text-start">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>{inactiveProductGrid}</tbody>
            </table>
            <input
              type="hidden"
              name="supplierInvoiceId"
              value={modal.supplierInvoiceId}
              readOnly={true}
            />
            <input
              type="hidden"
              name="formType"
              value="delete"
              readOnly={true}
            />
          </>
        }
      />
    </>
  );
}
