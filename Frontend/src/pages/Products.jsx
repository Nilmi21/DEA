import Navbar from "../assets/components/Navbar";
import FormModal from "../assets/components/FormModal";
import { requireAuth } from "../api/AuthenticationApi";
import { redirect, useActionData, useLoaderData } from "react-router-dom";
import {
  addUser,
  deleteUser,
  searchUsers,
  editUser,
  getUserList,
} from "../api/UserApi";
import { useEffect, useState } from "react";
import {
  addCustomer,
  deleteCustomer,
  editCustomer,
  searchCustomers,
} from "../api/CustomersApi";
import {
  addSupplier,
  deleteSupplier,
  editSupplier,
  searchSuppliers,
  searchSuppliersList,
} from "../api/SuppliersApi";
import {
  addProduct,
  deleteProduct,
  editProduct,
  searchProducts,
} from "../api/ProductsApi";

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (!loggedIn) {
    throw redirect("login");
  }
  const products = await searchProducts();
  const users = await getUserList();
  const suppliers = await searchSuppliersList();
  return { users, products, suppliers };
}

export async function action({ request }) {
  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "add") {
    const productDescription = formData.get("productDescription");
    const quantityAvailable = formData.get("quantityAvailable");
    const reorderQuantity = formData.get("reorderQuantity");
    const supplierId = formData.get("supplierId");
    let response = await addProduct(
      productDescription,
      quantityAvailable,
      reorderQuantity,
      supplierId
    );
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Product successfully added.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "edit") {
    const productDescription = formData.get("productDescription");
    const quantityAvailable = formData.get("quantityAvailable");
    const reorderQuantity = formData.get("reorderQuantity");
    const supplierId = formData.get("supplierId");
    const productId = formData.get("productId");
    let response = await editProduct(
      productDescription,
      quantityAvailable,
      reorderQuantity,
      supplierId,
      productId
    );
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Product successfully edited.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "delete") {
    const productId = formData.get("productId");
    let response = await deleteProduct(productId);
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Product successfully deleted.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  }
  return null;
}

export default function Products() {
  const { users, products, suppliers } = useLoaderData();
  const [modal, setModal] = useState({
    productId: "",
    productDescription: "",
    quantityAvailable: "",
    reorderQuantity: "",
    supplierId: "",
    userId: "",
  });
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
      if (response.formType === "edit" && response.message.success) {
        document.getElementById("editModalClose").click();
        setTimeout(function () {
          clearModalData();
        }, 0);
      }
    }
  }, [response]);
  const dataGrid = products.map((product) => {
    return (
      <tr key={product.productId}>
        <td>{product.productId}</td>
        <td>{product.productDescription}</td>
        <td>{product.quantityAvailable}</td>
        <td>{product.reorderQuantity}</td>
        <td>
          {
            suppliers.filter((supplier) => supplier.id == product.supplierId)[0]
              .description
          }
        </td>
        <td>
          {users.filter((user) => user.id === product.userId)[0].description}
        </td>
        <td className="text-end">
          <button
            type="button"
            className="btn btn-secondary fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
            onClick={() => {
              loadModalData(product.productId);
            }}
          >
            &nbsp;&nbsp;Edit&nbsp;&nbsp;
          </button>
          <button
            type="button"
            className="btn btn-danger fw-bold ms-3"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
            onClick={() => {
              loadModalData(product.productId);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  const supplierOptions = suppliers.map((suppliers) => {
    return (
      <option key={suppliers.id} value={suppliers.id}>
        {suppliers.description}
      </option>
    );
  });

  function clearModalData() {
    setModal(() => {
      return {
        productId: "",
        productDescription: "",
        quantityAvailable: "",
        reorderQuantity: "",
        supplierId: "",
        userId: "",
      };
    });
  }
  function loadModalData(productId) {
    const product = products.filter(
      (product) => product.productId === productId
    )[0];
    setModal(() => {
      return {
        productId: product.productId,
        productDescription: product.productDescription,
        quantityAvailable: product.quantityAvailable,
        reorderQuantity: product.reorderQuantity,
        supplierId: product.supplierId,
        userId: product.userId,
      };
    });
  }
  return (
    <>
      <Navbar selected="products" />
      <div className="content">
        <h1 className="content-heading">Products</h1>
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
              Add Product
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Product ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Avaialable Quantity</th>
              <th scope="col">Re-order Quantity</th>
              <th scope="col">Supplier</th>
              <th scope="col">Last Modified User</th>
              <th scope="col" className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{dataGrid}</tbody>
        </table>
      </div>
      <FormModal
        title="Add Product"
        modalId="addModal"
        formId="addForm"
        buttonText="Add Product"
        modalType="add"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productDescription"
                name="productDescription"
                value={modal.productDescription}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      productDescription: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="quantityAvailable" className="form-label">
                Avaiable Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="quantityAvailable"
                name="quantityAvailable"
                value={modal.quantityAvailable}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      quantityAvailable: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reorderQuantity" className="form-label">
                Reorder Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="reorderQuantity"
                name="reorderQuantity"
                value={modal.reorderQuantity}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      reorderQuantity: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="supplierId" className="form-label">
                Supplier
              </label>
              <select
                className="form-select"
                id="supplierId"
                name="supplierId"
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
            <input type="hidden" name="formType" value="add" readOnly={true} />
          </>
        }
      />
      <FormModal
        title="Delete Product"
        modalId="deleteModal"
        formId="deleteForm"
        buttonText="Delete Product"
        modalType="delete"
        formContent={
          <>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row">Product ID</th>
                  <td>{modal.supplierId}</td>
                </tr>
                <tr>
                  <th scope="row">Product Name</th>
                  <td>{modal.productDescription}</td>
                </tr>
                <tr>
                  <th scope="row">Available Quantity</th>
                  <td>{modal.quantityAvailable}</td>
                </tr>
                <tr>
                  <th scope="row">Reorder Quantity</th>
                  <td>{modal.reorderQuantity}</td>
                </tr>
                <tr>
                  <th scope="row">Supplier</th>
                  <td>
                    {
                      suppliers.filter(
                        (supplier) => supplier.id == modal.supplierId
                      )[0]?.description
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
            <input
              type="hidden"
              name="productId"
              value={modal.productId}
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
      <FormModal
        title="Edit Product"
        modalId="editModal"
        formId="editForm"
        buttonText="Edit Product"
        modalType="edit"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="eproductDescription" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="eproductDescription"
                name="productDescription"
                value={modal.productDescription}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      productDescription: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="equantityAvailable" className="form-label">
                Avaiable Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="equantityAvailable"
                name="quantityAvailable"
                value={modal.quantityAvailable}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      quantityAvailable: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ereorderQuantity" className="form-label">
                Reorder Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="ereorderQuantity"
                name="reorderQuantity"
                value={modal.reorderQuantity}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      reorderQuantity: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="esupplierId" className="form-label">
                Supplier
              </label>
              <select
                className="form-select"
                id="esupplierId"
                name="supplierId"
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
            <input
              type="hidden"
              name="productId"
              value={modal.productId}
              readOnly={true}
            />
            <input type="hidden" name="formType" value="edit" readOnly={true} />
          </>
        }
      />
    </>
  );
}
