# Undangan Pernikahan Laras & Bagas

Website undangan pernikahan statis dengan desain responsif. Proyek ini dibuat menggunakan HTML, CSS, JavaScript, dan Bootstrap lokal.

## Cara Menjalankan

1. Buka folder proyek.
2. Klik dua kali file `index.html`, atau buka file tersebut dengan browser.
3. Untuk hasil terbaik, gunakan Live Server di VS Code agar fitur browser berjalan seperti website biasa.

Tidak memerlukan PHP, database, atau instalasi package.

## Fitur

- Sampul undangan dengan nama tamu dari URL
- Countdown menuju hari acara
- Profil mempelai dan galeri foto
- Detail akad nikah dan resepsi
- Amplop digital dengan tombol salin nomor rekening
- Form RSVP dan ucapan
- Filter data ucapan berdasarkan konfirmasi kehadiran
- Data RSVP tersimpan sementara di `localStorage` browser
- Backsound lokal dan tombol putar/jeda musik
- Tampilan responsif untuk desktop maupun ponsel

## Struktur Folder

```text
undangan/
├── index.html
├── README.md
└── assets/
    ├── llagu.mp3
    ├── css/
    │   └── style.css
    ├── images/
    │   ├── bagas.jpeg
    │   ├── cover.jpg
    │   ├── gallery-1.jpg
    │   ├── gallery-2.jpg
    │   ├── gallery-3.jpg
    │   ├── hero.jpg
    │   └── laras.jpeg
    ├── js/
    │   └── app.js
    └── vendor/
        ├── bootstrap/
        └── bootstrap-icons/
```

## Mengubah Data Undangan

| Data | Lokasi |
| --- | --- |
| Nama mempelai, orang tua, alamat, rekening, dan detail acara | `index.html` |
| Tanggal dan waktu countdown | konstanta `WEDDING_DATE` di `assets/js/app.js` |
| Data RSVP dummy | `initialGreetings` di `assets/js/app.js` |
| Warna, ukuran, dan tampilan | `assets/css/style.css` |
| Foto dan backsound | folder `assets/images/` dan file `assets/llagu.mp3` |

## Nama Tamu dari URL

Tambahkan parameter `to` pada URL:

```text
index.html?to=Keluarga%20Budi%20Santoso
```

Nama tersebut akan ditampilkan pada sampul dan terisi otomatis pada form RSVP.
