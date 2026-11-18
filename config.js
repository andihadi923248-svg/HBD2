// ============================================================
//  CONFIG.JS — Edit semua teks & data di sini
//  Tidak perlu sentuh file lain untuk kustomisasi dasar
// ============================================================

const CONFIG = {
  // --- Identitas ---
  recipientName: "Saskya Rara Sahasika",
  recipientNickname: "Rara",
  senderName: "[HADI P✌️]",          // ← Ganti dengan namamu

  // --- Nomor WhatsApp (tanpa + dan spasi, awali dengan kode negara) ---
  whatsappNumber: "6285200000206",    // ← Ganti dengan nomormu

  // --- Pesan Personal (Section 5) ---
  personalMessage:
    "Aku sadar ini agak aneh — kita udah lama saling tahu, tapi baru sekarang bisa ngobrol. " +
    "Aku nggak mau kelewat batas. Cuma pengen bilang: selamat ulang tahun, Rara. " +
    "Semoga tahun ini lebih ringan, lebih baik, dan kamu selalu dikelilingi orang yang beneran baik. " +
    "Sehat terus ya.",

  // --- Kartu Ucapan (Section 4) ---
  cards: [
    {
      emoji: "🌙",
      text: "Semoga tahun ini terasa lebih tenang. Nggak harus sempurna — cukup lebih baik dari kemarin.",
    },
    {
      emoji: "🌿",
      text: "Semoga kamu selalu punya ruang buat istirahat, tanpa harus jelasin kenapa.",
    },
    {
      emoji: "✨",
      text: "Semoga hal yang kamu kerjain pelan-pelan itu suatu saat kelihatan hasilnya.",
    },
    {
      emoji: "🍀",
      text: "Semoga rejekinya lancar, dan hari-hari beratnya nggak numpuk bareng.",
    },
    {
      emoji: "🕯️",
      text: "Selamat ulang tahun. Semoga doa-doa kecilmu didenger, walau diam-diam.",
    },
  ],

  // --- Doa / Ramalan Acak (Section 6 — Kartu Harapan) ---
  wishes: [
    "🌈 Tahun ini bakal ada satu momen yang bikin kamu bilang 'oh, ini toh maksudnya'.",
    "☕ Besok pagi kopinya enak, harinya oke, dan semuanya berjalan lebih ringan.",
    "🌸 Orang yang kamu butuhin bakal ada di saat yang tepat — nggak terlambat.",
    "🎵 Ada satu lagu yang bakal jadi soundtrack momen terbaik kamu tahun ini.",
    "🦋 Kamu udah berkembang lebih dari yang kamu sadarin sendiri.",
    "🌙 Tidurmu malam ini nyenyak banget. Besok segar, siap gas.",
    "🍀 Ada keberuntungan kecil yang sering mampir — kamu cuma perlu lebih notice.",
    "💪 Nggak semua orang bisa setenang kamu ngadapin hal-hal susah. Itu kelebihan.",
    "🎁 Ada sesuatu yang lagi dalam perjalanan buat kamu. Sabar dikit lagi.",
    "🌻 Kebaikan yang kamu lakuin — walau kecil — udah kerasa sama orang-orang sekitarmu.",
  ],

  // --- Kado Interaktif (alternatif Section 6) ---
  giftBoxes: [
    {
      emoji: "😮‍💨",
      title: "Napas Lega",
      text: "Semoga yang lagi numpuk di pikiran pelan-pelan longgar. Kamu boleh istirahat.",
    },
    {
      emoji: "🌤️",
      title: "Hari yang Lebih Ringan",
      text: "Semoga ada hari-hari yang terasa gampang — tanpa drama, tanpa beban aneh.",
    },
    {
      emoji: "🤍",
      title: "Doa Diam-diam",
      text: "Semoga yang kamu harapin diam-diam, datang di waktu yang pas.",
    },
  ],

  // --- Easter Egg (ketuk nama 5x) ---
  easterEggMessage: "Lah, nemu ini dari mana 😭 Bonus kecil: semoga kekhawatiran random kamu tahun ini ternyata nggak kejadian. Selamat ulang tahun, Rara.",

  // --- Music ---
  // Taruh file musik di folder yang sama, lalu ganti nama di bawah
  // Format yang direkomendasikan: .mp3, ukuran kecil (~1-2 MB)
  musicFile: "birthday-music.mp3",    // ← Ganti / hapus jika tidak ada musik

  // --- Meta / SEO ---
  ogTitle: "Untuk Rara 🎂",
  ogDescription: "Ucapan kecil buat kamu hari ini — semoga harinya menyenangkan.",
  ogImage: "preview.png",             // ← Opsional: ganti dengan gambar preview cantikmu
  siteUrl: "https://your-site.vercel.app", // ← Ganti setelah deploy
  musicFile:"Birthday_music.mp3",
};


// Expose globally (works with or without modules)
window.CONFIG = CONFIG;

