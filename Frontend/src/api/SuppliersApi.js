const API_URI = globalThis.api_uri_suppliers;

export async function searchSuppliers() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/suppliers/listsuppliers`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function searchSuppliersList() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(
    `${API_URI}/suppliers/listsuppliersforreference`,
    {
      headers: headers,
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function addSupplier(
  supplierName,
  supplierMobile,
  supplierAddress
) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("supplierName", supplierName);
  formData.append("supplierMobile", supplierMobile);
  formData.append("supplierAddress", supplierAddress);
  const response = await fetch(`${API_URI}/suppliers/addsupplier`, {
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

export async function editSupplier(
  supplierName,
  supplierMobile,
  supplierAddress,
  supplierId
) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("supplierName", supplierName);
  formData.append("supplierMobile", supplierMobile);
  formData.append("supplierAddress", supplierAddress);
  formData.append("supplierId", supplierId);
  const response = await fetch(`${API_URI}/suppliers/editsupplier`, {
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

export async function deleteSupplier(supplierId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const formData = new FormData();
  formData.append("supplierId", supplierId);
  const response = await fetch(`${API_URI}/suppliers/deletesupplier`, {
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
