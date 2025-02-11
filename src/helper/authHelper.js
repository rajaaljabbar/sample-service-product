const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔵 Konfigurasi untuk enkripsi AES
const algorithm = process.env.ENCRYPTION_ALGORITHM || "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Pastikan key ada di .env
const ivLength = 16; // IV harus 16 byte untuk AES

// 🔵 Fungsi Enkripsi AES
const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`; // Gabungkan IV dan data terenkripsi
};

// 🔵 Fungsi Dekripsi AES
const decrypt = (encryptedText) => {
  const parts = encryptedText.split(":");
  if (parts.length !== 2) {
    throw new Error("Format token terenkripsi salah");
  }

  const iv = Buffer.from(parts[0], "hex");
  const encryptedData = parts[1];

  if (iv.length !== ivLength) {
    throw new Error("IV tidak valid");
  }

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// 🔵 Fungsi Membuat JWT (Ditambah Enkripsi)
const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return encrypt(token); // Enkripsi JWT sebelum dikirim ke user
};

// 🔵 Fungsi Verifikasi JWT (Dekripsi Dulu)
const verifyJWT = (encryptedToken) => {
  const decryptedToken = decrypt(encryptedToken); // Dekripsi token sebelum verifikasi
  return jwt.verify(decryptedToken, process.env.JWT_SECRET);
};

// 🔵 Middleware Authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const encryptedToken = authHeader.split(" ")[1]; // Format: "Bearer <token>"
    const decoded = verifyJWT(encryptedToken);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// 🔵 Ekspos Fungsi
module.exports = {
  encrypt,
  decrypt,
  createJWT,
  verifyJWT,
  authenticateJWT,
};
