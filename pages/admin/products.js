import React, { useState } from "react";
import ProductList from "components/products-list";
import { usePaginatedData } from "utils/useRequest";
import Admin from "layouts/Admin.js";

function ProductsPage() {
  const {
    result,
    error,
    isLoadingMore,
    size,
    setSize,
    isReachingEnd,
    isEmpty,
  } = usePaginatedData("/api/products");

  return result.length > 0 ? (
    <>
      <ProductList data={result} />
      <div>
        <button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "Loading..."
            : isReachingEnd
            ? "No More products"
            : "More Products"}
        </button>
      </div>
    </>
  ) : (
    <h1>No Products</h1>
  );
}

ProductsPage.layout = Admin;

export default ProductsPage;
