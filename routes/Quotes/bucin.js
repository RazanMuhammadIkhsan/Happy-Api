const express = require('express');
const axios = require('axios');
const router = express.Router();

const GITHUB_URL = 'https://raw.githubusercontent.com/RazanMuhammadIkhsan/database-1/main/quotes/bucin.json';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(GITHUB_URL);
    const apaaja = response.data;

    const randomIndex = Math.floor(Math.random() * apaaja.length);
    const randomq = apaaja[randomIndex];

    res.status(200).json({
      status: true,
      creator: "@razanaja.cuy",
      url: randomq
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data Quotes' });
  }
});

// --- Metadata untuk Dashboard ---
const category = "Quotes";
const description = "Mendapatkan Quotes Bucin.";

module.exports = {
    router,
    category,
    description
};