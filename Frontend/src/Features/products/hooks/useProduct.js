import { useDispatch } from "react-redux";

import {
  createProduct,
  getSellerProducts,
  getProductById,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getCategories,
  searchSimilarProducts,
} from "../services/product.api";

import {
  setSellerProduct,
  setAllProducts,
  setCurrentProduct,
  clearSearchProducts,
  setSearchProducts,
} from "../redux/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  // ======================
  // CREATE
  // ======================
  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);



    // 🔥 refresh seller products
    const updated = await getSellerProducts();
    dispatch(setSellerProduct(updated.products || []));

    return data.product;
  };

  // ======================
  // SELLER PRODUCTS
  // ======================
  const handleGetSellerProduct = async () => {
    const data = await getSellerProducts();
    console.log("Seller Products:", data.products);
    dispatch(setSellerProduct(data.products || []));
    return data.products || [];
  };

  // ======================
  // ALL PRODUCTS
  // ======================
  const handleGetAllProducts = async (
    category = "all"
  ) => {
    const data = await getAllProducts(category);

    dispatch(
      setAllProducts(data.products || [])
    );

    return data.products || [];
  };


  // ======================
  // SINGLE PRODUCT
  // ======================
  const handleGetProductById = async (id) => {
    const data = await getProductById(id);
    dispatch(setCurrentProduct(data.product));
    return data.product;
  };

  // ======================
  // DELETE
  // ======================
  const handleDeleteProduct = async (id) => {
    const data = await deleteProduct(id);

    // 🔥 remove from redux instantly
    const updated = await getSellerProducts();
    dispatch(setSellerProduct(updated.products || []));

    return data;
  };

  // ======================
  // UPDATE
  // ======================
  const handleUpdateProduct = async (id, formData) => {
    const data = await updateProduct(id, formData);

    // 🔥 refresh single + list
    const updated = await getSellerProducts();
    dispatch(setSellerProduct(updated.products || []));

    return data;
  };


  const handleGetCategories =
    async () => {
      const data =
        await getCategories();

      return data.categories || [];
    };



  const handleSearchSimilarProducts = async (query) => {
    const data = await searchSimilarProducts(query);

    console.log("SEARCH API DATA:", data);

    dispatch(setSearchProducts(data.products || []));

    return data.products || [];
  };

  
  const handleClearSearch = () => {
    dispatch(clearSearchProducts());
  };


  return {
    handleCreateProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleGetProductById,
    handleDeleteProduct,
    handleUpdateProduct,
    handleGetCategories,
    handleSearchSimilarProducts,
    handleClearSearch
  };
};