const express = require('express');
const axios = require('axios');
const router = express.Router();

const GITHUB_URL = 'https://raw.githubusercontent.com/RazanMuhammadIkhsan/database-1/main/anime/elaina.json';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(GITHUB_URL);
    const remImages = response.data;

    const randomIndex = Math.floor(Math.random() * remImages.length);
    const randomImage = remImages[randomIndex];

    res.status(200).json({
      status: true,
      creator: "@razanaja.cuy",
      url: randomImage 
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data gambar' });
  }
});

// --- Metadata untuk Dashboard ---
const category = "Anime";
const description = "Mendapatkan URL gambar Elaina secara acak.";

module.exports = {
    router,
    category,
    description
};