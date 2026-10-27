// ==========================================
// MODAL & ANIMASI PERAYAAN - LENTERA
// ==========================================

let confettiInterval = null;

function ensureModalContainer() {
  let container = document.getElementById('lentera-modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'lentera-modal-container';
    document.body.appendChild(container);
  }
  return container;
}

// Fungsi Efek Confetti / Perayaan Berjatuhan Terus-Menerus
function startContinuousConfetti() {
  stopContinuousConfetti();

  const shapes = ['🎉', '✨', '⭐', '🎈', '🎊'];

  confettiInterval = setInterval(() => {
    const confetti = document.createElement('div');
    confetti.className = 'lentera-confetti-item';
    confetti.innerText = shapes[Math.floor(Math.random() * shapes.length)];
    
    confetti.style.position = 'fixed';
    confetti.style.top = '-20px';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.fontSize = (Math.random() * 18 + 16) + 'px';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.transition = 'transform 3s linear, opacity 3s linear';
    
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 3200);
  }, 150);
}

// Fungsi Menghentikan & Membersihkan Efek Confetti
function stopContinuousConfetti() {
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }
  const items = document.querySelectorAll('.lentera-confetti-item');
  items.forEach(el => el.remove());
}

// Pop-up Jawaban Benar
function showModalBenar(onNextCallback) {
  stopContinuousConfetti();
  const container = ensureModalContainer();
  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-emerald-400 text-center transform animate-bounce-short">
        <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          🎉
        </div>
        <h2 class="text-3xl font-black text-slate-800 mb-2">Luar Biasa!</h2>
        <p class="text-slate-600 mb-6 text-lg">Jawaban kamu benar dan tepat sekali!</p>
        <button id="modal-next-btn" class="modal-action-btn w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-lg rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer">
          Lanjut Soal Berikutnya 🚀
        </button>
      </div>
    </div>
  `;

  const btn = document.getElementById('modal-next-btn');
  if (btn) {
    btn.onclick = () => {
      container.innerHTML = "";
      if (typeof onNextCallback === 'function') onNextCallback();
    };
  }
}

// Pop-up Jawaban Salah (menampilkan pengurangan poin)
function showModalSalah(onRetryCallback, sisaPoin, pengurang) {
  stopContinuousConfetti();
  const container = ensureModalContainer();

  const infoPoin = (typeof sisaPoin === 'number')
    ? `<div class="bg-rose-50 border border-rose-200 rounded-2xl py-2 px-3 mb-5">
         <span class="block text-rose-600 font-black text-lg">−${pengurang || 5} poin</span>
         <span class="text-xs font-semibold text-rose-500">Sisa poinmu: ${sisaPoin}</span>
       </div>`
    : '';

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-rose-400 text-center">
        <div class="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          💪
        </div>
        <h2 class="text-3xl font-black text-slate-800 mb-2">Belum Tepat!</h2>
        <p class="text-slate-600 mb-4 text-lg">Ayo perhatikan petunjuk dari Lumi sekali lagi ya.</p>
        ${infoPoin}
        <button id="modal-retry-btn" class="modal-action-btn w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-lg rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer">
          Coba Lagi 🔄
        </button>
      </div>
    </div>
  `;

  const btn = document.getElementById('modal-retry-btn');
  if (btn) {
    btn.onclick = () => {
      container.innerHTML = "";
      if (typeof onRetryCallback === 'function') onRetryCallback();
    };
  }
}

// Pop-up Info (misalnya jawaban belum lengkap, tanpa pengurangan poin)
function showModalInfo(judul, pesan, onCloseCallback) {
  stopContinuousConfetti();
  const container = ensureModalContainer();
  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-amber-400 text-center">
        <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          ✍️
        </div>
        <h2 class="text-2xl font-black text-slate-800 mb-2">${judul}</h2>
        <p class="text-slate-600 mb-6 text-base">${pesan}</p>
        <button id="modal-info-btn" class="modal-action-btn w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer">
          Mengerti 👍
        </button>
      </div>
    </div>
  `;

  const btn = document.getElementById('modal-info-btn');
  if (btn) {
    btn.onclick = () => {
      container.innerHTML = "";
      if (typeof onCloseCallback === 'function') onCloseCallback();
    };
  }
}

// Pop-up Selesai Level: skor akhir, bintang (1-3), dan predikat
function showModalSelesaiLevel(level, hasil) {
  const container = ensureModalContainer();

  // Nilai bawaan jika dipanggil tanpa data hasil
  const skor = hasil && typeof hasil.skor === 'number' ? hasil.skor : 100;
  const salah = hasil && typeof hasil.salah === 'number' ? hasil.salah : 0;
  const bintang = hasil && typeof hasil.bintang === 'number' ? hasil.bintang : 3;

  const dataBintang = {
    3: { judul: 'LUAR BIASA! 🥳', predikat: 'Hebat', catatan: 'Perhitunganmu sangat bagus. Kamu hebat sekali! 🌟' },
    2: { judul: 'BAGUS SEKALI! 😊', predikat: 'Bagus', catatan: 'Sedikit lagi! Coba main lagi untuk dapat 3 bintang. 💪' },
    1: { judul: 'TERUS SEMANGAT! 💪', predikat: 'Semangat', catatan: 'Jangan menyerah. Perhatikan petunjuk Lumi dan coba lagi ya!' }
  };
  const info = dataBintang[bintang] || dataBintang[1];

  let bintangHtml = '';
  for (let i = 1; i <= 3; i++) {
    bintangHtml += i <= bintang
      ? '<span>⭐</span>'
      : '<span class="opacity-25 grayscale">⭐</span>';
  }

  // Jalankan Animasi Berjatuhan Terus Menerus
  startContinuousConfetti();

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">

        <!-- Efek Glow Dekoratif -->
        <div class="absolute -top-10 -left-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

        <div class="relative z-10">
          <!-- Ikon Piala -->
          <div class="text-5xl mb-1 animate-bounce">🏆</div>
          <span class="text-xs font-bold text-amber-600 tracking-widest uppercase">LEVEL ${level} SELESAI</span>
          <h2 class="text-3xl font-black text-slate-800 mt-1 mb-3">${info.judul}</h2>

          <!-- Bintang sesuai nilai -->
          <div class="flex justify-center gap-2 text-3xl mb-4 text-amber-400">
            ${bintangHtml}
          </div>

          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">NILAI KAMU</p>

          <!-- Lingkaran Animasi Skor -->
          <div class="relative w-36 h-36 mx-auto mb-6 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-teal-400 p-1.5 shadow-lg flex items-center justify-center animate-spin-slow">
            <div class="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span id="score-counter" class="text-4xl font-black bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">0</span>
            </div>
          </div>

          <!-- Kotak Detail Info (Jawaban Salah & Predikat) -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
              <span class="block text-xl font-black text-teal-700">${salah}x</span>
              <span class="text-xs font-bold text-teal-600 uppercase tracking-wider">Jawaban Salah</span>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <span class="block text-xl font-black text-amber-700">${info.predikat}</span>
              <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Predikat</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 mb-6 italic">${info.catatan}</p>

          <!-- Tombol Aksi (Main Lagi & Pilih Level) -->
          <div class="flex gap-3">
            <button id="modal-replay-btn" class="modal-action-btn flex-1 py-3.5 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-base rounded-2xl shadow-sm transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2">
              🔄 Main Lagi
            </button>
            <button id="modal-menu-btn" class="modal-action-btn flex-1 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2">
              🚀 Pilih Level
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Efek Hitung Angka (Counter dari 0 ke skor akhir)
  let currentScore = 0;
  const scoreElement = document.getElementById('score-counter');
  const duration = 1500; // Durasi animasi 1.5 detik
  const steps = 50;
  const increment = skor / steps;
  const stepTime = duration / steps;

  const counterTimer = setInterval(() => {
    currentScore += increment;
    if (currentScore >= skor) {
      currentScore = skor;
      clearInterval(counterTimer);
    }
    if (scoreElement) {
      scoreElement.innerText = Math.round(currentScore);
    }
  }, stepTime);

  // Tombol Main Lagi
  const replayBtn = document.getElementById('modal-replay-btn');
  if (replayBtn) {
    replayBtn.onclick = () => {
      clearInterval(counterTimer);
      stopContinuousConfetti();
      container.innerHTML = "";
      if (typeof startLevel === 'function') startLevel(level);
    };
  }

  // Tombol Pilih Level (Kembali ke Menu)
  const menuBtn = document.getElementById('modal-menu-btn');
  if (menuBtn) {
    menuBtn.onclick = () => {
      clearInterval(counterTimer);
      stopContinuousConfetti();
      container.innerHTML = "";
      if (typeof backToMenu === 'function') backToMenu();
    };
  }
}