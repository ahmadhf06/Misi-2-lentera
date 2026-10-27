// ==========================================
// GAME ENGINE LENTERA - NUMERASI INTERAKTIF
// ==========================================

let currentLevel = 1;
let currentQuestionIndex = 0;
let currentQuestionsList = [];
let userInputStr = "";

// ---------- SISTEM PENILAIAN ----------
const POIN_AWAL = 100;       // poin awal tiap level
const POIN_SALAH = 5;        // pengurangan poin tiap jawaban salah
const BATAS_BINTANG_2 = 50;  // poin di bawah 50  = 1 bintang
const BATAS_BINTANG_3 = 80;  // poin di bawah 80  = 2 bintang, 80 ke atas = 3 bintang

let skorSaatIni = POIN_AWAL;
let jumlahSalah = 0;
let modalAktif = false;      // mencegah tombol ditekan berulang saat popup tampil

function hitungBintang(skor) {
  if (skor < BATAS_BINTANG_2) return 1;
  if (skor < BATAS_BINTANG_3) return 2;
  return 3;
}

// Tampilkan poin di header (animasi merah singkat saat poin berkurang)
function updateTampilanSkor(berkurang) {
  const el = document.getElementById('skor-nilai');
  if (!el) return;
  el.innerText = skorSaatIni;
  if (berkurang) {
    el.classList.add('text-rose-600');
    setTimeout(() => el.classList.remove('text-rose-600'), 700);
  }
}

// Jumlah digit jawaban mengikuti kunci jawaban soal aktif
// (1 digit = 1 kotak, 2 digit = 2 kotak, 3 digit = 3 kotak)
function getMaxDigits() {
  const q = currentQuestionsList[currentQuestionIndex];
  if (!q) return 1;
  return String(q.kunciJawaban).length;
}

// Mulai permainan berdasarkan level yang dipilih
function startLevel(level) {
  currentLevel = level;
  currentQuestionIndex = 0;
  userInputStr = "";
  skorSaatIni = POIN_AWAL;
  jumlahSalah = 0;
  modalAktif = false;
  updateTampilanSkor(false);

  if (typeof soalBank !== 'undefined' && soalBank[level]) {
    currentQuestionsList = soalBank[level];
  } else {
    currentQuestionsList = [];
  }

  const levelScreen = document.getElementById('level-select-screen');
  const gameScreen = document.getElementById('game-screen');

  if (levelScreen) levelScreen.classList.add('hidden');
  if (gameScreen) {
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('flex');
  }

  const levelTag = document.getElementById('level-tag');
  const headerBadge = document.getElementById('header-badge');
  if (levelTag) levelTag.innerText = `Level ${level}`;
  if (headerBadge) headerBadge.innerText = `Level ${level} · Petualangan`;

  loadQuestion();
}

// Kembali ke menu pemilihan level
function backToMenu() {
  const levelScreen = document.getElementById('level-select-screen');
  const gameScreen = document.getElementById('game-screen');

  if (gameScreen) {
    gameScreen.classList.remove('flex');
    gameScreen.classList.add('hidden');
  }
  if (levelScreen) levelScreen.classList.remove('hidden');

  userInputStr = "";
  modalAktif = false;
}

// Muat soal aktif saat ini
function loadQuestion() {
  userInputStr = "";
  if (!currentQuestionsList || currentQuestionsList.length === 0) {
    console.warn("Bank soal belum siap atau kosong.");
    return;
  }

  const q = currentQuestionsList[currentQuestionIndex];

  const teksSoalEl = document.getElementById('teks-soal');
  const soalIndexEl = document.getElementById('soal-index');
  const totalSoalEl = document.getElementById('total-soal');

  if (teksSoalEl) teksSoalEl.innerHTML = q.teksSoal;
  if (soalIndexEl) soalIndexEl.innerText = currentQuestionIndex + 1;
  if (totalSoalEl) totalSoalEl.innerText = currentQuestionsList.length;

  const progressPercent = ((currentQuestionIndex + 1) / currentQuestionsList.length) * 100;
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  const labelBox1 = document.getElementById('label-box-1');
  const labelBox2 = document.getElementById('label-box-2');
  const labelVal1 = document.getElementById('label-val-1');
  const labelVal2 = document.getElementById('label-val-2');

  if (labelBox1) labelBox1.innerText = q.label1 || "Kelompok A";
  if (labelBox2) labelBox2.innerText = q.label2 || "Kelompok B";
  if (labelVal1) labelVal1.innerText = q.val1;
  if (labelVal2) labelVal2.innerText = q.val2;

  renderVisualObjects('container-visual-1', q.val1, q);
  renderVisualObjects('container-visual-2', q.val2, q);

  const lumiHint = document.getElementById('lumi-hint');
  if (lumiHint) {
    lumiHint.innerHTML = `<span class="font-bold">Lumi:</span> ${q.hint}`;
  }

  updateAnswerSlots();
  renderKeypad();
}

// Render objek bantu hitung: pakai gambar, kalau gagal dimuat pakai ikon Font Awesome
function renderVisualObjects(containerId, count, q) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const MAKS = 40;
  const renderCount = Math.min(count, MAKS);

  for (let i = 0; i < renderCount; i++) {
    let el;

    if (q.gambar) {
      el = document.createElement('img');
      el.src = q.gambar;
      el.alt = q.label1 || 'objek';
      el.className = 'item-gambar';
      el.style.animationDelay = `${i * 30}ms`;
      el.onerror = () => {
        const fallback = document.createElement('i');
        fallback.className = `fa-solid ${q.icon || 'fa-star'} ${q.color || 'text-teal-500'} text-lg m-0.5`;
        el.replaceWith(fallback);
      };
    } else {
      el = document.createElement('i');
      el.className = `fa-solid ${q.icon || 'fa-star'} ${q.color || 'text-teal-500'} text-lg transition-transform hover:scale-125 m-0.5`;
    }

    container.appendChild(el);
  }

  // Jika jumlah lebih dari 40 (misal Level 5), tampilkan keterangan sisanya
  if (count > MAKS) {
    const lebih = document.createElement('span');
    lebih.className = 'item-lebih';
    lebih.innerText = `+${count - MAKS} lagi`;
    container.appendChild(lebih);
  }
}

// Update tampilan kotak slot jawaban (jumlah kotak mengikuti jumlah digit jawaban)
function updateAnswerSlots() {
  const wrapper = document.getElementById('slot-jawaban-wrapper');
  if (!wrapper) return;

  const cleanStr = userInputStr.replace(/[^0-9]/g, '');
  const jumlahSlot = getMaxDigits();

  const ukuran = jumlahSlot === 1 ? 'w-24 h-24 text-5xl' : 'w-20 h-20 text-4xl';

  let slotHtml = '';
  for (let i = 0; i < jumlahSlot; i++) {
    const digit = cleanStr.length > i ? cleanStr[i] : '?';
    const terisi = digit !== '?';
    slotHtml += `
      <div class="${ukuran} ${terisi ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center shadow-inner transition-all">${digit}</div>
    `;
  }

  wrapper.innerHTML = `
    <div class="flex items-center justify-center gap-3 my-2">
      ${slotHtml}
    </div>
  `;
}

// Render tombol keypad angka (0-9) interaktif
function renderKeypad() {
  const keypad = document.getElementById('keypad');
  if (!keypad) return;
  keypad.innerHTML = "";

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  keys.forEach(key => {
    const btn = document.createElement('button');
    btn.type = "button";
    btn.className = "keypad-btn py-3.5 bg-slate-100 hover:bg-teal-100 hover:text-teal-700 font-black text-lg rounded-2xl transition shadow-sm active:scale-95 flex items-center justify-center text-slate-700 cursor-pointer";
    btn.innerText = key;

    btn.onclick = function () {
      handleKeypadInput(key);
    };

    keypad.appendChild(btn);
  });
}

// Logika saat tombol angka ditekan atau di-trigger sensor
function handleKeypadInput(num) {
  const cleanNum = String(num).replace(/[^0-9]/g, '');
  const maxDigits = getMaxDigits();

  if (userInputStr.length < maxDigits && cleanNum !== "") {
    userInputStr += cleanNum;
    updateAnswerSlots();
  }
}

// Tombol HAPUS: menghapus satu angka terakhir dari jawaban
function hapusAngka() {
  if (modalAktif) return;
  if (userInputStr.length > 0) {
    userInputStr = userInputStr.slice(0, -1);
    updateAnswerSlots();
  }
}

// Tombol PERIKSA: memeriksa jawaban (jawaban harus terisi lengkap dulu)
function periksaJawaban() {
  if (modalAktif) return;
  if (!currentQuestionsList || currentQuestionsList.length === 0) return;

  const maxDigits = getMaxDigits();
  if (userInputStr.length < maxDigits) {
    modalAktif = true;
    const pesan = `Isi ${maxDigits} angka dulu ya, baru tekan Periksa. Poinmu tidak berkurang kok.`;
    if (typeof showModalInfo === 'function') {
      showModalInfo('Jawaban Belum Lengkap', pesan, () => { modalAktif = false; });
    } else {
      alert(pesan);
      modalAktif = false;
    }
    return;
  }

  checkAnswer();
}

// Pengecekan jawaban benar atau salah dengan memicu modal meriah
function checkAnswer() {
  if (!currentQuestionsList || currentQuestionsList.length === 0) return;

  const q = currentQuestionsList[currentQuestionIndex];
  const userAnswer = parseInt(userInputStr, 10);
  modalAktif = true;

  if (userAnswer === q.kunciJawaban) {
    const lanjut = () => {
      modalAktif = false;
      currentQuestionIndex++;
      if (currentQuestionIndex < currentQuestionsList.length) {
        loadQuestion();
      } else {
        const hasil = {
          skor: skorSaatIni,
          salah: jumlahSalah,
          bintang: hitungBintang(skorSaatIni)
        };
        if (typeof showModalSelesaiLevel === 'function') {
          modalAktif = true;
          showModalSelesaiLevel(currentLevel, hasil);
        } else {
          backToMenu();
        }
      }
    };

    if (typeof showModalBenar === 'function') {
      showModalBenar(lanjut);
    } else {
      alert("Benar!");
      lanjut();
    }
  } else {
    // Jawaban salah: poin berkurang
    skorSaatIni = Math.max(0, skorSaatIni - POIN_SALAH);
    jumlahSalah++;
    updateTampilanSkor(true);

    const ulangi = () => {
      modalAktif = false;
      userInputStr = "";
      updateAnswerSlots();
    };

    if (typeof showModalSalah === 'function') {
      showModalSalah(ulangi, skorSaatIni, POIN_SALAH);
    } else {
      alert("Salah, coba lagi! Poin -" + POIN_SALAH);
      ulangi();
    }
  }
}

function getCurrentQuestion() {
  if (!currentQuestionsList || currentQuestionsList.length === 0) return null;
  return currentQuestionsList[currentQuestionIndex];
}