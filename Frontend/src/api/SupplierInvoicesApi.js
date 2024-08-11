const API_URI = globalThis.api_uri_invoices;

export async function searchSupplierInvoices() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/api/v1/supplierinvoice`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function addSupplierInvoice(supplierInvoice) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(`${API_URI}/api/v1/supplierinvoice`, {
    method: "POST",
    headers: headers,
    body: supplierInvoice,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function deleteSupplierInvoice(supplierInvoiceId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(
    `${API_URI}/api/v1/supplierinvoice/` + supplierInvoiceId,
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
