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
import { getProductlist } from "../api/ProductsApi";
import { roundToTwoDecimals, stringifyProducts } from "../utils/StringUtils";
import { useEffect, useState } from "react";

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (!loggedIn) {
    throw redirect("login");
  }
  const invoices = await searchCustomerInvoices();
  const users = await getUserList();
  const customers = await searchCustomers();
  const products = await getProductlist();

  return { invoices, users, customers, products };
}

export async function action({ request }) {
  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "add") {
    const customerInvoice = formData.get("customerInvoice");
    let response = await addCustomerInvoice(customerInvoice);
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Customer Invoice successfully added.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "delete") {
    const customerInvoiceId = formData.get("customerInvoiceId");
    let response = await deleteCustomerInvoice(customerInvoiceId);
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Customer successfully deleted.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  }
  return null;
}

export default function CustomerInvoices() {
  const { invoices, users, customers, products } = useLoaderData();
  const [modal, setModal] = useState({
    customerInvoiceId: "",
    invoiceDate: "",
    customerId: "",
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
      <tr key={invoice.customerInvoiceId}>
        <td>{invoice.customerInvoiceId}</td>
        <td>{invoice.invoiceDate}</td>
        <td>
          {
            customers.filter(
              (customer) => customer.customerId === invoice.customerId
            )[0].customerName
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
              loadModalData(invoice.customerInvoiceId);
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
        customerInvoiceId: "",
        invoiceDate: "",
        customerId: "",
        userId: "",
        invoiceProducts: [],
      };
    });
  }
  function loadModalData(customerInvoiceId) {
    const invoice = invoices.filter(
      (invoice) => invoice.customerInvoiceId === customerInvoiceId
    )[0];
    setModal(() => {
      return {
        customerInvoiceId: invoice.customerInvoiceId,
        invoiceDate: invoice.invoiceDate,
        customerId: invoice.customerId,
        userId: invoice.userId,
        invoiceProducts: invoice.invoiceProducts,
      };
    });
  }

  const customerOptions = customers.map((customer) => {
    return (
      <option key={customer.customerId} value={customer.customerId}>
        {customer.customerName}
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
      <Navbar selected="customerInvoices" />
      <div className="content">
        <h1 className="content-heading">Customer Invoices</h1>
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
              Add Cutomer Invoice
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Invoice ID</th>
              <th scope="col">Invoice Date</th>
              <th scope="col">Customer</th>
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
        title="Add Customer Invoice"
        modalId="addModal"
        formId="addForm"
        buttonText="Add Customer Invoice"
        modalType="add"
        formContent={
          <>
            <div className="mb-4">
              <label htmlFor="customerId" className="form-label">
                Customer
              </label>
              <select
                className="form-select"
                id="customerId"
                name="customerId"
                value={modal.customerId}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerId: event.target.value,
                    };
                  });
                }}
              >
                <option value="" disabled>
                  &nbsp;
                </option>
                {customerOptions}
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
              name="customerInvoice"
              value={JSON.stringify(modal)}
              readOnly={true}
            />
          </>
        }
      />
      <FormModal
        title="Delete Customer Invoice"
        modalId="deleteModal"
        formId="deleteForm"
        buttonText="Delete Customer Invoice"
        modalType="delete"
        formContent={
          <>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row">Invoice ID</th>
                  <td>{modal.customerInvoiceId}</td>
                </tr>
                <tr>
                  <th scope="row">Invoice Date</th>
                  <td>{modal.invoiceDate}</td>
                </tr>
                <tr>
                  <th scope="row">Customer</th>
                  <td>
                    {
                      customers.filter(
                        (customer) => customer.customerId === modal.customerId
                      )[0]?.customerName
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
              name="customerInvoiceId"
              value={modal.customerInvoiceId}
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
