let currentLevel = 1;
let currentQuestionIdx = 0;
let startTime = Date.now();
let attemptCount = 0;
let userInputStr = "";
let confettiInterval = null;

// Fungsi untuk Menghentikan dan Membersihkan Konfeti
function stopConfetti() {
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }
  document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
}

// Fungsi untuk Memulai Level dari Menu Utama
function startLevel(levelNum) {
  stopConfetti(); // Bersihkan konfeti jika ada yang tersisa
  currentLevel = levelNum;
  currentQuestionIdx = 0;
  
  const levelSelect = document.getElementById('level-select-screen');
  const gameScreen = document.getElementById('game-screen');

  if (levelSelect) {
    levelSelect.classList.add('hidden');
    levelSelect.classList.remove('flex');
  }
  
  if (gameScreen) {
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('flex');
  }

  const badges = {
    1: "Level 1 · Nilai Tempat",
    2: "Level 2 · Pengurangan",
    3: "Level 3 · Kombinasi ±"
  };
  
  const headerBadge = document.getElementById('header-badge');
  if (headerBadge) {
    headerBadge.innerText = badges[levelNum] || "Level";
  }

  loadQuestion(currentLevel, currentQuestionIdx);
}

// Fungsi Kembali ke Menu Utama
function backToMenu() {
  stopConfetti(); // Berhenti total dan bersihkan konfeti saat kembali ke menu
  
  const levelSelect = document.getElementById('level-select-screen');
  const gameScreen = document.getElementById('game-screen');

  if (gameScreen) {
    gameScreen.classList.add('hidden');
    gameScreen.classList.remove('flex');
  }

  if (levelSelect) {
    levelSelect.classList.remove('hidden');
    levelSelect.classList.add('flex');
  }
}

function loadQuestion(level, idx) {
  const bank = bankSoalPerLevel[level];
  if (!bank || !bank[idx]) return;
  
  const q = bank[idx];
  startTime = Date.now();
  attemptCount = 0;
  userInputStr = "";

  const soalIdxEl = document.getElementById('soal-index');
  const totalSoalEl = document.getElementById('total-soal');
  const progressBar = document.getElementById('progress-bar');
  const levelTag = document.getElementById('level-tag');
  const teksSoal = document.getElementById('teks-soal');
  const lumiHint = document.getElementById('lumi-hint');

  if (soalIdxEl) soalIdxEl.innerText = idx + 1;
  if (totalSoalEl) totalSoalEl.innerText = bank.length;
  if (progressBar) progressBar.style.width = `${((idx + 1) / bank.length) * 100}%`;
  if (levelTag) levelTag.innerText = `Level ${q.level}`;
  if (teksSoal) teksSoal.innerHTML = q.teksSoal;
  if (lumiHint) lumiHint.innerHTML = `<span class="font-bold">Lumi:</span> ${q.hint}`;

  // RENDER VISUAL OBJEK
  if (level === 1) {
    const lbl1 = document.getElementById('label-box-1');
    const lbl2 = document.getElementById('label-box-2');
    if (lbl1) lbl1.innerText = "PULUHAN";
    if (lbl2) lbl2.innerText = "SATUAN";

    const container1 = document.getElementById('container-visual-1');
    if (container1) {
      container1.innerHTML = '';
      for (let i = 0; i < q.puluhan; i++) {
        container1.innerHTML += `<div class="w-3.5 h-24 bg-teal-500 rounded-full mx-1 shadow-sm"></div>`;
      }
    }
    const val1 = document.getElementById('label-val-1');
    if (val1) val1.innerText = q.puluhan;

    const container2 = document.getElementById('container-visual-2');
    if (container2) {
      container2.innerHTML = '';
      for (let i = 0; i < q.satuan; i++) {
        container2.innerHTML += `<div class="w-7 h-7 bg-teal-400 rounded-lg m-1 shadow-sm"></div>`;
      }
    }
    const val2 = document.getElementById('label-val-2');
    if (val2) val2.innerText = q.satuan;
  } else {
    const lbl1 = document.getElementById('label-box-1');
    const lbl2 = document.getElementById('label-box-2');
    if (lbl1) lbl1.innerText = q.label1 || "Kelompok A";
    if (lbl2) lbl2.innerText = q.label2 || "Kelompok B";

    const container1 = document.getElementById('container-visual-1');
    if (container1) {
      container1.innerHTML = '';
      for (let i = 0; i < q.val1; i++) {
        container1.innerHTML += `<i class="fa-solid ${q.icon} ${q.color} text-3xl m-1"></i>`;
      }
    }
    const val1 = document.getElementById('label-val-1');
    if (val1) val1.innerText = q.val1;

    const container2 = document.getElementById('container-visual-2');
    if (container2) {
      container2.innerHTML = '';
      const renderCount2 = q.type === "kombinasi" ? q.val3 : q.val2;
      for (let i = 0; i < renderCount2; i++) {
        container2.innerHTML += `<i class="fa-solid ${q.icon} text-slate-400 text-3xl m-1"></i>`;
      }
    }
    const val2 = document.getElementById('label-val-2');
    if (val2) val2.innerText = q.type === "kombinasi" ? q.val3 : q.val2;
  }

  updateAnswerSlots();
  renderKeypad();
}

function updateAnswerSlots() {
  const wrapper = document.getElementById('slot-jawaban-wrapper');
  if (!wrapper) return;
  
  if (currentLevel === 1) {
    const digit1 = userInputStr.length > 0 ? userInputStr[0] : '?';
    const digit2 = userInputStr.length > 1 ? userInputStr[1] : '?';

    wrapper.innerHTML = `
      <div class="flex items-center justify-center gap-3 my-2">
        <div class="w-20 h-20 ${digit1 !== '?' ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
          ${digit1}
        </div>
        <div class="w-20 h-20 ${digit2 !== '?' ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
          ${digit2}
        </div>
      </div>
    `;
  } else {
    const digit = userInputStr.length > 0 ? userInputStr[0] : '?';
    wrapper.innerHTML = `
      <div class="flex items-center justify-center gap-3 my-2">
        <div class="w-24 h-20 ${digit !== '?' ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
          ${digit}
        </div>
      </div>
    `;
  }
}

function renderKeypad() {
  const keypad = document.getElementById('keypad');
  if (!keypad) return;
  
  keypad.innerHTML = '';
  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.className = "keypad-btn h-12 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-slate-700 font-bold text-xl rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center relative overflow-hidden";
    btn.dataset.num = i;
    btn.innerText = i;
    btn.onclick = () => handleKeypadInput(i);
    keypad.appendChild(btn);
  }
}

function handleKeypadInput(num) {
  if (currentLevel === 1) {
    userInputStr += num.toString();
    if (userInputStr.length > 2) {
      userInputStr = num.toString();
    }
    updateAnswerSlots();

    if (userInputStr.length === 2) {
      setTimeout(() => submitAnswer(parseInt(userInputStr)), 300);
    }
  } else {
    userInputStr = num.toString();
    updateAnswerSlots();
    setTimeout(() => submitAnswer(parseInt(userInputStr)), 300);
  }
}

async function submitAnswer(finalNum) {
  const bank = bankSoalPerLevel[currentLevel];
  if (!bank) return;
  
  const q = bank[currentQuestionIdx];
  const isCorrect = (finalNum === q.kunciJawaban);
  const responseTimeSec = Math.round((Date.now() - startTime) / 1000);

  const payload = {
    ssoToken: ssoToken,
    item_id: q.id,
    kompetensi: q.kompetensi,
    level: q.level,
    is_correct: isCorrect,
    error_code: isCorrect ? null : "ERR_CALCULATION",
    response_time_seconds: responseTimeSec,
    used_hint: attemptCount > 1
  };

  try {
    await fetch(API_EVENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("API Local Mode: Logged locally.");
  }

  if (isCorrect) {
    showCustomModal(true, `Hebat! Jawabanmu tepat. Lenteramu semakin terang! ✨`, () => {
      currentQuestionIdx++;
      if (currentQuestionIdx < bank.length) {
        loadQuestion(currentLevel, currentQuestionIdx);
      } else {
        // Berlaku untuk SEMUA LEVEL (1, 2, dan 3) ketika selesai
        showLevelCompleteModal100();
      }
    });
  } else {
    attemptCount++;
    showCustomModal(false, "Masih kurang tepat. Coba hitung kembali ya!", () => {
      userInputStr = "";
      updateAnswerSlots();
    });
  }
}

// Pop-up Heboh Selesai Level (Berlaku untuk Level 1, 2, & 3 + Efek Konfeti Loop)
function showLevelCompleteModal100() {
  const modal = document.getElementById('custom-modal');
  const card = document.getElementById('modal-card');
  const iconContainer = document.getElementById('modal-icon-container');
  const title = document.getElementById('modal-title');
  const message = document.getElementById('modal-message');
  const btn = document.getElementById('modal-btn');

  if (!modal || !card) return;

  card.className = "bg-gradient-to-b from-amber-50 to-white rounded-3xl shadow-2xl border-4 border-amber-400 max-w-lg w-full p-8 text-center transform scale-100 transition-all duration-300 relative overflow-hidden";
  
  if (iconContainer) {
    iconContainer.className = "w-24 h-24 mx-auto mb-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-4xl shadow-lg animate-bounce";
    iconContainer.innerHTML = `<i class="fa-solid fa-trophy"></i>`;
  }

  if (title) {
    title.className = "text-3xl font-black mb-2 text-amber-600 tracking-wide";
    title.innerText = `🎉 SELAMAT! LEVEL ${currentLevel} SELESAI! 🌟`;
  }

  if (message) {
    message.innerHTML = `
      <div class="bg-amber-100 border border-amber-300 rounded-2xl p-4 mb-4 relative z-10">
        <p class="text-4xl font-black text-amber-700 mb-1">NILAI: 100</p>
        <p class="text-sm font-bold text-amber-900">Luar biasa! Kamu berhasil menuntaskan seluruh soal di Level ${currentLevel} dengan SEMPURNA! 🚀✨</p>
      </div>
      <p class="text-slate-600 text-xs font-medium relative z-10">Lenteramu kini menyala semakin terang di desa petualangan!</p>
    `;
  }

  if (btn) {
    btn.className = "modal-action-btn w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl hover:from-amber-600 hover:to-orange-600 transition active:scale-95 flex items-center justify-center gap-2 relative z-10";
    btn.innerHTML = `<i class="fa-solid fa-house-chimney"></i> PILIH MENU LEVEL`;

    btn.onclick = () => {
      stopConfetti();
      closeCustomModal();
      backToMenu();
    };
  }

  modal.classList.remove('hidden');

  startConfettiRain();
  if (confettiInterval) clearInterval(confettiInterval);
  confettiInterval = setInterval(() => {
    startConfettiRain();
  }, 1500);
}

// Fungsi Pembuat Animasi Konfeti Jatuh Berjatuhan (Looping)
function startConfettiRain() {
  const colors = ['#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];
  const confettiCount = 35;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    confetti.style.position = 'fixed';
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.top = `-20px`;
    confetti.style.width = `${Math.random() * 10 + 6}px`;
    confetti.style.height = `${Math.random() * 6 + 4}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.zIndex = '99999';
    confetti.style.borderRadius = '2px';
    confetti.style.pointerEvents = 'none';

    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 0.5;
    
    confetti.style.transition = `transform ${duration}s linear ${delay}s, top ${duration}s ease-in ${delay}s, opacity ${duration}s ease ${delay}s`;
    
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.top = `${window.innerHeight + 50}px`;
      confetti.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      confetti.remove();
    }, (duration + delay) * 1000);
  }
}