
// ==========================================================
// MODAL DAN ANIMASI LENTERA
// File: js/modal.js
// Mendukung mode Dashboard dan mode mandiri.
// ==========================================================

let confettiInterval = null;

// ==========================================================
// 1. CONTAINER MODAL
// ==========================================================

function ensureModalContainer() {
    let container = document.getElementById(
        "lentera-modal-container"
    );

    if (!container) {
        container = document.createElement("div");
        container.id = "lentera-modal-container";
        document.body.appendChild(container);
    }

    return container;
}

function hapusModal() {
    const container = document.getElementById(
        "lentera-modal-container"
    );

    if (container) {
        container.innerHTML = "";
    }
}

// ==========================================================
// 2. CONFETTI
// ==========================================================

function startContinuousConfetti() {
    stopContinuousConfetti();

    const bentuk = ["🎉", "✨", "⭐", "🎈", "🎊"];

    confettiInterval = setInterval(() => {
        const confetti = document.createElement("div");

        confetti.className = "lentera-confetti-item";
        confetti.textContent =
            bentuk[Math.floor(Math.random() * bentuk.length)];

        confetti.style.position = "fixed";
        confetti.style.top = "-30px";
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.fontSize =
            `${Math.random() * 18 + 16}px`;

        confetti.style.zIndex = "9999";
        confetti.style.pointerEvents = "none";
        confetti.style.transition =
            "transform 3s linear, opacity 3s linear";

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.transform =
                `translateY(${window.innerHeight + 60}px) ` +
                `rotate(${Math.random() * 360}deg)`;

            confetti.style.opacity = "0";
        }, 50);

        setTimeout(() => {
            confetti.remove();
        }, 3200);

    }, 180);
}

function stopContinuousConfetti() {
    if (confettiInterval !== null) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }

    document
        .querySelectorAll(".lentera-confetti-item")
        .forEach(item => item.remove());
}

// ==========================================================
// 3. HELPER TOMBOL MODAL
// ==========================================================

function buatTombolModal(id, teks, kelas) {
    const button = document.createElement("button");

    button.id = id;
    button.type = "button";
    button.className =
        "modal-action-btn w-full py-4 rounded-2xl " +
        "font-extrabold text-base shadow-md transition " +
        "active:scale-95 " + kelas;

    button.textContent = teks;

    return button;
}

function buatKerangkaModal({
    border = "border-teal-400",
    ikon = "💡",
    judul = "",
    pesan = ""
}) {
    const container = ensureModalContainer();

    container.innerHTML = "";

    const overlay = document.createElement("div");
    overlay.className =
        "fixed inset-0 z-50 flex items-center " +
        "justify-center bg-slate-900/60 backdrop-blur-sm " +
        "p-4";

    const kartu = document.createElement("div");
    kartu.className =
        "bg-white rounded-3xl p-7 max-w-md w-full " +
        "mx-4 shadow-2xl border-4 " + border +
        " text-center";

    const gambar = document.createElement("div");
    gambar.className =
        "w-20 h-20 rounded-full flex items-center " +
        "justify-center mx-auto mb-4 text-4xl " +
        "bg-slate-100";

    gambar.textContent = ikon;

    const title = document.createElement("h2");
    title.className =
        "text-2xl font-black text-slate-800 mb-3";
    title.textContent = judul;

    const description = document.createElement("p");
    description.className =
        "text-slate-600 text-base leading-relaxed mb-6";
    description.textContent = pesan;

    kartu.append(gambar, title, description);
    overlay.appendChild(kartu);
    container.appendChild(overlay);

    return {
        container,
        overlay,
        kartu
    };
}

// ==========================================================
// 4. POPUP JAWABAN BENAR
// ==========================================================

function showModalBenar(onNextCallback) {
    stopContinuousConfetti();

    const modal = buatKerangkaModal({
        border: "border-emerald-400",
        ikon: "🎉",
        judul: "Luar Biasa!",
        pesan: "Jawaban kamu benar dan tepat sekali!"
    });

    const button = buatTombolModal(
        "modal-next-btn",
        "Lanjut Soal Berikutnya 🚀",
        "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
    );

    modal.kartu.appendChild(button);

    button.addEventListener("click", () => {
        stopContinuousConfetti();
        hapusModal();

        if (typeof onNextCallback === "function") {
            onNextCallback();
        }
    });
}

// ==========================================================
// 5. POPUP JAWABAN SALAH
// ==========================================================

function showModalSalah(
    onRetryCallback,
    sisaPoin,
    pengurang
) {
    stopContinuousConfetti();

    const modal = buatKerangkaModal({
        border: "border-rose-400",
        ikon: "💪",
        judul: "Belum Tepat!",
        pesan:
            "Ayo perhatikan petunjuk dari Lumi sekali lagi. " +
            "Kamu pasti bisa!"
    });

    if (typeof sisaPoin === "number") {
        const info = document.createElement("div");

        info.className =
            "bg-rose-50 border border-rose-200 " +
            "rounded-2xl py-3 px-4 mb-5";

        const pengurangEl = document.createElement("p");
        pengurangEl.className =
            "text-rose-600 font-black text-lg";

        pengurangEl.textContent =
            `−${pengurang || 5} poin`;

        const sisaEl = document.createElement("p");
        sisaEl.className =
            "text-xs font-semibold text-rose-500";

        sisaEl.textContent =
            `Sisa poinmu: ${sisaPoin}`;

        info.append(pengurangEl, sisaEl);

        const tombol = modal.kartu.querySelector("button");

        if (tombol) {
            modal.kartu.insertBefore(info, tombol);
        } else {
            modal.kartu.appendChild(info);
        }
    }

    const button = buatTombolModal(
        "modal-retry-btn",
        "Coba Lagi 🔄",
        "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
    );

    modal.kartu.appendChild(button);

    button.addEventListener("click", () => {
        hapusModal();

        if (typeof onRetryCallback === "function") {
            onRetryCallback();
        }
    });
}

// ==========================================================
// 6. POPUP INFORMASI
// ==========================================================

function showModalInfo(
    judul,
    pesan,
    onCloseCallback
) {
    stopContinuousConfetti();

    const modal = buatKerangkaModal({
        border: "border-amber-400",
        ikon: "✍️",
        judul: String(judul ?? "Informasi"),
        pesan: String(pesan ?? "")
    });

    const button = buatTombolModal(
        "modal-info-btn",
        "Mengerti 👍",
        "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
    );

    modal.kartu.appendChild(button);

    button.addEventListener("click", () => {
        hapusModal();

        if (typeof onCloseCallback === "function") {
            onCloseCallback();
        }
    });
}

// ==========================================================
// 7. POPUP SELESAI LEVEL
// ==========================================================

function showModalSelesaiLevel(level, hasil) {
    stopContinuousConfetti();

    const container = ensureModalContainer();
    container.innerHTML = "";

    const skor =
        hasil && Number.isFinite(Number(hasil.skor))
            ? Number(hasil.skor)
            : 100;

    const salah =
        hasil && Number.isFinite(Number(hasil.salah))
            ? Number(hasil.salah)
            : 0;

    const bintang =
        hasil && Number.isFinite(Number(hasil.bintang))
            ? Math.max(1, Math.min(3, Number(hasil.bintang)))
            : 1;

    const predikat = {
        3: {
            judul: "LUAR BIASA! 🥳",
            nama: "Hebat",
            catatan:
                "Perhitunganmu sangat bagus. Kamu hebat sekali!"
        },
        2: {
            judul: "BAGUS SEKALI! 😊",
            nama: "Bagus",
            catatan:
                "Terus berlatih bersama Lumi untuk hasil yang lebih baik."
        },
        1: {
            judul: "TERUS SEMANGAT! 💪",
            nama: "Semangat",
            catatan:
                "Jangan menyerah. Kamu bisa terus belajar dan berkembang."
        }
    }[bintang];

    const overlay = document.createElement("div");

    overlay.className =
        "fixed inset-0 z-50 flex items-center " +
        "justify-center bg-slate-900/60 " +
        "backdrop-blur-sm p-4";

    const kartu = document.createElement("div");

    kartu.className =
        "bg-white rounded-3xl p-7 max-w-lg w-full " +
        "mx-4 shadow-2xl border-4 border-amber-400 " +
        "text-center relative overflow-hidden";

    const dekorasi = document.createElement("div");
    dekorasi.className =
        "absolute -top-8 -left-8 w-28 h-28 " +
        "bg-amber-200 rounded-full opacity-50 blur-xl";

    const isi = document.createElement("div");
    isi.className = "relative z-10";

    const piala = document.createElement("div");
    piala.className = "text-5xl mb-2";
    piala.textContent = "🏆";

    const labelLevel = document.createElement("p");
    labelLevel.className =
        "text-xs font-bold text-amber-600 " +
        "tracking-widest uppercase";

    labelLevel.textContent = `LEVEL ${level} SELESAI`;

    const judul = document.createElement("h2");
    judul.className =
        "text-3xl font-black text-slate-800 mt-2 mb-3";
    judul.textContent = predikat.judul;

    const bintangEl = document.createElement("div");
    bintangEl.className =
        "flex justify-center gap-2 text-3xl mb-4";

    for (let i = 1; i <= 3; i++) {
        const star = document.createElement("span");
        star.textContent = "⭐";

        if (i > bintang) {
            star.className = "opacity-25 grayscale";
        } else {
            star.className = "text-amber-400";
        }

        bintangEl.appendChild(star);
    }

    const labelSkor = document.createElement("p");
    labelSkor.className =
        "text-xs font-semibold text-slate-400 " +
        "uppercase tracking-wider mb-2";
    labelSkor.textContent = "NILAI KAMU";

    const lingkaran = document.createElement("div");
    lingkaran.className =
        "w-36 h-36 mx-auto mb-6 rounded-full " +
        "bg-gradient-to-tr from-amber-400 via-pink-500 " +
        "to-teal-400 p-1.5 shadow-lg";

    const lingkaranDalam = document.createElement("div");
    lingkaranDalam.className =
        "w-full h-full bg-white rounded-full " +
        "flex items-center justify-center";

    const skorEl = document.createElement("span");
    skorEl.id = "score-counter";
    skorEl.className = "text-4xl font-black";
    skorEl.textContent = "0";

    lingkaranDalam.appendChild(skorEl);
    lingkaran.appendChild(lingkaranDalam);

    const statistik = document.createElement("div");
    statistik.className =
        "grid grid-cols-2 gap-4 mb-5";

    const kotakSalah = document.createElement("div");
    kotakSalah.className =
        "bg-teal-50 border border-teal-200 rounded-2xl p-3";

    const angkaSalah = document.createElement("p");
    angkaSalah.className =
        "text-xl font-black text-teal-700";
    angkaSalah.textContent = `${salah}x`;

    const labelSalah = document.createElement("p");
    labelSalah.className =
        "text-xs font-bold text-teal-600 uppercase";
    labelSalah.textContent = "Jawaban Salah";

    kotakSalah.append(angkaSalah, labelSalah);

    const kotakPredikat = document.createElement("div");
    kotakPredikat.className =
        "bg-amber-50 border border-amber-200 rounded-2xl p-3";

    const namaPredikat = document.createElement("p");
    namaPredikat.className =
        "text-xl font-black text-amber-700";
    namaPredikat.textContent = predikat.nama;

    const labelPredikat = document.createElement("p");
    labelPredikat.className =
        "text-xs font-bold text-amber-600 uppercase";
    labelPredikat.textContent = "Predikat";

    kotakPredikat.append(namaPredikat, labelPredikat);
    statistik.append(kotakSalah, kotakPredikat);

    const catatan = document.createElement("p");
    catatan.className =
        "text-sm text-slate-500 mb-6 italic";
    catatan.textContent = predikat.catatan;

    const tombol = document.createElement("div");
    tombol.className = "flex flex-col sm:flex-row gap-3";

    const session = getSessionModal();
    const modeDashboard =
        typeof ssoToken !== "undefined" &&
        Boolean(ssoToken);

    let tombolReplay;
    let tombolMenu;

    if (modeDashboard && session && session.home) {
        tombolReplay = buatTombolModal(
            "modal-replay-btn",
            "🏠 Kembali ke Beranda",
            "flex-1 bg-white border-2 border-slate-200 text-slate-700"
        );

        tombolMenu = buatTombolModal(
            "modal-menu-btn",
            "✅ Selesai",
            "flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white"
        );

        const kembaliKeBeranda = () => {
            stopContinuousConfetti();
            clearInterval(timerSkor);
            hapusModal();

            window.location.href = session.home;
        };

        tombolReplay.addEventListener(
            "click",
            kembaliKeBeranda
        );

        tombolMenu.addEventListener(
            "click",
            kembaliKeBeranda
        );

    } else {
        tombolReplay = buatTombolModal(
            "modal-replay-btn",
            "🔄 Main Lagi",
            "flex-1 bg-white border-2 border-slate-200 text-slate-700"
        );

        tombolMenu = buatTombolModal(
            "modal-menu-btn",
            "🚀 Pilih Level",
            "flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white"
        );

        tombolReplay.addEventListener("click", () => {
            stopContinuousConfetti();
            clearInterval(timerSkor);
            hapusModal();

            if (typeof startLevel === "function") {
                startLevel(level);
            }
        });

        tombolMenu.addEventListener("click", () => {
            stopContinuousConfetti();
            clearInterval(timerSkor);
            hapusModal();

            if (typeof backToMenu === "function") {
                backToMenu();
            }
        });
    }

    tombol.append(tombolReplay, tombolMenu);

    isi.append(
        piala,
        labelLevel,
        judul,
        bintangEl,
        labelSkor,
        lingkaran,
        statistik,
        catatan,
        tombol
    );

    kartu.append(dekorasi, isi);
    overlay.appendChild(kartu);
    container.appendChild(overlay);

    // Animasi penghitungan skor.
    let currentScore = 0;
    const durasi = 1200;
    const mulai = performance.now();

    startContinuousConfetti();

    const timerSkor = setInterval(() => {
        const elapsed = performance.now() - mulai;
        const progress = Math.min(1, elapsed / durasi);

        currentScore = Math.round(skor * progress);

        if (skorEl.isConnected) {
            skorEl.textContent = String(currentScore);
        }

        if (progress >= 1) {
            clearInterval(timerSkor);
            skorEl.textContent = String(skor);
        }
    }, 30);
}

// ==========================================================
// 8. MENGAMBIL SESSION UNTUK MODAL
// ==========================================================

function getSessionModal() {
    if (
        typeof LENTERA_SESSION !== "undefined" &&
        LENTERA_SESSION
    ) {
        return LENTERA_SESSION;
    }

    return null;
}

// ==========================================================
// SELESAI MODAL.JS
// ==========================================================
