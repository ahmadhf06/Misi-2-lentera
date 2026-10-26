const urlParams = new URLSearchParams(window.location.search);
const ssoToken = urlParams.get('ssoToken') || "DEMO_TOKEN_123";
const API_EVENT_URL = "/api/game/event/";

const bankSoalPerLevel = {
  1: [ // LEVEL 1: NILAI TEMPAT (Batang Bambu Puluhan & Satuan)
    {
      id: "L1-01", kompetensi: "NILAI_TEMPAT", level: 1, type: "nilai_tempat",
      teksSoal: "Pak Budi punya <span class='teal-brand font-extrabold'>4 ikat</span> sapu lidi berisi 10 batang dan <span class='teal-brand font-extrabold'>7 batang</span> lepas. Berapa banyak sapu lidi Pak Budi?",
      puluhan: 4, satuan: 7, kunciJawaban: 47,
      hint: "Satu ikat berisi 10 batang. Sudah ada 4 ikat, berarti 4 puluhan. Sekarang hitung batang yang lepas!"
    },
    {
      id: "L1-02", kompetensi: "NILAI_TEMPAT", level: 1, type: "nilai_tempat",
      teksSoal: "Ibu guru membawa <span class='teal-brand font-extrabold'>2 ikat</span> pensil (isi 10) dan <span class='teal-brand font-extrabold'>5 pensil</span> satuan. Berapa jumlah pensil?",
      puluhan: 2, satuan: 5, kunciJawaban: 25,
      hint: "2 ikat pensil menjadi 2 puluhan (20), lalu tambahkan 5 pensil satuan!"
    },
    {
      id: "L1-03", kompetensi: "NILAI_TEMPAT", level: 1, type: "nilai_tempat",
      teksSoal: "Di toko ada <span class='teal-brand font-extrabold'>3 ikat</span> buku (isi 10 per ikat) dan <span class='teal-brand font-extrabold'>8 buku</span> lepas. Berapa total buku tulis?",
      puluhan: 3, satuan: 8, kunciJawaban: 38,
      hint: "Hitung 3 ikat puluhan di kiri, lalu hitung 8 buku satuan di kanan."
    },
    {
      id: "L1-04", kompetensi: "NILAI_TEMPAT", level: 1, type: "nilai_tempat",
      teksSoal: "Siti memiliki <span class='teal-brand font-extrabold'>5 ikat</span> sedotan (isi 10) dan <span class='teal-brand font-extrabold'>3 sedotan</span> satuan. Berapa jumlah sedotan Siti?",
      puluhan: 5, satuan: 3, kunciJawaban: 53,
      hint: "5 ikat puluhan digabung 3 satuan menjadi lima puluh tiga."
    },
    {
      id: "L1-05", kompetensi: "NILAI_TEMPAT", level: 1, type: "nilai_tempat",
      teksSoal: "Pak Tani merapikan <span class='teal-brand font-extrabold'>1 ikat</span> ranting (isi 10) dan <span class='teal-brand font-extrabold'>6 ranting</span> lepas. Berapa total rantingnya?",
      puluhan: 1, satuan: 6, kunciJawaban: 16,
      hint: "1 ikat puluhan ditambah 6 satuan."
    }
  ],
  2: [ // LEVEL 2: PENGURANGAN (Apel, Koin, Permen, Kado Ultah, Buku)
    {
      id: "L2-01", kompetensi: "PENGURANGAN", level: 2, type: "kurang",
      teksSoal: "Siti membawa <span class='text-red-500 font-extrabold'>8 buah apel</span> di keranjang, namun <span class='text-slate-700 font-extrabold'>3 apel</span> terjatuh di jalan. Berapa sisa apel Siti?",
      val1: 8, val2: 3, kunciJawaban: 5, icon: "fa-apple-whole", color: "text-red-500",
      label1: "Apel Awal", label2: "Apel Jatuh", hint: "Kurangi jumlah apel awal dengan apel yang terjatuh."
    },
    {
      id: "L2-02", kompetensi: "PENGURANGAN", level: 2, type: "kurang",
      teksSoal: "Pak Tono punya <span class='text-amber-500 font-extrabold'>7 koin emas</span>, lalu ia memberikan <span class='text-slate-700 font-extrabold'>4 koin</span> kepada adiknya. Berapa sisa koin Pak Tono?",
      val1: 7, val2: 4, kunciJawaban: 3, icon: "fa-coins", color: "text-amber-500",
      label1: "Koin Punya", label2: "Diberikan", hint: "Hitung sisa koin setelah dikurangi yang diberikan."
    },
    {
      id: "L2-03", kompetensi: "PENGURANGAN", level: 2, type: "kurang",
      teksSoal: "Di dalam kotak ada <span class='text-pink-500 font-extrabold'>9 permen</span>, kemudian <span class='text-slate-700 font-extrabold'>5 permen</span> dimakan. Berapa sisa permen di kotak?",
      val1: 9, val2: 5, kunciJawaban: 4, icon: "fa-candy-cane", color: "text-pink-500",
      label1: "Permen Awal", label2: "Permen Dimakan", hint: "Kurangkan permen awal dengan yang sudah dimakan."
    },
    {
      id: "L2-04", kompetensi: "PENGURANGAN", level: 2, type: "kurang",
      teksSoal: "Di meja ada <span class='text-blue-500 font-extrabold'>6 kado ulang tahun</span>, lalu <span class='text-slate-700 font-extrabold'>2 kado</span> diberikan ke teman. Berapa sisa kado di meja?",
      val1: 6, val2: 2, kunciJawaban: 4, icon: "fa-gift", color: "text-blue-500",
      label1: "Kado Awal", label2: "Kado Diberikan", hint: "Kurangi jumlah kado awal dengan kado yang dibagikan."
    },
    {
      id: "L2-05", kompetensi: "PENGURANGAN", level: 2, type: "kurang",
      teksSoal: "Guru memiliki <span class='text-yellow-500 font-extrabold'>10 buku</span> cerita, dan <span class='text-slate-700 font-extrabold'>6 buku</span> dipinjam siswa. Berapa sisa buku di rak?",
      val1: 10, val2: 6, kunciJawaban: 4, icon: "fa-book", color: "text-yellow-500",
      label1: "Buku Total", label2: "Buku Dipinjam", hint: "Kurangkan total buku dengan buku yang dipinjam."
    }
  ],
  3: [ // LEVEL 3: KOMBINASI (+ dan -)
    {
      id: "L3-01", kompetensi: "KOMBINASI", level: 3, type: "kombinasi",
      teksSoal: "Ani punya <span class='text-red-500 font-extrabold'>5 apel</span>, diberi ibu <span class='text-red-500 font-extrabold'>3 apel</span>, lalu <span class='text-slate-700 font-extrabold'>2 apel</span> dimakan. Berapa sisa apel Ani?",
      val1: 5, val2: 3, val3: 2, kunciJawaban: 6, icon: "fa-apple-whole", color: "text-red-500",
      label1: "Apel Total", label2: "Apel Dimakan", hint: "Jumlahkan dulu 5 + 3, kemudian kurangi 2!"
    },
    {
      id: "L3-02", kompetensi: "KOMBINASI", level: 3, type: "kombinasi",
      teksSoal: "Roni menemukan <span class='text-amber-500 font-extrabold'>6 koin</span>, dikurangi <span class='text-slate-700 font-extrabold'>2 koin</span> yang hilang, lalu menemukan lagi <span class='text-amber-500 font-extrabold'>4 koin</span>. Berapa koin Roni sekarang?",
      val1: 6, val2: 2, val3: 4, kunciJawaban: 8, icon: "fa-coins", color: "text-amber-500",
      label1: "Koin Hitung", label2: "Koin Temuan", hint: "Kurangi 6 - 2 terlebih dahulu, lalu tambahkan 4."
    },
    {
      id: "L3-03", kompetensi: "KOMBINASI", level: 3, type: "kombinasi",
      teksSoal: "Di meja ada <span class='text-pink-500 font-extrabold'>4 permen</span>, ayah membawakan <span class='text-pink-500 font-extrabold'>5 permen</span>, kemudian <span class='text-slate-700 font-extrabold'>3 permen</span> diberikan ke teman. Berapa sisa permen?",
      val1: 4, val2: 5, val3: 3, kunciJawaban: 6, icon: "fa-candy-cane", color: "text-pink-500",
      label1: "Permen Total", label2: "Permen Diberikan", hint: "Hitung 4 + 5, lalu hasilnya dikurangi 3."
    },
    {
      id: "L3-04", kompetensi: "KOMBINASI", level: 3, type: "kombinasi",
      teksSoal: "Ada <span class='text-blue-500 font-extrabold'>7 kado ulang tahun</span> di meja, <span class='text-slate-700 font-extrabold'>3 kado</span> sudah dibuka, lalu ayah membawa <span class='text-blue-500 font-extrabold'>4 kado baru</span>. Berapa jumlah kado sekarang?",
      val1: 7, val2: 3, val3: 4, kunciJawaban: 8, icon: "fa-gift", color: "text-blue-500",
      label1: "Kado Sisa", label2: "Kado Baru", hint: "Kurangi 7 - 3 terlebih dahulu, lalu tambahkan 4."
    },
    {
      id: "L3-05", kompetensi: "KOMBINASI", level: 3, type: "kombinasi",
      teksSoal: "Siswa membawa <span class='text-yellow-500 font-extrabold'>8 bintang</span>, dikurangi <span class='text-slate-700 font-extrabold'>4 bintang</span> rusak, lalu ditambah <span class='text-yellow-500 font-extrabold'>5 bintang</span> baru. Berapa totalnya?",
      val1: 8, val2: 4, val3: 5, kunciJawaban: 9, icon: "fa-star", color: "text-yellow-500",
      label1: "Bintang Sisa", label2: "Bintang Baru", hint: "Hitung 8 - 4, lalu tambahkan 5."
    }
  ]
};