const API_URI = globalThis.api_uri;

export async function searchUsers() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/users/listusers`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function getUserList() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/users/listusersfordatareference`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function addUser(username, role, password) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("roleId", role);
  const response = await fetch(`${API_URI}/users/adduser`, {
    method: "POST",
    headers: headers,
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function editUser(username, role, userId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("username", username);
  formData.append("roleId", role);
  formData.append("userId", userId);
  const response = await fetch(`${API_URI}/users/edituser`, {
    method: "POST",
    headers: headers,
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function deleteUser(userId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("userId", userId);
  const response = await fetch(`${API_URI}/users/deleteuser`, {
    method: "POST",
    headers: headers,
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}
