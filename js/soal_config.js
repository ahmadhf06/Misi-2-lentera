const urlParams = new URLSearchParams(window.location.search);
const ssoToken = urlParams.get('ssoToken') || "DEMO_TOKEN_123";
const API_EVENT_URL = "/api/game/event/";

// Helper: ambil gambar berwarna dari Twemoji berdasarkan kode emoji
const twemoji = (kode) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${kode}.svg`;

// ==========================================
// BANK SOAL LENTERA (LEVEL 1 - 4)
// ==========================================

const soalBank = {
  // LEVEL 1: Nilai Tempat & Penjumlahan Dasar
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

  // LEVEL 2: Pengurangan & Kontekstual
  2: [
    {
      teksSoal: "Siti memiliki <b>35 kelereng</b>. Dia memberikan <b>12 kelereng</b> kepada adiknya. Berapa sisa kelereng Siti?",
      label1: "Kelereng Awal",
      label2: "Diberikan",
      val1: 35,
      val2: 12,
      icon: "fa-circle",
      gambar: twemoji("1f535"),
      color: "text-emerald-500",
      hint: "Kurangi 35 kelereng awal dengan 12 kelereng yang diberikan.",
      kunciJawaban: 23
    },
    {
      teksSoal: "Di toko ada <b>48 pensil</b>. Sebanyak <b>15 pensil</b> telah terjual. Berapa pensil yang tersisa?",
      label1: "Pensil Toko",
      label2: "Terjual",
      val1: 48,
      val2: 15,
      icon: "fa-pencil",
      gambar: twemoji("270f"),
      color: "text-purple-500",
      hint: "Hitung sisa dengan mengurangi 48 pensil dengan 15 pensil terjual.",
      kunciJawaban: 33
    },
    {
      teksSoal: "Paman memetik <b>40 buah jeruk</b>. Ternyata ada <b>14 jeruk</b> yang busuk. Berapa jeruk yang masih bagus?",
      label1: "Total Jeruk",
      label2: "Jeruk Busuk",
      val1: 40,
      val2: 14,
      icon: "fa-lemon",
      gambar: twemoji("1f34a"),
      color: "text-yellow-500",
      hint: "Kurangkan 14 jeruk busuk dari 40 total jeruk.",
      kunciJawaban: 26
    },
    {
      // DIGANTI: Dari Balon Meletus menjadi Pita Pesta (fa-ribbon)
      teksSoal: "Mita memiliki <b>50 buah pita pesta</b>. Sebanyak <b>18 pita</b> digunakan untuk merangkai kado. Berapa sisa pita Mita yang belum dipakai?",
      label1: "Total Pita",
      label2: "Dipakai Kado",
      val1: 50,
      val2: 18,
      icon: "fa-ribbon",
      gambar: twemoji("1f380"),
      color: "text-rose-500",
      hint: "Sisa pita = 50 dikurangi 18.",
      kunciJawaban: 32
    },
    {
      teksSoal: "Eko membawa <b>45 keping biskuit</b>. Dia makan <b>17 biskuit</b> bersama temannya. Berapa sisa biskuit Eko?",
      label1: "Biskuit Eko",
      label2: "Dimakan",
      val1: 45,
      val2: 17,
      icon: "fa-cookie-bite",
      gambar: twemoji("1f36a"),
      color: "text-amber-600",
      hint: "Hitung 45 dikurangi 17.",
      kunciJawaban: 28
    }
  ],

  // LEVEL 3: Operasi Campuran Penjumlahan & Pengurangan
  3: [
    {
      teksSoal: "Dini punya <b>25 stiker</b>, membeli lagi <b>15 stiker</b>, lalu memberikan <b>10 stiker</b> ke adiknya. Berapa stiker Dini sekarang?",
      label1: "Total Setelah Beli",
      label2: "Diberikan",
      val1: 40,
      val2: 10,
      icon: "fa-note-sticky",
      gambar: twemoji("1f31f"),
      color: "text-indigo-500",
      hint: "Hitung (25 + 15) dulu = 40, lalu kurangi 10.",
      kunciJawaban: 30
    },
    {
      teksSoal: "Di bus ada <b>30 penumpang</b>. Di halte A naik <b>12 orang</b>, lalu turun <b>15 orang</b>. Berapa penumpang di bus sekarang?",
      label1: "Total Setelah Naik",
      label2: "Turun Bus",
      val1: 42,
      val2: 15,
      icon: "fa-bus",
      gambar: twemoji("1f68c"),
      color: "text-sky-500",
      hint: "Hitung (30 + 12) = 42, kemudian kurangi 15.",
      kunciJawaban: 27
    },
    {
      teksSoal: "Toko punya <b>35 botol minuman</b>, mendapat pasokan <b>20 botol</b>, lalu laku terjual <b>18 botol</b>. Berapa sisa botol minuman?",
      label1: "Total Setelah Pasokan",
      label2: "Terjual",
      val1: 55,
      val2: 18,
      icon: "fa-bottle-water",
      gambar: twemoji("1f964"),
      color: "text-cyan-500",
      hint: "Hitung (35 + 20) = 55, lalu kurangi 18.",
      kunciJawaban: 37
    },
    {
      teksSoal: "Budi mengumpulkan <b>28 daun</b>, menemukan lagi <b>22 daun</b>, namun <b>14 daun</b> hilang tertiup angin. Berapa sisa daun Budi?",
      label1: "Total Dikumpulkan",
      label2: "Daun Hilang",
      val1: 50,
      val2: 14,
      icon: "fa-leaf",
      gambar: twemoji("1f343"),
      color: "text-green-500",
      hint: "Hitung (28 + 22) = 50, lalu kurangkan dengan 14.",
      kunciJawaban: 36
    },
    {
      teksSoal: "Ibu menyiapkan <b>40 potong roti</b>. Ayah menambah <b>15 potong</b>, lalu dimakan anak-anak <b>21 potong</b>. Berapa sisa roti?",
      label1: "Total Roti",
      label2: "Dimakan",
      val1: 55,
      val2: 21,
      icon: "fa-bread-slice",
      gambar: twemoji("1f35e"),
      color: "text-amber-700",
      hint: "Hitung (40 + 15) = 55, lalu kurangi 21.",
      kunciJawaban: 34
    }
  ],

  // LEVEL 4: Hitung Cerita Kompleks & Analisis 2 Langkah
  4: [
    {
      teksSoal: "Ibu membeli <b>4 kotak donat</b>. Setiap kotak berisi <b>6 buah donat</b>. Jika <b>8 donat</b> diberikan kepada tetangga, berapa sisa donat Ibu sekarang?",
      label1: "Total Kotak & Isi",
      label2: "Donat Diberikan",
      val1: 24,
      val2: 8,
      icon: "fa-circle-dot",
      gambar: twemoji("1f369"),
      color: "text-pink-500",
      hint: "Hitung total seluruh donat dulu (4 kotak × 6 = 24), lalu kurangi 8 donat yang diberikan kepada tetangga.",
      kunciJawaban: 16
    },
    {
      teksSoal: "Dalam sebuah keranjang terdapat <b>45 buah salak</b>. Ibu memasukkan lagi <b>15 buah salak</b>. Seluruh salak kemudian dimasukkan sama rata ke dalam <b>5 kantong plastik</b>. Berapa jumlah salak di setiap kantong plastik?",
      label1: "Total Salak",
      label2: "Jumlah Kantong",
      val1: 60,
      val2: 5,
      icon: "fa-basket-shopping",
      gambar: twemoji("1f330"),
      color: "text-emerald-600",
      hint: "Jumlahkan dulu seluruh salak di keranjang (45 + 15 = 60), lalu bagi hasilnya dengan jumlah kantong plastik (60 ÷ 5).",
      kunciJawaban: 12
    },
    {
      teksSoal: "Pak Tani memanen <b>3 kantong apel</b>. Setiap kantong berisi <b>12 apel</b>. Sebanyak <b>11 apel</b> dibagikan kepada anak-anak. Berapa sisa apel Pak Tani?",
      label1: "Total Apel Panen",
      label2: "Dibagikan",
      val1: 36,
      val2: 11,
      icon: "fa-apple-whole",
      gambar: twemoji("1f34e"),
      color: "text-red-600",
      hint: "Hitung total apel panen (3 kantong × 12 = 36), lalu kurangi 11 apel yang dibagikan.",
      kunciJawaban: 25
    },
    {
      teksSoal: "Ahmad memiliki <b>5 bungkus permen</b>. Setiap bungkus berisi <b>8 permen</b>. Ahmad membeli lagi <b>15 permen</b> secara eceran. Berapa total permen Ahmad sekarang?",
      label1: "Permen Bungkus",
      label2: "Permen Eceran",
      val1: 40,
      val2: 15,
      icon: "fa-candy-cane",
      gambar: twemoji("1f36c"),
      color: "text-violet-500",
      hint: "Hitung dulu permen dari bungkus (5 × 8 = 40), lalu tambahkan dengan 15 permen eceran.",
      kunciJawaban: 55
    },
    {
      teksSoal: "Sebuah perpustakaan menerima <b>6 dus buku</b>. Setiap dus berisi <b>10 buku</b>. Jika <b>18 buku</b> disumbangkan ke panti asuhan, berapa sisa buku di perpustakaan?",
      label1: "Total Buku Dus",
      label2: "Disumbangkan",
      val1: 60,
      val2: 18,
      icon: "fa-book-open",
      gambar: twemoji("1f4da"),
      color: "text-indigo-600",
      hint: "Hitung dulu total buku dalam dus (6 × 10 = 60), lalu kurangi dengan 18 buku yang disumbangkan.",
      kunciJawaban: 42
    }
  ],

  // LEVEL 5: Cerita Kompleks 3 Langkah (kali, tambah/kurang, bagi) - jawaban bisa 3 digit
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
      teksSoal: "Pak Tani memanen <b>9 keranjang</b> mangga. Setiap keranjang berisi <b>16 mangga</b>. Ia membeli lagi <b>56 mangga</b> dari tetangga. Semua mangga dibagi sama rata ke <b>8 kotak</b>. Berapa mangga di setiap kotak?",
      label1: "Total Mangga",
      label2: "Jumlah Kotak",
      val1: 200,
      val2: 8,
      icon: "fa-apple-whole",
      gambar: twemoji("1f96d"),
      color: "text-orange-500",
      hint: "Langkah 1: 9 × 16 = 144. Langkah 2: 144 + 56 = 200. Langkah 3: 200 ÷ 8.",
      kunciJawaban: 25
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
      teksSoal: "Panitia menyiapkan <b>6 kotak</b> nasi. Setiap kotak berisi <b>24 bungkus</b>. Lalu datang tambahan <b>36 bungkus</b>. Semua nasi dibagikan sama rata ke <b>9 kelas</b>. Berapa bungkus nasi yang diterima tiap kelas?",
      label1: "Total Nasi",
      label2: "Jumlah Kelas",
      val1: 180,
      val2: 9,
      icon: "fa-box",
      gambar: twemoji("1f371"),
      color: "text-amber-600",
      hint: "Langkah 1: 6 × 24 = 144. Langkah 2: 144 + 36 = 180. Langkah 3: 180 ÷ 9.",
      kunciJawaban: 20
    },
    {
      teksSoal: "Sebuah toko buku punya <b>25 rak</b> berisi masing-masing <b>12 buku</b>. Sebanyak <b>87 buku</b> terjual, lalu <b>34 buku</b> dikembalikan pembeli. Berapa buku di toko sekarang?",
      label1: "Buku Setelah Terjual",
      label2: "Buku Dikembalikan",
      val1: 213,
      val2: 34,
      icon: "fa-book-open",
      gambar: twemoji("1f4d6"),
      color: "text-indigo-600",
      hint: "Langkah 1: 25 × 12 = 300. Langkah 2: 300 − 87 = 213. Langkah 3: 213 + 34.",
      kunciJawaban: 247
    }
  ]
};