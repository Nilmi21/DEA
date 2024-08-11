const API_URI = globalThis.api_uri_invoices;

export async function searchCustomerInvoices() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/api/v1/customerinvoice`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function addCustomerInvoice(customerInvoice) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(`${API_URI}/api/v1/customerinvoice`, {
    method: "POST",
    headers: headers,
    body: customerInvoice,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function deleteCustomerInvoice(customerInvoiceId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(
    `${API_URI}/api/v1/customerinvoice/` + customerInvoiceId,
    {
      method: "DELETE",
      headers: headers,
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}
