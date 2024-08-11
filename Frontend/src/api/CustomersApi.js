const API_URI = globalThis.api_uri_customers;

export async function searchCustomers() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/customers`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function addCustomer(customerName, mobileNumber, address) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("customerName", customerName);
  formData.append("mobileNumber", mobileNumber);
  formData.append("address", address);
  const response = await fetch(`${API_URI}/customer/create`, {
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

export async function editCustomer(
  customerName,
  mobileNumber,
  address,
  customerId
) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("customerName", customerName);
  formData.append("mobileNumber", mobileNumber);
  formData.append("address", address);
  formData.append("customerId", customerId);
  const response = await fetch(`${API_URI}/customer/update`, {
    method: "PUT",
    headers: headers,
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function deleteCustomer(customerId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("customerId", customerId);
  const response = await fetch(`${API_URI}/customer/delete`, {
    method: "DELETE",
    headers: headers,
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}
