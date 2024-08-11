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
} from "../api/SuppliersApi";

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (!loggedIn) {
    throw redirect("login");
  }
  const { suppliers } = await searchSuppliers();
  const users = await getUserList();
  return { users, suppliers };
}

export async function action({ request }) {
  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "add") {
    const supplierName = formData.get("supplierName");
    const supplierMobile = formData.get("supplierMobile");
    const supplierAddress = formData.get("supplierAddress");
    let response = await addSupplier(
      supplierName,
      supplierMobile,
      supplierAddress
    );
    if (response !== null) {
      response = {
        ...response,
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "edit") {
    const supplierName = formData.get("supplierName");
    const supplierMobile = formData.get("supplierMobile");
    const supplierAddress = formData.get("supplierAddress");
    const supplierId = formData.get("supplierId");
    let response = await editSupplier(
      supplierName,
      supplierMobile,
      supplierAddress,
      supplierId
    );
    if (response !== null) {
      response = {
        ...response,
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "delete") {
    const supplierId = formData.get("supplierId");
    let response = await deleteSupplier(supplierId);
    if (response !== null) {
      response = {
        ...response,
        formType: formType,
      };
      return response;
    }
    return null;
  }
  return null;
}

export default function Suppliers() {
  const { users, suppliers } = useLoaderData();
  const [modal, setModal] = useState({
    supplierId: "",
    supplierName: "",
    supplierMobile: "",
    supplierAddress: "",
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
  const dataGrid = suppliers.map((supplier) => {
    return (
      <tr key={supplier.supplierId}>
        <td>{supplier.supplierId}</td>
        <td>{supplier.supplierName}</td>
        <td>{supplier.supplierMobile}</td>
        <td>{supplier.supplierAddress}</td>
        <td>
          {users.filter((user) => user.id === supplier.userId)[0].description}
        </td>
        <td className="text-end">
          <button
            type="button"
            className="btn btn-secondary fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
            onClick={() => {
              loadModalData(supplier.supplierId);
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
              loadModalData(supplier.supplierId);
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
        supplierId: "",
        supplierName: "",
        supplierMobile: "",
        supplierAddress: "",
        userId: "",
      };
    });
  }
  function loadModalData(supplierId) {
    const supplier = suppliers.filter(
      (supplier) => supplier.supplierId === supplierId
    )[0];
    setModal(() => {
      return {
        supplierId: supplier.supplierId,
        supplierName: supplier.supplierName,
        supplierMobile: supplier.supplierMobile,
        supplierAddress: supplier.supplierAddress,
        userId: supplier.userId,
      };
    });
  }
  return (
    <>
      <Navbar selected="suppliers" />
      <div className="content">
        <h1 className="content-heading">Suppliers</h1>
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
              Add Supplier
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Supplier ID</th>
              <th scope="col">Supplier Name</th>
              <th scope="col">Supplier Mobile</th>
              <th scope="col">Supplier Address</th>
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
        title="Add Supplier"
        modalId="addModal"
        formId="addForm"
        buttonText="Add Supplier"
        modalType="add"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="supplierName" className="form-label">
                Supplier Name
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierName"
                name="supplierName"
                value={modal.supplierName}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierName: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="supplierMobile" className="form-label">
                Supplier Mobile
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierMobile"
                name="supplierMobile"
                value={modal.supplierMobile}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierMobile: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="supplierAddress" className="form-label">
                Supplier Address
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierAddress"
                name="supplierAddress"
                value={modal.supplierAddress}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierAddress: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <input type="hidden" name="formType" value="add" readOnly={true} />
          </>
        }
      />
      <FormModal
        title="Delete Supplier"
        modalId="deleteModal"
        formId="deleteForm"
        buttonText="Delete Supplier"
        modalType="delete"
        formContent={
          <>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row">Supplier ID</th>
                  <td>{modal.supplierId}</td>
                </tr>
                <tr>
                  <th scope="row">Supplier Name</th>
                  <td>{modal.supplierName}</td>
                </tr>
                <tr>
                  <th scope="row">Supplier Mobile</th>
                  <td>{modal.supplierMobile}</td>
                </tr>
                <tr>
                  <th scope="row">Supplier Address</th>
                  <td>{modal.supplierAddress}</td>
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
              name="supplierId"
              value={modal.supplierId}
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
        title="Edit Supplier"
        modalId="editModal"
        formId="editForm"
        buttonText="Edit Supplier"
        modalType="edit"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="supplierName" className="form-label">
                Supplier Name
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierName"
                name="supplierName"
                value={modal.supplierName}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierName: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="supplierMobile" className="form-label">
                Supplier Mobile
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierMobile"
                name="supplierMobile"
                value={modal.supplierMobile}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierMobile: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="supplierAddress" className="form-label">
                Supplier Address
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierAddress"
                name="supplierAddress"
                value={modal.supplierAddress}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      supplierAddress: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <input
              type="hidden"
              name="supplierId"
              value={modal.supplierId}
              readOnly={true}
            />
            <input type="hidden" name="formType" value="edit" readOnly={true} />
          </>
        }
      />
    </>
  );
}
