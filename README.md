# Happy API 🎉

Sebuah REST API sederhana yang dibuat dengan **Node.js** dan **Express**, menyajikan berbagai endpoint menyenangkan secara dinamis melalui dashboard interaktif.



---

## ✨ Fitur Utama

- **Dashboard Interaktif**: Halaman utama yang menampilkan semua API yang tersedia secara real-time.
- **Pemuatan Rute Otomatis**: Fitur baru otomatis terdaftar hanya dengan menambahkan file di folder `routes`.
- **Mudah Diperluas**: Tambahkan kategori dan fitur baru tanpa mengubah kode inti.

---

## 🚀 Cara Menjalankan

1.  **Clone repository ini**
    ```bash
    git clone https://github.com/RazanMuhammadIkhsan/Happy-Api.git
    ```

2.  **Masuk ke direktori proyek**
    ```bash
    cd Happy-Api
    ```

3.  **Install semua dependency**
    ```bash
    npm install
    ```

4.  **Jalankan server development**
    ```bash
    npm start
    ```

5.  **Buka browser** dan akses `http://localhost:3000`.

---

## ⚙️ Contoh Endpoint

Berikut beberapa contoh API yang tersedia:

-   `GET /api/anime/rem` - Mendapatkan gambar Rem acak.
-   `GET /api/fun/khodam?nama=Budi` - Mengecek khodam acak.
-   `GET /api/game/susunkata` - Mendapatkan soal susun kata.

> Untuk daftar lengkap dan mencoba langsung, silakan kunjungi dashboard yang berjalan.

---

## 💡 Menambah Fitur Baru

Cukup buat file `.js` baru di dalam folder kategori yang sesuai (`/routes/Anime`, `/routes/Fun`, atau `/routes/Game`). Server akan memuatnya secara otomatis setelah di-restart.
