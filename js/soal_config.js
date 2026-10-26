const urlParams = new URLSearchParams(window.location.search);
const ssoToken = urlParams.get('ssoToken') || "DEMO_TOKEN_123";
const API_EVENT_URL = "/api/game/event/";

// ==========================================
// BANK SOAL LENTERA (LEVEL 1 - 4)
// ==========================================

const soalBank = {
  // LEVEL 1: Nilai Tempat & Penjumlahan Dasar
  1: [
    {
      teksSoal: "Lumi membawa <b>12 apel</b>, lalu membeli lagi <b>15 apel</b>. Berapa total apel yang dimiliki Lumi?",
      label1: "Apel Lumi",
      label2: "Beli Lagi",
      val1: 12,
      val2: 15,
      icon: "fa-apple-whole",
      color: "text-red-500",
      hint: "Hitung total apel dengan menjumlahkan 12 dan 15.",
      kunciJawaban: 27
    },
    {
      teksSoal: "Di perpustakaan ada <b>20 buku</b> cerita. Pak Guru menambah <b>14 buku</b> baru. Berapa jumlah buku seluruhnya?",
      label1: "Buku Awal",
      label2: "Buku Baru",
      val1: 20,
      val2: 14,
      icon: "fa-book",
      color: "text-blue-500",
      hint: "Jumlahkan 20 buku awal dengan 14 buku baru.",
      kunciJawaban: 34
    },
    {
      teksSoal: "Ada <b>15 bintang</b> berwarna kuning dan <b>18 bintang</b> berwarna biru. Berapa total bintang semuanya?",
      label1: "Bintang Kuning",
      label2: "Bintang Biru",
      val1: 15,
      val2: 18,
      icon: "fa-star",
      color: "text-amber-400",
      hint: "Gabungkan 15 bintang kuning dan 18 bintang biru.",
      kunciJawaban: 33
    },
    {
      teksSoal: "Ibu memasak <b>22 kue mangkuk</b>. Ani memasak lagi <b>13 kue mangkuk</b>. Berapa total kue mangkuk sekarang?",
      label1: "Kue Ibu",
      label2: "Kue Ani",
      val1: 22,
      val2: 13,
      icon: "fa-cookie",
      color: "text-orange-500",
      hint: "Tambahkan 22 kue Ibu dengan 13 kue Ani.",
      kunciJawaban: 35
    },
    {
      teksSoal: "Di kolam terdapat <b>16 ikan mas</b> dan <b>19 ikan lele</b>. Berapa ekor total ikan di kolam?",
      label1: "Ikan Mas",
      label2: "Ikan Lele",
      val1: 16,
      val2: 19,
      icon: "fa-fish",
      color: "text-teal-500",
      hint: "Jumlahkan 16 ikan mas dan 19 ikan lele.",
      kunciJawaban: 35
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
      color: "text-yellow-500",
      hint: "Kurangkan 14 jeruk busuk dari 40 total jeruk.",
      kunciJawaban: 26
    },
    {
      teksSoal: "Ada <b>50 balon</b> di pesta. Sebanyak <b>18 balon</b> meletus. Berapa sisa balon yang masih utuh?",
      label1: "Total Balon",
      label2: "Meletus",
      val1: 50,
      val2: 18,
      icon: "fa-balloon",
      color: "text-rose-500",
      hint: "Sisa balon = 50 dikurangi 18.",
      kunciJawaban: 32
    },
    {
      teksSoal: "Eko membawa <b>45 keping biskuit</b>. Dia makan <b>17 biskuit</b> bersama temannya. Berapa sisa biskuit Eko?",
      label1: "Biskuit Eko",
      label2: "Dimakan",
      val1: 45,
      val2: 17,
      icon: "fa-cookie-bite",
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
      color: "text-indigo-600",
      hint: "Hitung dulu total buku dalam dus (6 × 10 = 60), lalu kurangi dengan 18 buku yang disumbangkan.",
      kunciJawaban: 42
    }
  ]
};