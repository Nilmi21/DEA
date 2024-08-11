const API_URI = globalThis.api_uri_products;

export async function searchProducts() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/products/listproducts`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function getProductlist() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  const response = await fetch(`${API_URI}/products/listproductsforreference`, {
    headers: headers,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function addProduct(
  productDescription,
  quantityAvailable,
  reorderQuantity,
  supplierId
) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(`${API_URI}/products/addproduct`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      productDescription: productDescription,
      quantityAvailable: Number(quantityAvailable),
      reorderQuantity: Number(reorderQuantity),
      supplierId: Number(supplierId),
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function editProduct(
  productDescription,
  quantityAvailable,
  reorderQuantity,
  supplierId,
  productId
) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(`${API_URI}/products/editproduct`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      productId: Number(productId),
      productDescription: productDescription,
      quantityAvailable: Number(quantityAvailable),
      reorderQuantity: Number(reorderQuantity),
      supplierId: Number(supplierId),
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export async function deleteProduct(productId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(`${API_URI}/products/deleteproduct`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      productId: Number(productId),
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}
