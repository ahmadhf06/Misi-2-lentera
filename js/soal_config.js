const urlParams = new URLSearchParams(window.location.search);
const ssoToken = urlParams.get('ssoToken') || "DEMO_TOKEN_123";
const API_EVENT_URL = "/api/game/event/";

// Helper: ambil gambar berwarna dari Twemoji berdasarkan kode emoji
const twemoji = (kode) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${kode}.svg`;

// ==========================================
// BANK SOAL LENTERA (LEVEL 1 - 5)
// ==========================================

const soalBank = {
  // LEVEL 1: Nilai Tempat & Penjumlahan Dasar (satuan, hasil 1-9)
  1: [
    {
      teksSoal: "Lumi membawa <b>4 apel</b>, lalu membeli lagi <b>3 apel</b>. Berapa total apel yang dimiliki Lumi?",
      label1: "Apel Lumi",
      label2: "Beli Lagi",
      val1: 4,
      val2: 3,
      icon: "fa-apple-whole",
      gambar: twemoji("1f34e"),
      color: "text-red-500",
      hint: "Hitung total apel dengan menjumlahkan 4 dan 3.",
      kunciJawaban: 7
    },
    {
      teksSoal: "Di perpustakaan ada <b>2 buku</b> cerita. Pak Guru menambah <b>6 buku</b> baru. Berapa jumlah buku seluruhnya?",
      label1: "Buku Awal",
      label2: "Buku Baru",
      val1: 2,
      val2: 6,
      icon: "fa-book",
      gambar: twemoji("1f4da"),
      color: "text-blue-500",
      hint: "Jumlahkan 2 buku awal dengan 6 buku baru.",
      kunciJawaban: 8
    },
    {
      teksSoal: "Ada <b>4 bintang</b> berwarna kuning dan <b>5 bintang</b> berwarna biru. Berapa total bintang semuanya?",
      label1: "Bintang Kuning",
      label2: "Bintang Biru",
      val1: 4,
      val2: 5,
      icon: "fa-star",
      gambar: twemoji("2b50"),
      color: "text-amber-400",
      hint: "Gabungkan 4 bintang kuning dan 5 bintang biru.",
      kunciJawaban: 9
    },
    {
      teksSoal: "Ibu memasak <b>2 kue mangkuk</b>. Ani memasak lagi <b>4 kue mangkuk</b>. Berapa total kue mangkuk sekarang?",
      label1: "Kue Ibu",
      label2: "Kue Ani",
      val1: 2,
      val2: 4,
      icon: "fa-cookie",
      gambar: twemoji("1f9c1"),
      color: "text-orange-500",
      hint: "Tambahkan 2 kue Ibu dengan 4 kue Ani.",
      kunciJawaban: 6
    },
    {
      teksSoal: "Di kolam terdapat <b>4 ikan mas</b> dan <b>4 ikan lele</b>. Berapa ekor total ikan di kolam?",
      label1: "Ikan Mas",
      label2: "Ikan Lele",
      val1: 4,
      val2: 4,
      icon: "fa-fish",
      gambar: twemoji("1f41f"),
      color: "text-teal-500",
      hint: "Jumlahkan 4 ikan mas dan 4 ikan lele.",
      kunciJawaban: 8
    }
  ],

  // LEVEL 2: Pengurangan & Kontekstual (hasil 10-25)
  2: [
    {
      teksSoal: "Siti memiliki <b>32 kelereng</b>. Dia memberikan <b>13 kelereng</b> kepada adiknya. Berapa sisa kelereng Siti?",
      label1: "Kelereng Awal",
      label2: "Diberikan",
      val1: 32,
      val2: 13,
      icon: "fa-circle",
      gambar: twemoji("1f535"),
      color: "text-emerald-500",
      hint: "Kurangi 32 kelereng awal dengan 13 kelereng yang diberikan.",
      kunciJawaban: 19
    },
    {
      teksSoal: "Di toko ada <b>40 pensil</b>. Sebanyak <b>15 pensil</b> telah terjual. Berapa pensil yang tersisa?",
      label1: "Pensil Toko",
      label2: "Terjual",
      val1: 40,
      val2: 15,
      icon: "fa-pencil",
      gambar: twemoji("270f"),
      color: "text-purple-500",
      hint: "Hitung sisa dengan mengurangi 40 pensil dengan 15 pensil terjual.",
      kunciJawaban: 25
    },
    {
      teksSoal: "Paman memetik <b>30 buah jeruk</b>. Ternyata ada <b>14 jeruk</b> yang busuk. Berapa jeruk yang masih bagus?",
      label1: "Total Jeruk",
      label2: "Jeruk Busuk",
      val1: 30,
      val2: 14,
      icon: "fa-lemon",
      gambar: twemoji("1f34a"),
      color: "text-yellow-500",
      hint: "Kurangkan 14 jeruk busuk dari 30 total jeruk.",
      kunciJawaban: 16
    },
    {
      // DIGANTI: Dari Balon Meletus menjadi Pita Pesta (fa-ribbon)
      teksSoal: "Mita memiliki <b>35 buah pita pesta</b>. Sebanyak <b>12 pita</b> digunakan untuk merangkai kado. Berapa sisa pita Mita yang belum dipakai?",
      label1: "Total Pita",
      label2: "Dipakai Kado",
      val1: 35,
      val2: 12,
      icon: "fa-ribbon",
      gambar: twemoji("1f380"),
      color: "text-rose-500",
      hint: "Sisa pita = 35 dikurangi 12.",
      kunciJawaban: 23
    },
    {
      teksSoal: "Eko membawa <b>29 keping biskuit</b>. Dia makan <b>17 biskuit</b> bersama temannya. Berapa sisa biskuit Eko?",
      label1: "Biskuit Eko",
      label2: "Dimakan",
      val1: 29,
      val2: 17,
      icon: "fa-cookie-bite",
      gambar: twemoji("1f36a"),
      color: "text-amber-600",
      hint: "Hitung 29 dikurangi 17.",
      kunciJawaban: 12
    }
  ],

  // LEVEL 3: Operasi Campuran Penjumlahan & Pengurangan (hasil 30-55)
  3: [
    {
      teksSoal: "Dini punya <b>30 stiker</b>, membeli lagi <b>25 stiker</b>, lalu memberikan <b>12 stiker</b> ke adiknya. Berapa stiker Dini sekarang?",
      label1: "Total Setelah Beli",
      label2: "Diberikan",
      val1: 55,
      val2: 12,
      icon: "fa-note-sticky",
      gambar: twemoji("1f31f"),
      color: "text-indigo-500",
      hint: "Hitung (30 + 25) dulu = 55, lalu kurangi 12.",
      kunciJawaban: 43
    },
    {
      teksSoal: "Di bus ada <b>35 penumpang</b>. Di halte A naik <b>28 orang</b>, lalu turun <b>18 orang</b>. Berapa penumpang di bus sekarang?",
      label1: "Total Setelah Naik",
      label2: "Turun Bus",
      val1: 63,
      val2: 18,
      icon: "fa-bus",
      gambar: twemoji("1f68c"),
      color: "text-sky-500",
      hint: "Hitung (35 + 28) = 63, kemudian kurangi 18.",
      kunciJawaban: 45
    },
    {
      teksSoal: "Toko punya <b>48 botol minuman</b>, mendapat pasokan <b>30 botol</b>, lalu laku terjual <b>23 botol</b>. Berapa sisa botol minuman?",
      label1: "Total Setelah Pasokan",
      label2: "Terjual",
      val1: 78,
      val2: 23,
      icon: "fa-bottle-water",
      gambar: twemoji("1f964"),
      color: "text-cyan-500",
      hint: "Hitung (48 + 30) = 78, lalu kurangi 23.",
      kunciJawaban: 55
    },
    {
      teksSoal: "Budi mengumpulkan <b>38 daun</b>, menemukan lagi <b>22 daun</b>, namun <b>14 daun</b> hilang tertiup angin. Berapa sisa daun Budi?",
      label1: "Total Dikumpulkan",
      label2: "Daun Hilang",
      val1: 60,
      val2: 14,
      icon: "fa-leaf",
      gambar: twemoji("1f343"),
      color: "text-green-500",
      hint: "Hitung (38 + 22) = 60, lalu kurangkan dengan 14.",
      kunciJawaban: 46
    },
    {
      teksSoal: "Ibu menyiapkan <b>45 potong roti</b>. Ayah menambah <b>18 potong</b>, lalu dimakan anak-anak <b>21 potong</b>. Berapa sisa roti?",
      label1: "Total Roti",
      label2: "Dimakan",
      val1: 63,
      val2: 21,
      icon: "fa-bread-slice",
      gambar: twemoji("1f35e"),
      color: "text-amber-700",
      hint: "Hitung (45 + 18) = 63, lalu kurangi 21.",
      kunciJawaban: 42
    }
  ],

  // LEVEL 4: Hitung Cerita Kompleks & Analisis 2 Langkah (hasil 60-85)
  4: [
    {
      teksSoal: "Ibu membeli <b>8 kotak donat</b>. Setiap kotak berisi <b>12 buah donat</b>. Jika <b>21 donat</b> diberikan kepada tetangga, berapa sisa donat Ibu sekarang?",
      label1: "Total Kotak & Isi",
      label2: "Donat Diberikan",
      val1: 96,
      val2: 21,
      icon: "fa-circle-dot",
      gambar: twemoji("1f369"),
      color: "text-pink-500",
      hint: "Hitung total seluruh donat dulu (8 kotak × 12 = 96), lalu kurangi 21 donat yang diberikan kepada tetangga.",
      kunciJawaban: 75
    },
    {
      teksSoal: "Dalam sebuah keranjang terdapat <b>96 buah salak</b>. Ibu memasukkan lagi <b>44 buah salak</b>. Seluruh salak kemudian dimasukkan sama rata ke dalam <b>2 kantong plastik</b>. Berapa jumlah salak di setiap kantong plastik?",
      label1: "Total Salak",
      label2: "Jumlah Kantong",
      val1: 140,
      val2: 2,
      icon: "fa-basket-shopping",
      gambar: twemoji("1f330"),
      color: "text-emerald-600",
      hint: "Jumlahkan dulu seluruh salak di keranjang (96 + 44 = 140), lalu bagi hasilnya dengan jumlah kantong plastik (140 ÷ 2).",
      kunciJawaban: 70
    },
    {
      teksSoal: "Pak Tani memanen <b>7 kantong apel</b>. Setiap kantong berisi <b>12 apel</b>. Sebanyak <b>19 apel</b> dibagikan kepada anak-anak. Berapa sisa apel Pak Tani?",
      label1: "Total Apel Panen",
      label2: "Dibagikan",
      val1: 84,
      val2: 19,
      icon: "fa-apple-whole",
      gambar: twemoji("1f34e"),
      color: "text-red-600",
      hint: "Hitung total apel panen (7 kantong × 12 = 84), lalu kurangi 19 apel yang dibagikan.",
      kunciJawaban: 65
    },
    {
      teksSoal: "Ahmad memiliki <b>9 bungkus permen</b>. Setiap bungkus berisi <b>8 permen</b>. Ahmad membeli lagi <b>11 permen</b> secara eceran. Berapa total permen Ahmad sekarang?",
      label1: "Permen Bungkus",
      label2: "Permen Eceran",
      val1: 72,
      val2: 11,
      icon: "fa-candy-cane",
      gambar: twemoji("1f36c"),
      color: "text-violet-500",
      hint: "Hitung dulu permen dari bungkus (9 × 8 = 72), lalu tambahkan dengan 11 permen eceran.",
      kunciJawaban: 83
    },
    {
      teksSoal: "Sebuah perpustakaan menerima <b>9 dus buku</b>. Setiap dus berisi <b>10 buku</b>. Jika <b>28 buku</b> disumbangkan ke panti asuhan, berapa sisa buku di perpustakaan?",
      label1: "Total Buku Dus",
      label2: "Disumbangkan",
      val1: 90,
      val2: 28,
      icon: "fa-book-open",
      gambar: twemoji("1f4da"),
      color: "text-indigo-600",
      hint: "Hitung dulu total buku dalam dus (9 × 10 = 90), lalu kurangi dengan 28 buku yang disumbangkan.",
      kunciJawaban: 62
    }
  ],

  // LEVEL 5: Cerita Kompleks 3 Langkah (kali, tambah/kurang, bagi) - ratusan (hasil 100-155)
  5: [
    {
      teksSoal: "Perpustakaan sekolah punya <b>7 rak</b>. Setiap rak berisi <b>15 buku</b>. Minggu ini sekolah menerima sumbangan <b>48 buku</b> baru. Berapa total buku di perpustakaan sekarang?",
      label1: "Buku di Rak",
      label2: "Buku Sumbangan",
      val1: 105,
      val2: 48,
      icon: "fa-book",
      gambar: twemoji("1f4da"),
      color: "text-blue-600",
      hint: "Hitung buku di rak dulu (7 × 15 = 105), lalu tambahkan 48 buku sumbangan.",
      kunciJawaban: 153
    },
    {
      teksSoal: "Pak Tani memanen <b>12 keranjang</b> mangga. Setiap keranjang berisi <b>15 mangga</b>. Ia membeli lagi <b>60 mangga</b> dari tetangga. Semua mangga dibagi sama rata ke <b>2 kotak</b>. Berapa mangga di setiap kotak?",
      label1: "Total Mangga",
      label2: "Jumlah Kotak",
      val1: 240,
      val2: 2,
      icon: "fa-apple-whole",
      gambar: twemoji("1f96d"),
      color: "text-orange-500",
      hint: "Langkah 1: 12 × 15 = 180. Langkah 2: 180 + 60 = 240. Langkah 3: 240 ÷ 2.",
      kunciJawaban: 120
    },
    {
      teksSoal: "Dina punya <b>250 manik-manik</b>. Ia membuat <b>8 gelang</b>, dan setiap gelang memakai <b>15 manik-manik</b>. Berapa sisa manik-manik Dina?",
      label1: "Manik Awal",
      label2: "Manik Terpakai",
      val1: 250,
      val2: 120,
      icon: "fa-circle",
      gambar: twemoji("1f4ff"),
      color: "text-pink-500",
      hint: "Hitung manik yang terpakai dulu (8 × 15 = 120), lalu kurangkan dari 250.",
      kunciJawaban: 130
    },
    {
      teksSoal: "Panitia menyiapkan <b>12 kotak</b> nasi. Setiap kotak berisi <b>24 bungkus</b>. Lalu datang tambahan <b>36 bungkus</b>. Semua nasi dibagikan sama rata ke <b>3 kelas</b>. Berapa bungkus nasi yang diterima tiap kelas?",
      label1: "Total Nasi",
      label2: "Jumlah Kelas",
      val1: 324,
      val2: 3,
      icon: "fa-box",
      gambar: twemoji("1f371"),
      color: "text-amber-600",
      hint: "Langkah 1: 12 × 24 = 288. Langkah 2: 288 + 36 = 324. Langkah 3: 324 ÷ 3.",
      kunciJawaban: 108
    },
    {
      teksSoal: "Sebuah toko buku punya <b>15 rak</b> berisi masing-masing <b>12 buku</b>. Sebanyak <b>87 buku</b> terjual, lalu <b>34 buku</b> dikembalikan pembeli. Berapa buku di toko sekarang?",
      label1: "Buku Setelah Terjual",
      label2: "Buku Dikembalikan",
      val1: 93,
      val2: 34,
      icon: "fa-book-open",
      gambar: twemoji("1f4d6"),
      color: "text-indigo-600",
      hint: "Langkah 1: 15 × 12 = 180. Langkah 2: 180 − 87 = 93. Langkah 3: 93 + 34.",
      kunciJawaban: 127
    }
  ]
};