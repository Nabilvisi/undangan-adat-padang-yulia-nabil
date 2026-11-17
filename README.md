# Undangan Digital Adat Padang — Yulia Alfianeri & Nabil Visi Samawi

Aplikasi undangan pernikahan digital bertema **Adat Minangkabau (*Baralek Gadang*)** yang dilengkapi **Live Studio Editor** (terinspirasi dari `nganten.id`) dan siap di-deploy ke **Vercel**.

## Fitur Utama

- **4 Versi Warna Adat Minangkabau**:
  1. **Sirah Baralek Gadang** (Klasik Marun Songket, Kertas Gading & Emas Foil)
  2. **Koto Gadang Royal** (Zamrud Hitam, Emas Champagne & Gading)
  3. **Pesisir Gading** (Versi Terang Editorial Krem Songket, Marun & Emas)
  4. **Marawa Pusako** (Hitam Beludru, Sirah & Emas Murni)
- **Ornamen Vektor Kustom Minang**: Atap *Rumah Gadang Bagonjong*, *Payuang Kuniang*, *Pucuak Rabuang*, *Kaluak Paku*, *Suntiang Gadang*, *Carano*, serta pola *Songket Pandai Sikek*.
- **Live Studio Editor (`/studio`)**: Edit nama mempelai, gelar adat (*Gala*), tanggal & lokasi acara, upload foto, galeri, amplop digital, musik latar, hingga generator link tamu WhatsApp secara *real-time*.
- **Personalisasi Tamu**: Mendukung parameter URL `?to=Nama+Tamu` (dan `&guest=1` untuk tampilan bersih khusus tamu).

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

- Undangan: `http://localhost:3000`
- Studio Editor: `http://localhost:3000/studio`

## Cara Live ke Vercel

1. Edit data, foto, tanggal, dan lokasi melalui `http://localhost:3000/studio`, lalu klik **Simpan Perubahan**.
2. Jalankan perintah berikut untuk deploy ke Vercel:

```bash
npx vercel --prod
```

Atau hubungkan repositori ini ke dashboard **Vercel** untuk auto-deploy.
