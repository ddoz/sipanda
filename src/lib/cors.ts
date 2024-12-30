// lib/init-middleware.js

import Cors from 'cors';

// Fungsi untuk inisialisasi middleware
function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// Atur opsi CORS
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT'], // Method yang diizinkan
    origin: 'http://localhost:51590', // Ganti sesuai dengan origin aplikasi Flutter
  })
);

export default cors;
