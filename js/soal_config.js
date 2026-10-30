
/* =========================================================
   LENTERA NUMERASI — SESSION, API, DAN BANK SOAL
   File: js/soal_config.js
   ========================================================= */

// =========================================================
// 1. SESSION DAN KONEKSI API DASHBOARD
// =========================================================

const urlParams = new URLSearchParams(window.location.search);

const ssoToken = urlParams.get("ssoToken") || "";

function decodeJwtPayload(token) {
    try {
        const bagian = token.split(".")[1];

        if (!bagian) return null;

        const base64 = bagian
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const padded = base64 +
            "=".repeat((4 - base64.length % 4) % 4);

        const binary = atob(padded);

        const bytes = Uint8Array.from(
            binary,
            karakter => karakter.charCodeAt(0)
        );

        return JSON.parse(
            new TextDecoder().decode(bytes)
        );

    } catch (error) {
        console.error(
            "Token LENTERA tidak dapat dibaca:",
            error
        );

        return null;
    }
}

const LENTERA_SESSION = ssoToken
    ? decodeJwtPayload(ssoToken)
    : null;


const LENTERA_MISSION_LEVEL = Number(
    (ssoToken && LENTERA_SESSION?.level) ||
    urlParams.get("level") ||
    0
);


const API_EVENT_URL =
    LENTERA_SESSION?.api ||
    "http://127.0.0.1:8000/api/game/event/";

// Membuat ID unik untuk setiap event jawaban.
function buatEventId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return (
        `evt-${Date.now()}-` +
        Math.random().toString(16).slice(2)
    );
}

// Mengirim event jawaban ke Dashboard.
async function kirimEventDashboard(event, selesai = false) {
    // Mode mandiri tidak mengirim data ke akun siswa.
    if (!ssoToken) {
        return {
            skipped: true,
            selesai: false
        };
    }

    if (!LENTERA_SESSION) {
        console.error(
            "Payload token misi tidak valid."
        );

        return null;
    }

    try {
        const response = await fetch(API_EVENT_URL, {
            method: "POST",
            mode: "cors",
            credentials: "omit",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ssoToken}`
            },

            body: JSON.stringify({
                events: event ? [event] : [],
                selesai: Boolean(selesai)
            })
        });

        const hasil = await response.json().catch(() => null);

        if (!response.ok) {
            console.error(
                "API LENTERA menolak jawaban:",
                response.status,
                hasil
            );

            return null;
        }

        if (!hasil || typeof hasil !== "object") {
            console.error("Respons API tidak valid.");
            return null;
        }

        return hasil;

    } catch (error) {
        console.error(
            "Gagal mengirim jawaban ke Dashboard:",
            error
        );

        return null;
    }
}

// =========================================================
// 2. HELPER GAMBAR
// =========================================================

const twemoji = (kode) =>
    `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${kode}.svg`;

// =========================================================
// 3. BANK SOAL CERITA
// =========================================================

const soalBank = {
    1: [
        {
            teksSoal:
                "Lumi membawa <b>4 apel</b>, lalu membeli lagi " +
                "<b>3 apel</b>. Berapa total apel yang dimiliki Lumi?",
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
            teksSoal:
                "Di perpustakaan ada <b>2 buku</b> cerita. Pak Guru " +
                "menambah <b>6 buku</b> baru. Berapa jumlah buku seluruhnya?",
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
            teksSoal:
                "Ada <b>4 bintang</b> berwarna kuning dan " +
                "<b>5 bintang</b> berwarna biru. Berapa total bintang semuanya?",
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
            teksSoal:
                "Ibu memasak <b>2 kue mangkuk</b>. Ani memasak lagi " +
                "<b>4 kue mangkuk</b>. Berapa total kue mangkuk sekarang?",
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
            teksSoal:
                "Di kolam terdapat <b>4 ikan mas</b> dan " +
                "<b>4 ikan lele</b>. Berapa ekor total ikan di kolam?",
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

    2: [
        {
            teksSoal:
                "Siti memiliki <b>32 kelereng</b>. Dia memberikan " +
                "<b>13 kelereng</b> kepada adiknya. Berapa sisa kelereng Siti?",
            label1: "Kelereng Awal",
            label2: "Diberikan",
            val1: 32,
            val2: 13,
            icon: "fa-circle",
            gambar: twemoji("1f535"),
            color: "text-emerald-500",
            hint: "Kurangi 32 dengan 13.",
            kunciJawaban: 19
        },
        {
            teksSoal:
                "Di toko ada <b>40 pensil</b>. Sebanyak " +
                "<b>15 pensil</b> telah terjual. Berapa pensil yang tersisa?",
            label1: "Pensil Toko",
            label2: "Terjual",
            val1: 40,
            val2: 15,
            icon: "fa-pencil",
            gambar: twemoji("270f"),
            color: "text-purple-500",
            hint: "Hitung sisa dengan mengurangi 40 dengan 15.",
            kunciJawaban: 25
        },
        {
            teksSoal:
                "Paman memetik <b>30 buah jeruk</b>. Ternyata ada " +
                "<b>14 jeruk</b> yang busuk. Berapa jeruk yang masih bagus?",
            label1: "Total Jeruk",
            label2: "Jeruk Busuk",
            val1: 30,
            val2: 14,
            icon: "fa-lemon",
            gambar: twemoji("1f34a"),
            color: "text-yellow-500",
            hint: "Kurangkan 14 jeruk busuk dari 30.",
            kunciJawaban: 16
        },
        {
            teksSoal:
                "Mita memiliki <b>35 pita pesta</b>. Sebanyak " +
                "<b>12 pita</b> digunakan untuk merangkai kado. " +
                "Berapa sisa pita Mita?",
            label1: "Total Pita",
            label2: "Dipakai",
            val1: 35,
            val2: 12,
            icon: "fa-ribbon",
            gambar: twemoji("1f380"),
            color: "text-rose-500",
            hint: "Sisa pita = 35 dikurangi 12.",
            kunciJawaban: 23
        },
        {
            teksSoal:
                "Eko membawa <b>29 keping biskuit</b>. Dia makan " +
                "<b>17 biskuit</b> bersama temannya. Berapa sisa biskuit Eko?",
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

    3: [
        {
            teksSoal:
                "Dini punya <b>30 stiker</b>, membeli lagi " +
                "<b>25 stiker</b>, lalu memberikan <b>12 stiker</b> " +
                "kepada adiknya. Berapa stiker Dini sekarang?",
            label1: "Total Setelah Beli",
            label2: "Diberikan",
            val1: 55,
            val2: 12,
            icon: "fa-note-sticky",
            gambar: twemoji("1f31f"),
            color: "text-indigo-500",
            hint:
                "Hitung 30 + 25 terlebih dahulu, kemudian kurangi 12.",
            kunciJawaban: 43
        },
        {
            teksSoal:
                "Di bus ada <b>35 penumpang</b>. Di halte A naik " +
                "<b>28 orang</b>, lalu turun <b>18 orang</b>. " +
                "Berapa penumpang sekarang?",
            label1: "Total Setelah Naik",
            label2: "Turun Bus",
            val1: 63,
            val2: 18,
            icon: "fa-bus",
            gambar: twemoji("1f68c"),
            color: "text-sky-500",
            hint: "Hitung 35 + 28 = 63, kemudian kurangi 18.",
            kunciJawaban: 45
        },
        {
            teksSoal:
                "Toko punya <b>48 botol minuman</b>, mendapat pasokan " +
                "<b>30 botol</b>, lalu terjual <b>23 botol</b>. " +
                "Berapa sisa botol?",
            label1: "Total Pasokan",
            label2: "Terjual",
            val1: 78,
            val2: 23,
            icon: "fa-bottle-water",
            gambar: twemoji("1f964"),
            color: "text-cyan-500",
            hint: "Hitung 48 + 30 = 78, lalu kurangi 23.",
            kunciJawaban: 55
        },
        {
            teksSoal:
                "Budi mengumpulkan <b>38 daun</b>, menemukan lagi " +
                "<b>22 daun</b>, tetapi <b>14 daun</b> hilang tertiup angin. " +
                "Berapa sisa daun?",
            label1: "Total Dikumpulkan",
            label2: "Daun Hilang",
            val1: 60,
            val2: 14,
            icon: "fa-leaf",
            gambar: twemoji("1f343"),
            color: "text-green-500",
            hint: "Hitung 38 + 22 = 60, lalu kurangi 14.",
            kunciJawaban: 46
        },
        {
            teksSoal:
                "Ibu menyiapkan <b>45 potong roti</b>. Ayah menambah " +
                "<b>18 potong</b>, lalu anak-anak memakan " +
                "<b>21 potong</b>. Berapa sisa roti?",
            label1: "Total Roti",
            label2: "Dimakan",
            val1: 63,
            val2: 21,
            icon: "fa-bread-slice",
            gambar: twemoji("1f35e"),
            color: "text-amber-700",
            hint: "Hitung 45 + 18 = 63, lalu kurangi 21.",
            kunciJawaban: 42
        }
    ],

    4: [
        {
            teksSoal:
                "Ibu membeli <b>8 kotak donat</b>. Setiap kotak " +
                "berisi <b>12 donat</b>. Jika <b>21 donat</b> diberikan " +
                "kepada tetangga, berapa sisanya?",
            label1: "Total Donat",
            label2: "Diberikan",
            val1: 96,
            val2: 21,
            icon: "fa-circle-dot",
            gambar: twemoji("1f369"),
            color: "text-pink-500",
            hint: "Hitung 8 × 12 = 96, lalu kurangi 21.",
            kunciJawaban: 75
        },
        {
            teksSoal:
                "Ada <b>96 buah salak</b>. Ibu memasukkan lagi " +
                "<b>44 buah</b>. Seluruh salak dimasukkan sama rata " +
                "ke <b>2 kantong</b>. Berapa salak per kantong?",
            label1: "Total Salak",
            label2: "Jumlah Kantong",
            val1: 140,
            val2: 2,
            icon: "fa-basket-shopping",
            gambar: twemoji("1f330"),
            color: "text-emerald-600",
            hint: "Hitung 96 + 44 = 140, kemudian 140 ÷ 2.",
            kunciJawaban: 70
        },
        {
            teksSoal:
                "Pak Tani memanen <b>7 kantong apel</b>. Setiap " +
                "kantong berisi <b>12 apel</b>. Sebanyak " +
                "<b>19 apel</b> dibagikan. Berapa sisa apel?",
            label1: "Total Apel",
            label2: "Dibagikan",
            val1: 84,
            val2: 19,
            icon: "fa-apple-whole",
            gambar: twemoji("1f34e"),
            color: "text-red-600",
            hint: "Hitung 7 × 12 = 84, lalu kurangi 19.",
            kunciJawaban: 65
        },
        {
            teksSoal:
                "Ahmad memiliki <b>9 bungkus permen</b>. Setiap bungkus " +
                "berisi <b>8 permen</b>. Ia membeli lagi " +
                "<b>11 permen</b>. Berapa total permen?",
            label1: "Permen Bungkus",
            label2: "Permen Eceran",
            val1: 72,
            val2: 11,
            icon: "fa-candy-cane",
            gambar: twemoji("1f36c"),
            color: "text-violet-500",
            hint: "Hitung 9 × 8 = 72, lalu tambahkan 11.",
            kunciJawaban: 83
        },
        {
            teksSoal:
                "Perpustakaan menerima <b>9 dus buku</b>, masing-masing " +
                "berisi <b>10 buku</b>. Jika <b>28 buku</b> disumbangkan, " +
                "berapa sisanya?",
            label1: "Total Buku",
            label2: "Disumbangkan",
            val1: 90,
            val2: 28,
            icon: "fa-book-open",
            gambar: twemoji("1f4da"),
            color: "text-indigo-600",
            hint: "Hitung 9 × 10 = 90, lalu kurangi 28.",
            kunciJawaban: 62
        }
    ],

    5: [
        {
            teksSoal:
                "Perpustakaan punya <b>7 rak</b>. Setiap rak berisi " +
                "<b>15 buku</b>. Sekolah menerima <b>48 buku</b> " +
                "sumbangan. Berapa total buku?",
            label1: "Buku di Rak",
            label2: "Buku Sumbangan",
            val1: 105,
            val2: 48,
            icon: "fa-book",
            gambar: twemoji("1f4da"),
            color: "text-blue-600",
            hint: "Hitung 7 × 15 = 105, lalu tambahkan 48.",
            kunciJawaban: 153
        },
        {
            teksSoal:
                "Pak Tani memanen <b>12 keranjang mangga</b>, masing-masing " +
                "berisi <b>15 mangga</b>. Ia membeli lagi <b>60 mangga</b>. " +
                "Semuanya dibagi rata ke <b>2 kotak</b>. Berapa per kotak?",
            label1: "Total Mangga",
            label2: "Jumlah Kotak",
            val1: 240,
            val2: 2,
            icon: "fa-apple-whole",
            gambar: twemoji("1f96d"),
            color: "text-orange-500",
            hint:
                "Hitung 12 × 15 = 180, lalu 180 + 60 = 240, " +
                "kemudian bagi 2.",
            kunciJawaban: 120
        },
        {
            teksSoal:
                "Dina punya <b>250 manik-manik</b>. Ia membuat " +
                "<b>8 gelang</b>, setiap gelang memakai " +
                "<b>15 manik-manik</b>. Berapa sisanya?",
            label1: "Manik Awal",
            label2: "Manik Terpakai",
            val1: 250,
            val2: 120,
            icon: "fa-circle",
            gambar: twemoji("1f4ff"),
            color: "text-pink-500",
            hint: "Hitung 8 × 15 = 120, lalu kurangi dari 250.",
            kunciJawaban: 130
        },
        {
            teksSoal:
                "Panitia menyiapkan <b>12 kotak nasi</b>, masing-masing " +
                "berisi <b>24 bungkus</b>. Ada tambahan " +
                "<b>36 bungkus</b>. Semuanya dibagikan ke " +
                "<b>3 kelas</b>. Berapa per kelas?",
            label1: "Total Nasi",
            label2: "Jumlah Kelas",
            val1: 324,
            val2: 3,
            icon: "fa-box",
            gambar: twemoji("1f371"),
            color: "text-amber-600",
            hint:
                "Hitung 12 × 24 = 288, lalu 288 + 36 = 324, " +
                "kemudian bagi 3.",
            kunciJawaban: 108
        },
        {
            teksSoal:
                "Toko memiliki <b>15 rak</b>, setiap rak berisi " +
                "<b>12 buku</b>. Sebanyak <b>87 buku</b> terjual dan " +
                "<b>34 buku</b> dikembalikan. Berapa buku sekarang?",
            label1: "Buku Setelah Terjual",
            label2: "Buku Dikembalikan",
            val1: 93,
            val2: 34,
            icon: "fa-book-open",
            gambar: twemoji("1f4d6"),
            color: "text-indigo-600",
            hint:
                "Hitung 15 × 12 = 180, lalu 180 − 87 = 93, " +
                "kemudian 93 + 34.",
            kunciJawaban: 127
        }
    ]
};

// Tandai soal cerita yang membutuhkan lebih dari satu langkah.
for (const level of [3, 4, 5]) {
    for (const soal of soalBank[level]) {
        soal.tipe = "cerita_dua_langkah";

        // Level 5 mencakup beberapa soal dengan tiga langkah.
        soal.jumlahLangkah = level === 5 ? 3 : 2;
    }
}

// =========================================================
// 4. BANK SOAL NILAI TEMPAT
// =========================================================

const dataNilaiTempat = {
    1: [[1, 2], [1, 4], [1, 7], [2, 1], [2, 5]],
    2: [[2, 8], [3, 4], [3, 7], [4, 2], [4, 9]],
    3: [[4, 6], [5, 3], [5, 8], [6, 1], [6, 7]],
    4: [[6, 9], [7, 4], [7, 8], [8, 2], [8, 6]],
    5: [[8, 9], [9, 1], [9, 4], [9, 6], [9, 9]]
};

const soalBankNilaiTempat = Object.fromEntries(
    Object.entries(dataNilaiTempat).map(
        ([level, pasangan]) => [
            Number(level),

            pasangan.map(([puluhan, satuan]) => ({
                tipe: "nilai_tempat",

                teksSoal:
                    `Ada <b>${puluhan} ikat puluhan</b> dan ` +
                    `<b>${satuan} satuan</b>. ` +
                    "Jika satu ikat berisi 10 benda, " +
                    "berapa jumlah semuanya?",

                label1: "Ikat puluhan",
                label2: "Satuan",

                val1: puluhan,
                val2: satuan,

                icon: "fa-cubes",
                gambar: null,
                color: "text-amber-500",

                hint:
                    `${puluhan} puluhan bernilai ${puluhan * 10}. ` +
                    `Tambahkan ${satuan} satuan.`,

                kunciJawaban:
                    puluhan * 10 + satuan
            }))
        ]
    )
);

// =========================================================
// 5. BANK SOAL REGROUPING
// =========================================================

const dataRegrouping = {
    1: [
        [8, "+", 7],
        [9, "+", 6],
        [13, "-", 5],
        [14, "-", 6],
        [16, "-", 8]
    ],

    2: [
        [28, "+", 7],
        [42, "-", 17],
        [36, "+", 18],
        [50, "-", 26],
        [63, "-", 28]
    ],

    3: [
        [47, "+", 35],
        [62, "-", 27],
        [56, "+", 28],
        [71, "-", 36],
        [38, "+", 24]
    ],

    4: [
        [58, "+", 37],
        [81, "-", 46],
        [67, "+", 28],
        [90, "-", 57],
        [76, "-", 38]
    ],

    5: [
        [79, "+", 86],
        [82, "-", 57],
        [68, "+", 57],
        [91, "-", 68],
        [57, "+", 68]
    ]
};

const soalBankRegrouping = Object.fromEntries(
    Object.entries(dataRegrouping).map(
        ([level, daftar]) => [
            Number(level),

            daftar.map(([a, operator, b]) => {
                const hasil = operator === "+"
                    ? a + b
                    : a - b;

                const operasi = operator === "+"
                    ? "penjumlahan"
                    : "pengurangan";

                return {
                    tipe: "regrouping",
                    operasi,
                    operator,

                    teksSoal:
                        `Hitung <b>${a} ${operator} ${b}</b>. ` +
                        "Berapa hasilnya?",

                    label1: "Bilangan pertama",
                    label2: "Bilangan kedua",

                    val1: a,
                    val2: b,

                    icon: "fa-calculator",
                    gambar: null,
                    color: "text-teal-500",

                    hint: operator === "+"
                        ? `Jumlahkan ${a} dengan ${b}. Periksa apakah ` +
                          "satuan mencapai 10 sehingga perlu menyimpan 1 puluhan."
                        : `Kurangi ${a} dengan ${b}. Jika satuan tidak cukup, ` +
                          "pinjam 1 puluhan.",

                    kunciJawaban: hasil
                };
            })
        ]
    )
);

// =========================================================
// 6. BANK SOAL POLA BILANGAN
// =========================================================

const dataPolaBilangan = {
    1: [
        {
            deret: [2, 4, 6, 8],
            jawaban: 10,
            pola: 2,
            hint: "Setiap angka bertambah 2."
        },
        {
            deret: [1, 3, 5, 7],
            jawaban: 9,
            pola: 2,
            hint: "Setiap angka bertambah 2."
        },
        {
            deret: [5, 6, 7, 8],
            jawaban: 9,
            pola: 1,
            hint: "Setiap angka bertambah 1."
        },
        {
            deret: [10, 8, 6, 4],
            jawaban: 2,
            pola: -2,
            hint: "Setiap angka berkurang 2."
        },
        {
            deret: [3, 6, 9, 12],
            jawaban: 15,
            pola: 3,
            hint: "Setiap angka bertambah 3."
        }
    ],

    2: [
        {
            deret: [4, 8, 12, 16],
            jawaban: 20,
            pola: 4,
            hint: "Setiap angka bertambah 4."
        },
        {
            deret: [5, 10, 15, 20],
            jawaban: 25,
            pola: 5,
            hint: "Setiap angka bertambah 5."
        },
        {
            deret: [10, 20, 30, 40],
            jawaban: 50,
            pola: 10,
            hint: "Setiap angka bertambah 10."
        },
        {
            deret: [21, 18, 15, 12],
            jawaban: 9,
            pola: -3,
            hint: "Setiap angka berkurang 3."
        },
        {
            deret: [40, 35, 30, 25],
            jawaban: 20,
            pola: -5,
            hint: "Setiap angka berkurang 5."
        }
    ],

    3: [
        {
            deret: [2, 5, 4, 7, 6],
            jawaban: 9,
            pola: 2,
            hint:
                "Pola bergantian tambah 3 dan kurang 1. " +
                "Setelah 6, tambahkan 3."
        },
        {
            deret: [1, 2, 4, 5, 7],
            jawaban: 8,
            pola: 1,
            hint:
                "Pola bergantian +1, +2, +1, +2, lalu +1."
        },
        {
            deret: [3, 6, 5, 10, 9],
            jawaban: 18,
            pola: 2,
            hint: "Pola bergantian kali 2 lalu kurang 1."
        },
        {
            deret: [2, 4, 8, 16],
            jawaban: 32,
            pola: 2,
            hint: "Setiap angka dikali 2."
        },
        {
            deret: [100, 90, 95, 85, 90],
            jawaban: 80,
            pola: 5,
            hint: "Pola bergantian kurang 10 lalu tambah 5."
        }
    ],

    4: [
        {
            deret: [1, 4, 9, 16],
            jawaban: 25,
            pola: 5,
            hint:
                "Deret kuadrat: 1², 2², 3², 4². Berikutnya 5²."
        },
        {
            deret: [2, 6, 12, 20],
            jawaban: 30,
            pola: 2,
            hint:
                "Perkalian 1×2, 2×3, 3×4, 4×5. Berikutnya 5×6."
        },
        {
            deret: [1, 3, 6, 10],
            jawaban: 15,
            pola: 3,
            hint:
                "Penambahan berturut-turut +2, +3, +4, lalu +5."
        },
        {
            deret: [3, 9, 27],
            jawaban: 81,
            pola: 3,
            hint: "Setiap angka dikali 3."
        },
        {
            deret: [81, 27, 9],
            jawaban: 3,
            pola: 3,
            hint: "Setiap angka dibagi 3."
        }
    ],

    5: [
        {
            deret: [2, 6, 12, 20, 30],
            jawaban: 42,
            pola: 6,
            hint:
                "Selisihnya +4, +6, +8, +10. Berikutnya tambah 12."
        },
        {
            deret: [1, 2, 6, 24],
            jawaban: 120,
            pola: 5,
            hint:
                "Kalikan berturut-turut dengan 2, 3, 4, lalu 5."
        },
        {
            deret: [5, 9, 17, 33],
            jawaban: 65,
            pola: 2,
            hint: "Setiap angka dikali 2 lalu dikurangi 1."
        },
        {
            deret: [2, 3, 5, 8, 12],
            jawaban: 17,
            pola: 5,
            hint:
                "Selisihnya +1, +2, +3, +4. Berikutnya tambah 5."
        },
        {
            deret: [144, 72, 36, 18],
            jawaban: 9,
            pola: 2,
            hint: "Setiap angka dibagi 2."
        }
    ]
};

const soalBankPola = Object.fromEntries(
    Object.entries(dataPolaBilangan).map(
        ([level, daftar]) => [
            Number(level),

            daftar.map(item => ({
                tipe: "pola",
                deret: item.deret,

                teksSoal:
                    "Perhatikan pola bilangan berikut: " +
                    `<b>${item.deret.join(", ")}, ...</b><br>` +
                    "Angka berikutnya adalah?",

                label1: "Deret bilangan",
                label2: "Angka berikutnya",

                // Visual pola digambar dari properti deret.
                val1: item.deret.length,
                val2: Math.abs(item.pola),

                icon: "fa-arrow-trend-up",
                gambar: null,
                color: "text-violet-500",

                hint: item.hint,
                kunciJawaban: item.jawaban
            }))
        ]
    )
);

// =========================================================
// 7. PEMETAAN BANK SOAL UNTUK DASHBOARD
// =========================================================

const soalBankByKompetensi = {
    "NM-CERITA": soalBank,
    "NM-NILAI-TEMPAT": soalBankNilaiTempat,
    "NM-REGROUPING": soalBankRegrouping,
    "NM-POLA": soalBankPola
};

// =========================================================
// SELESAI SOAL_CONFIG.JS
// =========================================================
