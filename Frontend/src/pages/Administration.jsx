import Navbar from "../assets/components/Navbar";
import FormModal from "../assets/components/FormModal";
import { requireAuth } from "../api/AuthenticationApi";
import { redirect, useActionData, useLoaderData } from "react-router-dom";
import { addUser, deleteUser, searchUsers, editUser } from "../api/UserApi";
import { useEffect, useState } from "react";

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (!loggedIn) {
    throw redirect("login");
  }
  const userDataApi = await searchUsers();
  return { ...userDataApi };
}

export async function action({ request }) {
  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "add") {
    const username = formData.get("username");
    const role = formData.get("role");
    const password = formData.get("password");
    let response = await addUser(username, role, password);
    if (response !== null) {
      response = {
        ...response,
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "edit") {
    const username = formData.get("username");
    const role = formData.get("role");
    const userId = formData.get("userId");
    let response = await editUser(username, role, userId);
    if (response !== null) {
      response = {
        ...response,
        formType: formType,
      };
      return response;
    }
    return null;
  } else if (formType === "delete") {
    const userId = formData.get("userId");
    let response = await deleteUser(userId);
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

export default function Administration() {
  const { roles, users } = useLoaderData();
  const [modal, setModal] = useState({
    userId: "",
    username: "",
    password: "",
    roleId: "",
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
        }, 500);
      }
      if (response.formType === "edit" && response.message.success) {
        document.getElementById("editModalClose").click();
        setTimeout(function () {
          clearModalData();
        }, 500);
      }
    }
  }, [response]);
  const dataGrid = users.map((user) => {
    return (
      <tr key={user.userId}>
        <td>{user.userId}</td>
        <td>{user.username}</td>
        <td>
          {roles.filter((role) => role.id === user.roleId)[0].description}
        </td>
        <td className="text-end">
          <button
            type="button"
            className="btn btn-secondary fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
            onClick={() => {
              loadModalData(user.userId);
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
              loadModalData(user.userId);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  const rolesOptions = roles.map((role) => {
    return (
      <option key={role.id} value={role.id}>
        {role.description}
      </option>
    );
  });

  function clearModalData() {
    setModal(() => {
      return {
        userId: "",
        username: "",
        password: "",
        roleId: "",
      };
    });
  }
  function loadModalData(userId) {
    const user = users.filter((user) => user.userId === userId)[0];
    setModal(() => {
      return {
        userId: user.userId,
        username: user.username,
        password: "",
        roleId: user.roleId,
      };
    });
  }
  return (
    <>
      <Navbar selected="administration" />
      <div className="content">
        <h1 className="content-heading">Administration</h1>
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
              Add User
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">User ID</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col" className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{dataGrid}</tbody>
        </table>
      </div>
      <FormModal
        title="Add User"
        modalId="addModal"
        formId="addForm"
        buttonText="Add User"
        modalType="add"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={modal.username}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      username: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={modal.roleId}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      roleId: event.target.value,
                    };
                  });
                }}
              >
                <option value="" disabled></option>
                {rolesOptions}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={modal.password}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      password: event.target.value,
                    };
                  });
                }}
              />
              <input
                type="hidden"
                name="formType"
                value="add"
                readOnly={true}
              />
            </div>
          </>
        }
      />
      <FormModal
        title="Delete User"
        modalId="deleteModal"
        formId="deleteForm"
        buttonText="Delete User"
        modalType="delete"
        formContent={
          <>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row">User ID</th>
                  <td>{modal.userId}</td>
                </tr>
                <tr>
                  <th scope="row">Username</th>
                  <td>{modal.username}</td>
                </tr>
                <tr>
                  <th scope="row">Role</th>
                  <td>
                    {
                      roles.filter((role) => role.id === modal.roleId)[0]
                        ?.description
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <input
              type="hidden"
              name="userId"
              value={modal.userId}
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
        title="Edit User"
        modalId="editModal"
        formId="editForm"
        buttonText="Edit User"
        modalType="edit"
        formContent={
          <>
            <div className="mb-3">
              <label htmlFor="eusername" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="eusername"
                name="username"
                value={modal.username}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      username: event.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="erole" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                id="erole"
                name="role"
                value={modal.roleId}
                onChange={(event) => {
                  setModal((prev) => {
                    return {
                      ...prev,
                      roleId: event.target.value,
                    };
                  });
                }}
              >
                <option value="" disabled></option>
                {rolesOptions}
              </select>
            </div>
            <input
              type="hidden"
              name="userId"
              value={modal.userId}
              readOnly={true}
            />
            <input type="hidden" name="formType" value="edit" readOnly={true} />
          </>
        }
      />
    </>
  );
}
