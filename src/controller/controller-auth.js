const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("../helper/authHelper");
require("dotenv").config();

//  Dummy User
const users = [
  {
    id: 1,
    username: "admin",
    password: "password123", // Harusnya disimpan dalam bentuk hash
  },
];

// 🟢 Login Endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 🔎 Cari user berdasarkan username dan password
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔑 Buat Token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // 🔒 Enkripsi token sebelum dikirim
  const encryptedToken = encrypt(token);

  res.json({ token: encryptedToken });
});

// 🔵 Cek Token (Testing)
router.get("/me", (req, res) => {
  try {
    const encryptedToken = req.headers.authorization?.split(" ")[1]; // Ambil token dari Header
    if (!encryptedToken)
      return res.status(401).json({ message: "Token required" });

    const decryptedToken = decrypt(encryptedToken); // Dekripsi token
    const userData = jwt.verify(decryptedToken, process.env.JWT_SECRET);

    res.json({ user: userData });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
