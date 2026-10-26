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

// Pop-up Jawaban Salah
function showModalSalah(onRetryCallback) {
  stopContinuousConfetti();
  const container = ensureModalContainer();
  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-rose-400 text-center">
        <div class="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          💪
        </div>
        <h2 class="text-3xl font-black text-slate-800 mb-2">Belum Tepat!</h2>
        <p class="text-slate-600 mb-6 text-lg">Ayo perhatikan petunjuk dari Lumi sekali lagi ya.</p>
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

// Pop-up Selesai Level / Skor & Animasi Counter Angka 0-100 (Sesuai Referensi)
function showModalSelesaiLevel(level) {
  const container = ensureModalContainer();
  
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
          <h2 class="text-3xl font-black text-slate-800 mt-1 mb-3">LUAR BIASA! 🥳</h2>
          
          <!-- Tiga Bintang -->
          <div class="flex justify-center gap-2 text-3xl mb-4 text-amber-400">
            ⭐ ⭐ ⭐
          </div>

          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">NILAI KAMU</p>

          <!-- Lingkaran Animasi Skor (Counter 0 - 100) -->
          <div class="relative w-36 h-36 mx-auto mb-6 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-teal-400 p-1.5 shadow-lg flex items-center justify-center animate-spin-slow">
            <div class="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span id="score-counter" class="text-4xl font-black bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">0</span>
            </div>
          </div>
          
          <!-- Kotak Detail Info (Soal Benar & Predikat) -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
              <span class="block text-xl font-black text-teal-700">5/5</span>
              <span class="text-xs font-bold text-teal-600 uppercase tracking-wider">Soal Benar</span>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <span class="block text-xl font-black text-amber-700">Sempurna</span>
              <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Predikat</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 mb-6 italic">Semua kalimatmu tersusun dengan benar. Kamu hebat sekali! 🌟</p>

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

  // Jalankan Efek Hitung Angka (Counter dari 0 ke 100)
  let currentScore = 0;
  const scoreElement = document.getElementById('score-counter');
  const duration = 1500; // Durasi animasi 1.5 detik
  const steps = 50;
  const increment = 100 / steps;
  const stepTime = duration / steps;

  const counterTimer = setInterval(() => {
    currentScore += increment;
    if (currentScore >= 100) {
      currentScore = 100;
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
      stopContinuousConfetti();
      container.innerHTML = "";
      if (typeof startLevel === 'function') startLevel(level);
    };
  }

  // Tombol Pilih Level (Kembali ke Menu)
  const menuBtn = document.getElementById('modal-menu-btn');
  if (menuBtn) {
    menuBtn.onclick = () => {
      stopContinuousConfetti();
      container.innerHTML = "";
      if (typeof backToMenu === 'function') backToMenu();
    };
  }
}