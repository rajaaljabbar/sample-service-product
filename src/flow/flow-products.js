const RepositoryProducts = require("../repository/repository-product");

const createProduct = async (productData) => {
  return RepositoryProducts.insertProduct(productData);
};

const getProductById = async (productId) => {
  return RepositoryProducts.getProductById(productId);
};

const getAllProducts = async () => {
  return RepositoryProducts.getAllProducts();
};

const updateProduct = async (productData) => {
  return RepositoryProducts.updateProduct(productData);
};

const deleteProduct = async (productId) => {
  return RepositoryProducts.deleteProduct(productId);
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
