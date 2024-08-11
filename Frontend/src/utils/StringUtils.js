export function stringifyProducts(products, productsRef) {
  const productNameArr = products.map((product) => {
    return productsRef.filter((pRef) => pRef.id === product.productId)[0]
      ?.description;
  });
  return productNameArr.join(", ");
}

export function roundToTwoDecimals(number) {
  return (Math.floor(number * 100) / 100).toFixed(2);
}
