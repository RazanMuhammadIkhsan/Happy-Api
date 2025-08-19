const express = require('express');
const axios = require('axios');
const router = express.Router();

const SUSUNKATA_URL = 'https://raw.githubusercontent.com/RazanMuhammadIkhsan/database-1/main/games/susunkata.json';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(SUSUNKATA_URL);
    const gameData = response.data;
    const randomIndex = Math.floor(Math.random() * gameData.length);
    const randomQuestion = gameData[randomIndex];

    res.status(200).json({
      status: true,
      creator: "@razanaja.cuy",
      data: randomQuestion
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data game dari server.'
    });
  }
});

// --- Metadata untuk Dashboard ---
const category = "Game";
const description = "Mendapatkan soal acak untuk game susun kata.";

module.exports = {
    router,
    category,
    description
};