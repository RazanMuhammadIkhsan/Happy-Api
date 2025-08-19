const express = require('express');
const axios = require('axios');
const router = express.Router();

const GITHUB_KHODAM_URL = 'https://raw.githubusercontent.com/RazanMuhammadIkhsan/database-1/main/fun/cekkhodam.json';

router.get('/', async (req, res) => {
  try {
    const nama = req.query.nama;

    if (!nama) {
      return res.status(400).json({
        error: 'Parameter "nama" tidak boleh kosong!',
        example: '/api/fun/khodam?nama=Budi'
      });
    }
    
    const response = await axios.get(GITHUB_KHODAM_URL);
    const khodamList = response.data;
    const randomIndex = Math.floor(Math.random() * khodamList.length);
    const randomKhodam = khodamList[randomIndex];

    res.status(200).json({
      status: true,
      creator: '@razanaja.cuy',
      data: {
        nama: nama,
        khodam: randomKhodam.name,
        artinya: randomKhodam.meaning
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data khodam dari Server.' });
  }
});

// --- Metadata untuk Dashboard ---
const category = "Fun";
const description = "Cek khodam random berdasarkan nama yang diinputkan.";

module.exports = {
    router,
    category,
    description
};