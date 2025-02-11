const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "postgres",
  password: process.env.PG_PASSWORD || "password",
  port: process.env.PG_PORT || 5432,
});

// 🟢 Insert Product
const insertProduct = async ({ product_name, stock, price, expired_date }) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO products (product_name, stock, price, expired_date) 
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [product_name, stock, price, expired_date]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

// 🔵 Get All Products
const getAllProducts = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM products;");
    return result.rows;
  } finally {
    client.release();
  }
};

// 🔵 Get Product by ID (Perbaiki penggunaan `product_id`)
const getProductById = async (product_id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM products WHERE product_id = $1;",
      [product_id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

// 🟢 Update Product (Perbaiki penggunaan `product_id`)
const updateProduct = async ({
  product_id,
  product_name,
  stock,
  price,
  expired_date,
}) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE products SET product_name = $2, stock = $3, price = $4, expired_date = $5 
       WHERE product_id = $1 RETURNING *;`,
      [product_id, product_name, stock, price, expired_date]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

// 🟢 Delete Product
const deleteProduct = async (product_id) => {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM products WHERE product_id = $1;", [
      product_id,
    ]);
    return { message: "Product deleted successfully" };
  } finally {
    client.release();
  }
};

module.exports = {
  insertProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
