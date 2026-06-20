import API from "../../auth/services/api";

// CREATE PRODUCT
export const createProduct = async (formData) => {
  const { data } = await API.post(
    "/product/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// GET SELLER PRODUCTS
export const getSellerProducts = async () => {
  const { data } = await API.get("/product/seller");
  return data;
};

// GET PRODUCT BY ID
export const getProductById = async (id) => {
  const { data } = await API.get(`/product/${id}`);
  return data;
};

// ✅ CATEGORY SUPPORT ADDED
export const getAllProducts = async (
  category = "all"
) => {
  const { data } = await API.get(
    `/product?category=${category}`
  );

  return data;
};



// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/product/${id}`);
  return data;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id,
  formData
) => {
  const { data } = await API.put(
    `/product/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};



export const getCategories = async () => {
  const { data } = await API.get(
    "/product/categories"
  );

  return data;
};




// SEARCH SIMILAR PRODUCTS
export const searchSimilarProducts = async (query) => {
  const { data } = await API.get(
    `/product/search/similar?q=${encodeURIComponent(query)}`
  );

  return data;
};