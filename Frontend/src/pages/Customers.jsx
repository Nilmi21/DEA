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

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (!loggedIn) {
    throw redirect("login");
  }
  const customers = await searchCustomers();
  const users = await getUserList();
  return { users, customers };
}

export async function action({ request }) {
  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "add") {
    const customerName = formData.get("customerName");
    const mobile = formData.get("mobile");
    const address = formData.get("address");
    let response = await addCustomer(customerName, mobile, address);
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Customer successfully added.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "edit") {
    const customerName = formData.get("customerName");
    const mobile = formData.get("mobile");
    const address = formData.get("address");
    const customerId = formData.get("customerId");
    let response = await editCustomer(
      customerName,
      mobile,
      address,
      customerId
    );
    if (response !== null) {
      response = {
        message: {
          success: true,
          message: "Customer successfully updated.",
        },
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "delete") {
    const customerId = formData.get("customerId");
    let response = await deleteCustomer(customerId);
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

export default function Customers() {
  const { users, customers } = useLoaderData();
  const [modal, setModal] = useState({
    customerId: "",
    customerName: "",
    customerMobile: "",
    customerAddress: "",
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
  const dataGrid = customers?.map((customer) => {
    return (
      <tr key={customer.customerId}>
        <td>{customer.customerId}</td>
        <td>{customer.customerName}</td>
        <td>{customer.mobileNumber}</td>
        <td>{customer.address}</td>
        <td>
          {users.filter((user) => user.id === customer.user_id)[0].description}
        </td>
        <td className="text-end">
          <button
            type="button"
            className="btn btn-secondary fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
            onClick={() => {
              loadModalData(customer.customerId);
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
              loadModalData(customer.customerId);
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
        customerId: "",
        customerName: "",
        customerMobile: "",
        customerAddress: "",
        userId: "",
      };
    });
  }
  function loadModalData(customerId) {
    const customer = customers.filter(
      (customer) => customer.customerId === customerId
    )[0];
    setModal(() => {
      return {
        customerId: customer.customerId,
        customerName: customer.customerName,
        customerMobile: customer.mobileNumber,
        customerAddress: customer.address,
        userId: customer.user_id,
      };
    });
  }
  return (
    <>
      <Navbar selected="customers" />
      <div className="content">
        <h1 className="content-heading">Customers</h1>
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
              Add Cutomer
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Customer ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Customer Mobile</th>
              <th scope="col">Customer Address</th>
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
        title="Add Customer"
        modalId="addModal"
        formId="addForm"
        buttonText="Add Customer"
        modalType="add"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="customerName" className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                name="customerName"
                value={modal.customerName}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerName: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">
                Customer Mobile
              </label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                name="mobile"
                value={modal.customerMobile}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerMobile: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Customer Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={modal.customerAddress}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerAddress: event.target.value,
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
        title="Delete Customer"
        modalId="deleteModal"
        formId="deleteForm"
        buttonText="Delete Customer"
        modalType="delete"
        formContent={
          <>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row">Customer ID</th>
                  <td>{modal.customerId}</td>
                </tr>
                <tr>
                  <th scope="row">Customer Name</th>
                  <td>{modal.customerName}</td>
                </tr>
                <tr>
                  <th scope="row">Customer Mobile</th>
                  <td>{modal.customerMobile}</td>
                </tr>
                <tr>
                  <th scope="row">Customer Address</th>
                  <td>{modal.customerAddress}</td>
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
              name="customerId"
              value={modal.customerId}
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
        title="Edit Customer"
        modalId="editModal"
        formId="editForm"
        buttonText="Edit Customer"
        modalType="edit"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="ecustomerName" className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                className="form-control"
                id="ecustomerName"
                name="customerName"
                value={modal.customerName}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerName: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emobile" className="form-label">
                Customer Mobile
              </label>
              <input
                type="text"
                className="form-control"
                id="emobile"
                name="mobile"
                value={modal.customerMobile}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerMobile: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="eaddress" className="form-label">
                Customer Address
              </label>
              <input
                type="text"
                className="form-control"
                id="eaddress"
                name="address"
                value={modal.customerAddress}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      customerAddress: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <input
              type="hidden"
              name="customerId"
              value={modal.customerId}
              readOnly={true}
            />
            <input type="hidden" name="formType" value="edit" readOnly={true} />
          </>
        }
      />
    </>
  );
}
