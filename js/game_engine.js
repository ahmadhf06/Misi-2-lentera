
/*
 * GAME ENGINE LENTERA — NUMERASI INTERAKTIF
 * File: js/game_engine.js
 */

// ==========================================================
// 1. STATE DAN PENILAIAN
// ==========================================================

let currentLevel = 1;
let currentQuestionIndex = 0;
let currentQuestionsList = [];
let userInputStr = "";

const POIN_AWAL = 100;
const POIN_SALAH = 5;
const BATAS_BINTANG_2 = 50;
const BATAS_BINTANG_3 = 80;

let skorSaatIni = POIN_AWAL;
let jumlahSalah = 0;
let modalAktif = false;
let questionStartedAt = performance.now();
let pendingSubmission = null;
let activeCompetency = "NM-CERITA";

// ==========================================================
// 2. SESSION DASHBOARD
// ==========================================================

function hasDashboardToken() {
    return (
        typeof ssoToken !== "undefined" &&
        Boolean(ssoToken)
    );
}

function getDashboardSession() {
    return (
        typeof LENTERA_SESSION !== "undefined" &&
        LENTERA_SESSION
    )
        ? LENTERA_SESSION
        : null;
}

// Level tugas dari session Dashboard menjadi acuan utama.
function getAssignedLevel() {
    const session = getDashboardSession();

    const rawValue =
        hasDashboardToken() && session
            ? session.level
            : (
                typeof LENTERA_MISSION_LEVEL !== "undefined"
                    ? LENTERA_MISSION_LEVEL
                    : 0
            );

    const value = Number(rawValue);

    return (
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 5
    )
        ? value
        : 0;
}

// Periksa kelengkapan session tugas Dashboard.
function isValidDashboardSession() {
    const session = getDashboardSession();
    const level = getAssignedLevel();

    return Boolean(
        hasDashboardToken() &&
        session &&
        session.misi &&
        session.kompetensi &&
        level >= 1 &&
        level <= 5 &&
        session.api
    );
}

// ==========================================================
// 3. MENU PILIH LEVEL
// ==========================================================

function configureLevelMenu() {
    const cards = Array.from(
        document.querySelectorAll(
            "#level-select-screen .level-card"
        )
    );

    const notice = document.getElementById(
        "dashboard-level-notice"
    );

    const description = document.getElementById(
        "level-menu-description"
    );

    const dashboardMode = hasDashboardToken();
    const validSession = isValidDashboardSession();

    const assignedLevel = validSession
        ? getAssignedLevel()
        : 0;

    if (!cards.length) return;

    if (notice) {
        notice.classList.add("hidden");
        notice.textContent = "";

        notice.className =
            "hidden mt-3 max-w-2xl rounded-2xl border px-4 py-3 text-sm font-semibold";
    }

    if (description) {
        description.textContent = dashboardMode
            ? (
                validSession
                    ? `Misi dari Dashboard: Level ${assignedLevel} ditugaskan. Pilih kartu level yang menyala untuk mulai.`
                    : "Sesi tugas tidak valid. Kembali ke Dashboard lalu buka kembali misi Numerasi."
            )
            : "Pilih level petualanganmu atau gunakan sensor tangan!";
    }

    if (dashboardMode && notice) {
        notice.classList.remove("hidden");

        if (validSession) {
            notice.classList.add(
                "border-emerald-200",
                "bg-emerald-50",
                "text-emerald-800"
            );

            notice.textContent =
                `📘 Tugas aktif: Level ${assignedLevel}. ` +
                "Level lain dikunci karena tidak ditugaskan oleh guru.";
        } else {
            notice.classList.add(
                "border-rose-200",
                "bg-rose-50",
                "text-rose-800"
            );

            notice.textContent =
                "⚠️ Sesi Dashboard tidak valid. " +
                "Tidak ada level yang bisa dimainkan melalui tautan ini.";
        }
    }

    cards.forEach(card => {
        const level = Number(card.dataset.level);

        const assigned =
            dashboardMode &&
            validSession &&
            level === assignedLevel;

        // Mode mandiri membuka semua level.
        // Mode Dashboard hanya membuka level tugas.
        const enabled = !dashboardMode || assigned;

        card.dataset.locked = enabled ? "false" : "true";

        card.setAttribute(
            "aria-disabled",
            enabled ? "false" : "true"
        );

        // Bersihkan label dan tampilan konfigurasi sebelumnya.
        card.querySelectorAll(
            ".level-access-label"
        ).forEach(label => label.remove());

        card.classList.remove(
            "opacity-50",
            "grayscale",
            "cursor-pointer",
            "cursor-not-allowed",
            "pointer-events-none",
            "ring-4",
            "ring-emerald-200",
            "border-emerald-300"
        );

        if (enabled) {
            card.setAttribute(
                "onclick",
                `startLevel(${level})`
            );

            card.classList.add("cursor-pointer");

            if (assigned) {
                card.classList.add(
                    "ring-4",
                    "ring-emerald-200",
                    "border-emerald-300"
                );

                const label = document.createElement("span");

                label.className =
                    "level-access-label mt-3 rounded-full " +
                    "bg-emerald-100 px-3 py-1 text-xs " +
                    "font-extrabold text-emerald-800";

                label.textContent =
                    "✓ Misi dari Dashboard · Pilih untuk mulai";

                card.appendChild(label);
            }
        } else {
            card.removeAttribute("onclick");

            card.classList.add(
                "opacity-50",
                "grayscale",
                "cursor-not-allowed",
                "pointer-events-none"
            );

            const label = document.createElement("span");

            label.className =
                "level-access-label mt-3 rounded-full " +
                "bg-slate-200 px-3 py-1 text-xs " +
                "font-bold text-slate-600";

            label.textContent =
                dashboardMode && !validSession
                    ? "🔒 Sesi tidak valid"
                    : `🔒 Tidak ditugaskan · Level ${assignedLevel} yang aktif`;

            card.appendChild(label);
        }
    });
}

// ==========================================================
// 4. HELPER EVENT DAN PESAN
// ==========================================================

function createEventIdSafe() {
    if (typeof buatEventId === "function") {
        return buatEventId();
    }

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

function showInfoMessage(title, message, callback) {
    if (typeof showModalInfo === "function") {
        showModalInfo(title, message, callback);
        return;
    }

    alert(`${title}\n\n${message}`);

    if (typeof callback === "function") {
        callback();
    }
}

// ==========================================================
// 5. SKOR DAN BINTANG
// ==========================================================

function hitungBintang(skor) {
    if (skor < BATAS_BINTANG_2) return 1;
    if (skor < BATAS_BINTANG_3) return 2;

    return 3;
}

function updateTampilanSkor(berkurang) {
    const el = document.getElementById("skor-nilai");

    if (!el) return;

    el.innerText = skorSaatIni;

    if (berkurang) {
        el.classList.add("text-rose-600");

        setTimeout(() => {
            el.classList.remove("text-rose-600");
        }, 700);
    }
}

function getMaxDigits() {
    const q = currentQuestionsList[currentQuestionIndex];

    if (!q) return 1;

    return String(q.kunciJawaban).length;
}

// ==========================================================
// 6. MEMULAI LEVEL
// ==========================================================

function startLevel(level) {
    const tokenAda = hasDashboardToken();
    const levelDitugaskan = getAssignedLevel();
    const levelDiminta = Number(level);

    // Jika berasal dari Dashboard, session harus valid.
    if (
        tokenAda &&
        !isValidDashboardSession()
    ) {
        showInfoMessage(
            "Sesi Tugas Tidak Valid",
            "Kembali ke Dashboard murid lalu buka kembali misi Numerasi yang ditugaskan.",
            () => {}
        );

        return;
    }

    // Tolak level yang tidak sesuai dengan tugas guru.
    if (
        tokenAda &&
        levelDiminta !== levelDitugaskan
    ) {
        showInfoMessage(
            "Level Dikunci",
            `Guru menugaskan Level ${levelDitugaskan}. ` +
            "Level lain tidak bisa dimainkan dari misi ini.",
            () => {}
        );

        return;
    }

    const levelDipakai = tokenAda
        ? levelDitugaskan
        : levelDiminta;

    // Validasi level 1 sampai 5.
    if (
        !Number.isInteger(levelDipakai) ||
        levelDipakai < 1 ||
        levelDipakai > 5
    ) {
        console.error(
            "Level Numerasi tidak valid:",
            levelDipakai
        );

        showInfoMessage(
            "Level Tidak Valid",
            "Level misi harus berada di antara 1 sampai 5.",
            () => {}
        );

        return;
    }

    // Reset permainan.
    currentLevel = levelDipakai;
    currentQuestionIndex = 0;
    userInputStr = "";
    skorSaatIni = POIN_AWAL;
    jumlahSalah = 0;
    modalAktif = false;
    pendingSubmission = null;

    updateTampilanSkor(false);

    const session = getDashboardSession();

    activeCompetency =
        (session && session.kompetensi) ||
        "NM-CERITA";

    const semuaBank =
        typeof soalBankByKompetensi !== "undefined"
            ? soalBankByKompetensi
            : null;

    const bankKompetensi = semuaBank
        ? semuaBank[activeCompetency]
        : null;

    // Gunakan bank soal berdasarkan kompetensi tugas.
    if (
        bankKompetensi &&
        Array.isArray(bankKompetensi[currentLevel])
    ) {
        currentQuestionsList =
            bankKompetensi[currentLevel];

    } else if (
        !tokenAda &&
        typeof soalBank !== "undefined" &&
        Array.isArray(soalBank[currentLevel])
    ) {
        // Mode mandiri menggunakan bank soal cerita.
        currentQuestionsList = soalBank[currentLevel];
        activeCompetency = "NM-CERITA";

    } else {
        currentQuestionsList = [];
    }

    const levelScreen = document.getElementById(
        "level-select-screen"
    );

    const gameScreen = document.getElementById(
        "game-screen"
    );

    // Sembunyikan tombol kembali ke menu selama tugas Dashboard.
    document
        .querySelectorAll('[onclick*="backToMenu"]')
        .forEach(button => {
            button.style.display =
                tokenAda && levelDitugaskan > 0
                    ? "none"
                    : "";
        });

    // Ganti halaman hanya setelah level dipilih.
    if (levelScreen) {
        levelScreen.classList.add("hidden");
    }

    if (gameScreen) {
        gameScreen.classList.remove("hidden");
        gameScreen.classList.add("flex");
    }

    const levelTag = document.getElementById("level-tag");

    const headerBadge = document.getElementById(
        "header-badge"
    );

    if (levelTag) {
        levelTag.innerText = `Level ${currentLevel}`;
    }

    if (headerBadge) {
        const namaKompetensi = {
            "NM-NILAI-TEMPAT": "Nilai Tempat",
            "NM-REGROUPING": "Regrouping",
            "NM-POLA": "Pola Bilangan",
            "NM-CERITA": "Soal Cerita"
        }[activeCompetency] || "Numerasi";

        headerBadge.innerText =
            `Level ${currentLevel} · ${namaKompetensi}`;
    }

    // Jangan mulai permainan jika bank soal tidak tersedia.
    if (!currentQuestionsList.length) {
        const teksSoalEl = document.getElementById(
            "teks-soal"
        );

        const idxEl = document.getElementById(
            "soal-index"
        );

        const totalEl = document.getElementById(
            "total-soal"
        );

        if (teksSoalEl) {
            teksSoalEl.textContent =
                `Materi untuk kompetensi ${activeCompetency} ` +
                `Level ${currentLevel} belum tersedia. ` +
                "Periksa bank soal di js/soal_config.js.";
        }

        if (idxEl) idxEl.textContent = "0";
        if (totalEl) totalEl.textContent = "0";

        console.error(
            "Bank soal belum tersedia:",
            activeCompetency,
            currentLevel
        );

        return;
    }

    loadQuestion();
}

// ==========================================================
// 7. KEMBALI KE MENU
// ==========================================================

function backToMenu() {
    const session = getDashboardSession();

    // Jika datang dari Dashboard, kembali ke home Dashboard.
    if (
        hasDashboardToken() &&
        session &&
        session.home
    ) {
        window.location.href = session.home;
        return;
    }

    const levelScreen = document.getElementById(
        "level-select-screen"
    );

    const gameScreen = document.getElementById(
        "game-screen"
    );

    if (gameScreen) {
        gameScreen.classList.remove("flex");
        gameScreen.classList.add("hidden");
    }

    if (levelScreen) {
        levelScreen.classList.remove("hidden");
    }

    userInputStr = "";
    modalAktif = false;
    pendingSubmission = null;

    configureLevelMenu();
}

// ==========================================================
// 8. MEMUAT SOAL
// ==========================================================

function loadQuestion() {
    userInputStr = "";
    questionStartedAt = performance.now();

    if (
        !currentQuestionsList ||
        currentQuestionsList.length === 0
    ) {
        console.warn("Bank soal kosong.");
        return;
    }

    const q = currentQuestionsList[currentQuestionIndex];

    if (!q) {
        console.error("Soal aktif tidak ditemukan.");
        return;
    }

    const teksSoalEl = document.getElementById("teks-soal");
    const soalIndexEl = document.getElementById("soal-index");
    const totalSoalEl = document.getElementById("total-soal");

    if (teksSoalEl) {
        teksSoalEl.innerHTML = q.teksSoal;
    }

    if (soalIndexEl) {
        soalIndexEl.innerText = currentQuestionIndex + 1;
    }

    if (totalSoalEl) {
        totalSoalEl.innerText = currentQuestionsList.length;
    }

    const progress =
        ((currentQuestionIndex + 1) /
            currentQuestionsList.length) * 100;

    const progressBar = document.getElementById("progress-bar");

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    const labelBox1 = document.getElementById("label-box-1");
    const labelBox2 = document.getElementById("label-box-2");
    const labelVal1 = document.getElementById("label-val-1");
    const labelVal2 = document.getElementById("label-val-2");

    if (
        q.tipe === "pola" &&
        Array.isArray(q.deret)
    ) {
        // Soal pola menampilkan deret bilangan.
        if (labelBox1) {
            labelBox1.innerText = "DERET BILANGAN";
        }

        if (labelBox2) {
            labelBox2.innerText = "ANGKA BERIKUTNYA";
        }

        if (labelVal1) labelVal1.innerText = "";
        if (labelVal2) labelVal2.innerText = "";

        renderPatternSequence(
            "container-visual-1",
            q.deret
        );

        renderPatternQuestion(
            "container-visual-2"
        );

    } else {
        if (labelBox1) {
            labelBox1.innerText =
                q.label1 || "Kelompok A";
        }

        if (labelBox2) {
            labelBox2.innerText =
                q.label2 || "Kelompok B";
        }

        if (labelVal1) {
            labelVal1.innerText = q.val1 ?? "";
        }

        if (labelVal2) {
            labelVal2.innerText = q.val2 ?? "";
        }

        renderVisualObjects(
            "container-visual-1",
            q.val1,
            q
        );

        renderVisualObjects(
            "container-visual-2",
            q.val2,
            q
        );
    }

    const lumiHint = document.getElementById("lumi-hint");

    if (lumiHint) {
        const label = document.createElement("span");

        label.className = "font-bold";
        label.textContent = "Lumi: ";

        lumiHint.replaceChildren(
            label,
            document.createTextNode(q.hint || "")
        );
    }

    updateAnswerSlots();
    renderKeypad();
}

// ==========================================================
// 9. VISUALISASI OBJEK
// ==========================================================

function renderVisualObjects(containerId, count, q) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const MAKS = 40;

    const jumlah =
        Number.isFinite(Number(count))
            ? Math.max(0, Number(count))
            : 0;

    const renderCount = Math.min(jumlah, MAKS);

    for (let i = 0; i < renderCount; i++) {
        let el;

        if (q.gambar) {
            el = document.createElement("img");
            el.src = q.gambar;
            el.alt = q.label1 || "Objek";
            el.className = "item-gambar";

            el.style.animationDelay = `${i * 30}ms`;

            el.onerror = () => {
                const fallback = document.createElement("i");

                fallback.className =
                    `fa-solid ${q.icon || "fa-star"} ` +
                    `${q.color || "text-teal-500"} text-lg m-0.5`;

                el.replaceWith(fallback);
            };

        } else {
            el = document.createElement("i");

            el.className =
                `fa-solid ${q.icon || "fa-star"} ` +
                `${q.color || "text-teal-500"} ` +
                "text-lg transition-transform " +
                "hover:scale-125 m-0.5";
        }

        container.appendChild(el);
    }

    if (jumlah > MAKS) {
        const lebih = document.createElement("span");

        lebih.className = "item-lebih";
        lebih.innerText = `+${jumlah - MAKS} lagi`;

        container.appendChild(lebih);
    }
}

// ==========================================================
// 10. VISUAL POLA BILANGAN
// ==========================================================

function renderPatternSequence(containerId, deret) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const urutan = [...deret, "…"];

    urutan.forEach((nilai, index) => {
        if (index > 0) {
            const panah = document.createElement("span");

            panah.className =
                "text-slate-400 font-black text-sm";

            panah.textContent = "→";
            container.appendChild(panah);
        }

        const angka = document.createElement("span");

        angka.className =
            "inline-flex items-center justify-center " +
            "min-w-10 h-10 px-2 rounded-xl border-2 " +
            (
                index === urutan.length - 1
                    ? "bg-amber-100 border-amber-400 text-amber-700"
                    : "bg-white border-teal-200 text-slate-700"
            ) +
            " font-extrabold text-base shadow-sm";

        angka.textContent = String(nilai);

        container.appendChild(angka);
    });
}

function renderPatternQuestion(containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const tandaTanya = document.createElement("span");

    tandaTanya.className =
        "inline-flex items-center justify-center " +
        "w-14 h-14 rounded-2xl bg-amber-100 " +
        "border-2 border-amber-400 text-amber-700 " +
        "text-3xl font-black shadow-sm";

    tandaTanya.textContent = "?";

    container.appendChild(tandaTanya);
}

// ==========================================================
// 11. KOTAK JAWABAN
// ==========================================================

function updateAnswerSlots() {
    const wrapper = document.getElementById(
        "slot-jawaban-wrapper"
    );

    if (!wrapper) return;

    const cleanStr = userInputStr.replace(/[^0-9]/g, "");
    const jumlahSlot = getMaxDigits();

    const ukuran = jumlahSlot === 1
        ? "w-24 h-24 text-5xl"
        : "w-20 h-20 text-4xl";

    let slotHtml = "";

    for (let i = 0; i < jumlahSlot; i++) {
        const digit =
            cleanStr.length > i
                ? cleanStr[i]
                : "?";

        const terisi = digit !== "?";

        slotHtml += `
            <div class="${ukuran} ${
                terisi
                    ? "bg-teal-50 border-teal-500 text-teal-700 font-extrabold"
                    : "bg-slate-50 border-dashed border-teal-400 text-slate-300"
            } border-2 rounded-2xl flex items-center justify-center shadow-inner transition-all">
                ${digit}
            </div>
        `;
    }

    wrapper.innerHTML = `
        <div class="flex items-center justify-center gap-3 my-2">
            ${slotHtml}
        </div>
    `;
}

// ==========================================================
// 12. KEYPAD ANGKA
// ==========================================================

function renderKeypad() {
    const keypad = document.getElementById("keypad");

    if (!keypad) return;

    keypad.innerHTML = "";

    const keys = [
        "1", "2", "3", "4", "5",
        "6", "7", "8", "9", "0"
    ];

    keys.forEach(key => {
        const btn = document.createElement("button");

        btn.type = "button";

        btn.className =
            "keypad-btn py-3.5 bg-slate-100 " +
            "hover:bg-teal-100 hover:text-teal-700 " +
            "font-black text-lg rounded-2xl transition " +
            "shadow-sm active:scale-95 flex items-center " +
            "justify-center text-slate-700 cursor-pointer";

        btn.innerText = key;

        btn.onclick = function () {
            handleKeypadInput(key);
        };

        keypad.appendChild(btn);
    });
}

function handleKeypadInput(num) {
    if (modalAktif) return;

    const cleanNum = String(num).replace(/[^0-9]/g, "");
    const maxDigits = getMaxDigits();

    if (
        userInputStr.length < maxDigits &&
        cleanNum !== ""
    ) {
        userInputStr += cleanNum;
        updateAnswerSlots();
    }
}

function hapusAngka() {
    if (modalAktif) return;

    if (userInputStr.length > 0) {
        userInputStr = userInputStr.slice(0, -1);
        updateAnswerSlots();
    }
}

// ==========================================================
// 13. PERIKSA JAWABAN
// ==========================================================

function periksaJawaban() {
    if (modalAktif) return;

    if (
        !currentQuestionsList ||
        currentQuestionsList.length === 0
    ) {
        return;
    }

    const maxDigits = getMaxDigits();

    if (userInputStr.length < maxDigits) {
        modalAktif = true;

        showInfoMessage(
            "Jawaban Belum Lengkap",
            `Isi ${maxDigits} angka dulu ya, ` +
            "baru tekan Periksa. Poinmu tidak berkurang kok.",
            () => {
                modalAktif = false;
            }
        );

        return;
    }

    void checkAnswer();
}

// ==========================================================
// 14. DETEKSI POLA KESALAHAN
// ==========================================================

function deteksiPolaKesalahan(q, jawaban, level) {
    if (
        !q ||
        !Number.isFinite(Number(jawaban))
    ) {
        return "";
    }

    const hasilJawaban = Number(jawaban);
    const kunci = Number(q.kunciJawaban);

    if (!Number.isFinite(kunci)) {
        return "";
    }

    // Jawaban benar tidak memiliki pola kesalahan.
    if (hasilJawaban === kunci) {
        return "";
    }

    const a = Number(q.val1);
    const b = Number(q.val2);

    if (q.tipe === "pola") {
        return "pola_bilangan";
    }

    // Deteksi kesalahan nilai tempat.
    if (q.tipe === "nilai_tempat") {
        const puluhan = Number(q.val1);
        const satuan = Number(q.val2);

        if (hasilJawaban === puluhan + satuan) {
            return "nilai_tempat";
        }

        if (hasilJawaban === satuan * 10 + puluhan) {
            return "tertukar";
        }

        return "";
    }

    if (
        !Number.isFinite(a) ||
        !Number.isFinite(b)
    ) {
        return "";
    }

    // Deteksi kesalahan regrouping.
    if (q.tipe === "regrouping") {
        const operasi = q.operasi || "";
        const simbol = q.operator || q.operasiSimbol || "";

        // Kesalahan meminjam dalam pengurangan.
        if (operasi === "pengurangan") {
            const perluMeminjam = (a % 10) < (b % 10);

            if (
                perluMeminjam &&
                a >= 10 &&
                b >= 10
            ) {
                const hasilTanpaPinjam =
                    (
                        Math.floor(a / 10) -
                        Math.floor(b / 10)
                    ) * 10 +
                    Math.abs((a % 10) - (b % 10));

                if (hasilJawaban === hasilTanpaPinjam) {
                    return "regrouping";
                }
            }
        }

        // Kesalahan menyimpan dalam penjumlahan.
        if (operasi === "penjumlahan") {
            const satuanGabungan =
                (a % 10) + (b % 10);

            if (satuanGabungan >= 10) {
                const hasilTanpaSimpan =
                    Math.floor(a / 10) * 10 +
                    Math.floor(b / 10) * 10 +
                    (satuanGabungan % 10);

                if (hasilJawaban === hasilTanpaSimpan) {
                    return "regrouping";
                }
            }
        }

        // Salah memilih operasi hitung.
        if (simbol === "+" && hasilJawaban === a - b) {
            return "salah_operasi";
        }

        if (simbol === "-" && hasilJawaban === a + b) {
            return "salah_operasi";
        }

        return "";
    }

    // Soal cerita dua langkah atau lebih.
    if (q.tipe === "cerita_dua_langkah") {
        if (
            hasilJawaban === a ||
            hasilJawaban === b
        ) {
            return "cerita_langkah_terlewat";
        }

        const operasiAlternatif = [
            a + b,
            a - b,
            a * b,
            b !== 0 ? a / b : NaN
        ];

        const salahMemilihOperasi =
            operasiAlternatif.some(hasil => (
                Number.isFinite(hasil) &&
                Math.abs(hasil - Math.round(hasil)) < 0.000001 &&
                Math.round(hasil) !== kunci &&
                Math.round(hasil) === hasilJawaban
            ));

        if (salahMemilihOperasi) {
            return "cerita_salah_operasi";
        }

        return "";
    }

    return "";
}

// ==========================================================
// 15. KIRIM DAN PERIKSA JAWABAN
// ==========================================================

async function checkAnswer() {
    if (modalAktif) return;

    if (
        !currentQuestionsList ||
        currentQuestionsList.length === 0
    ) {
        return;
    }

    const q = currentQuestionsList[currentQuestionIndex];

    if (!q) return;

    const userAnswer = Number.parseInt(userInputStr, 10);

    if (!Number.isFinite(userAnswer)) return;

    const benar = userAnswer === Number(q.kunciJawaban);

    const misiSelesai =
        benar &&
        currentQuestionIndex === currentQuestionsList.length - 1;

    const tokenAda = hasDashboardToken();
    const session = getDashboardSession();

    const kompetensi =
        (session && session.kompetensi) ||
        activeCompetency ||
        "NM-CERITA";

    const eventKey =
        `${currentLevel}:${currentQuestionIndex}:${userInputStr}`;

    // Pertahankan event_id saat mencoba mengirim ulang.
    if (
        !pendingSubmission ||
        pendingSubmission.key !== eventKey
    ) {
        pendingSubmission = {
            key: eventKey,

            event: {
                event_id: createEventIdSafe(),

                item_id:
                    `M2-${kompetensi}-L${currentLevel}-Q${currentQuestionIndex + 1}`,

                kompetensi,
                level: Number(currentLevel),
                benar,

                pola: benar
                    ? ""
                    : deteksiPolaKesalahan(
                        q,
                        userAnswer,
                        currentLevel
                    ),

                waktu_ms: Math.max(
                    0,
                    Math.round(
                        performance.now() - questionStartedAt
                    )
                ),

                petunjuk: false,
                waktu: new Date().toISOString()
            }
        };
    }

    // Kunci input sampai server memberi respons.
    modalAktif = true;

    if (tokenAda) {
        let hasilPengiriman = null;

        try {
            if (
                typeof kirimEventDashboard !== "function"
            ) {
                throw new Error(
                    "Fungsi API tidak ditemukan. " +
                    "Periksa js/soal_config.js."
                );
            }

            hasilPengiriman = await kirimEventDashboard(
                pendingSubmission.event,
                misiSelesai
            );

            if (!hasilPengiriman) {
                throw new Error(
                    "Server tidak mengonfirmasi jawaban."
                );
            }

            if (
                misiSelesai &&
                hasilPengiriman.selesai !== true
            ) {
                throw new Error(
                    "Server belum mengonfirmasi penyelesaian misi."
                );
            }

        } catch (error) {
            console.error(
                "Pengiriman event Misi 2 gagal:",
                error
            );

            showInfoMessage(
                "Data Belum Terkirim",
                "Jawaban belum terkonfirmasi oleh Dashboard. " +
                "Tekan Mengerti untuk mencoba mengirim ulang.",
                () => {
                    modalAktif = false;
                    void checkAnswer();
                }
            );

            return;
        }
    }

    // Jawaban sudah diproses.
    // Mode mandiri tidak menggunakan API Dashboard.
    pendingSubmission = null;

    if (benar) {
        const lanjut = () => {
            modalAktif = false;
            currentQuestionIndex++;

            if (
                currentQuestionIndex <
                currentQuestionsList.length
            ) {
                loadQuestion();
                return;
            }

            const hasil = {
                skor: skorSaatIni,
                salah: jumlahSalah,
                bintang: hitungBintang(skorSaatIni)
            };

            if (
                typeof showModalSelesaiLevel === "function"
            ) {
                modalAktif = true;

                showModalSelesaiLevel(
                    currentLevel,
                    hasil
                );

            } else if (
                tokenAda &&
                session &&
                session.home
            ) {
                window.location.href = session.home;

            } else {
                backToMenu();
            }
        };

        if (typeof showModalBenar === "function") {
            showModalBenar(lanjut);
        } else {
            alert("Benar!");
            lanjut();
        }

    } else {
        skorSaatIni = Math.max(
            0,
            skorSaatIni - POIN_SALAH
        );

        jumlahSalah++;

        updateTampilanSkor(true);

        const ulangi = () => {
            modalAktif = false;
            userInputStr = "";

            updateAnswerSlots();

            questionStartedAt = performance.now();
        };

        if (typeof showModalSalah === "function") {
            showModalSalah(
                ulangi,
                skorSaatIni,
                POIN_SALAH
            );
        } else {
            alert(
                `Salah, coba lagi! Poin -${POIN_SALAH}`
            );

            ulangi();
        }
    }
}

// ==========================================================
// 16. MENGAMBIL SOAL AKTIF
// ==========================================================

function getCurrentQuestion() {
    if (
        !currentQuestionsList ||
        currentQuestionsList.length === 0
    ) {
        return null;
    }

    return (
        currentQuestionsList[currentQuestionIndex] ||
        null
    );
}

// ==========================================================
// 17. TAMPILKAN PILIH LEVEL SEBELUM MEMULAI MISI
// ==========================================================

// Tidak memanggil startLevel() secara otomatis.
// Murid harus memilih kartu level yang ditugaskan.
configureLevelMenu();

// ==========================================================
// SELESAI GAME_ENGINE.JS
// ==========================================================
