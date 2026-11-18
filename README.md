# Birthday Website — Rara 🎂

Website ulang tahun interaktif untuk **Saskya Rara Sahasika** (Rara).

## 📁 Struktur File

```
HBD UY/
├── index.html          ← Halaman utama
├── style.css           ← Semua styling
├── main.js             ← Semua logika interaksi
├── config.js           ← ⭐ EDIT DI SINI (nama, pesan, nomor WA)
├── generate-preview.html ← Tool bantu buat gambar OG preview
├── package.json
└── vercel.json
```

## ✏️ Cara Kustomisasi

Buka **`config.js`** dan ganti:

| Field | Keterangan |
|-------|-----------|
| `senderName` | Nama kamu |
| `whatsappNumber` | Nomor WA kamu (format: `628...`) |
| `personalMessage` | Pesan personal dari kamu |
| `cards[]` | 5 kartu ucapan |
| `giftBoxes[]` | 3 kotak kado & isinya |
| `musicFile` | Nama file musik `.mp3` (taruh di folder yang sama) |

## 🎵 Musik

1. Cari lagu instrumental/royalty-free (mis. dari pixabay.com/music → search "birthday soft")
2. Download sebagai `.mp3`, rename jadi `birthday-music.mp3`
3. Taruh di folder `HBD UY/`https://www.tiktok.com/@keepsake.site/photo/7400712808163282181?is_from_webapp=1&sender_device=pc&web_id=7653128211753190932
4. Pastikan nama sesuai di `config.js → musicFile`

> File musik **tidak disertakan** karena copyright. Tanpa musik, tombol 🎵 tetap muncul tapi tidak ada suara.

## 🖼️ Preview Image (OG)

1. Buka `generate-preview.html` di browser
2. Klik **Download preview.png**
3. Taruh `preview.png` di folder `HBD UY/`

## 🚀 Deploy ke Vercel (Gratis, 2 Menit)

```bash
# Pastikan Vercel CLI ter-install
npm i -g vercel

# Dari folder HBD UY
vercel

# Ikuti prompt:
# - Set up and deploy? Y
# - Which scope? (pilih akun kamu)
# - Link to existing project? N
# - Project name: hbd-rara
# - In which directory is your code located? ./
# - Want to override the settings? N
```

Vercel akan memberi URL seperti `https://hbd-rara.vercel.app` — salin dan isi ke `config.js → siteUrl` lalu deploy ulang.

## 🌐 Deploy ke Netlify (Alternatif)

1. Buka [netlify.com](https://netlify.com) → Log in
2. Drag & drop seluruh folder **HBD UY** ke area deploy
3. Selesai! URL langsung tersedia.

## 📱 Deploy ke GitHub Pages

```bash
git init
git add .
git commit -m "birthday site for rara"
gh repo create hbd-rara --public --push --source=.
# Lalu: GitHub repo → Settings → Pages → Source: main branch / root
```

## 🖼️ Foto

Folder `photos/` berisi 5 foto yang sudah dioptimasi. Ganti file `rara-1.jpg` … `rara-5.jpg` kalau mau ganti foto — nama file harus sama.

## ✨ Fitur

- 🎁 Layar kejutan dengan animasi kado CSS
- 🎉 Hero dengan nama + typing reveal
- 🕯️ Tiup lilin via mikrofon (atau klik fallback)
- 🎊 Confetti besar saat semua lilin padam
- 💌 5 kartu ucapan swipe-able
- 💛 Pesan personal bergaya glassmorphism
- 🎁 3 kotak kado interaktif
- 🔗 Tombol share (Web Share API + fallback copy link)
- 💬 Tombol balas via WhatsApp
- 🥚 Easter egg: ketuk nama "Rara" 5× untuk confetti rahasia
- 🎵 Toggle musik (mulai saat user tap pertama)
- 📱 Mobile-first, optimal di 390×844

## 🐛 Troubleshooting

**Fonts tidak muncul offline:**
→ Normal — Google Fonts butuh internet. Online langsung tampil.

**Mic tidak berfungsi:**
→ Browser minta izin mic — klik "Izinkan". Jika ditolak, klik lilin langsung.

**Musik tidak berbunyi:**
→ Pastikan file `.mp3` ada di folder yang sama dan nama sesuai `config.js`.

**canvas-confetti error:**
→ Butuh koneksi internet (CDN). Offline? Download manual dan taruh lokal.
