// ==========================================
// GAME ENGINE LENTERA - NUMERASI INTERAKTIF
// ==========================================

let currentLevel = 1;
let currentQuestionIndex = 0;
let currentQuestionsList = [];
let userInputStr = "";

// Mulai permainan berdasarkan level yang dipilih
function startLevel(level) {
  currentLevel = level;
  currentQuestionIndex = 0;
  userInputStr = "";
  
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

  renderVisualObjects('container-visual-1', q.val1, q.icon || 'fa-star', q.color || 'text-teal-500');
  renderVisualObjects('container-visual-2', q.val2, q.icon || 'fa-star', q.color || 'text-teal-500');

  const lumiHint = document.getElementById('lumi-hint');
  if (lumiHint) {
    lumiHint.innerHTML = `<span class="font-bold">Lumi:</span> ${q.hint}`;
  }

  updateAnswerSlots();
  renderKeypad();
}

// Render ikon visual objek bantu hitung secara detail
function renderVisualObjects(containerId, count, iconClass, colorClass) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const renderCount = Math.min(count, 40);
  for (let i = 0; i < renderCount; i++) {
    const icon = document.createElement('i');
    icon.className = `fa-solid ${iconClass} ${colorClass} text-lg transition-transform hover:scale-125 m-0.5`;
    container.appendChild(icon);
  }
}

// Update tampilan kotak slot jawaban (1 kotak khusus Level 1, 2 kotak untuk Level 2-4)
function updateAnswerSlots() {
  const wrapper = document.getElementById('slot-jawaban-wrapper');
  if (!wrapper) return;
  
  const cleanStr = userInputStr.replace(/[^0-9]/g, '');

  if (currentLevel === 1) {
    const digit1 = cleanStr.length > 0 ? cleanStr[0] : '?';
    wrapper.innerHTML = `
      <div class="flex items-center justify-center gap-3 my-2">
        <div class="w-24 h-24 ${digit1 !== '?' ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center text-5xl shadow-inner transition-all">${digit1}</div>
      </div>
    `;
  } else {
    const digit1 = cleanStr.length > 0 ? cleanStr[0] : '?';
    const digit2 = cleanStr.length > 1 ? cleanStr[1] : '?';
    wrapper.innerHTML = `
      <div class="flex items-center justify-center gap-3 my-2">
        <div class="w-20 h-20 ${digit1 !== '?' ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-all">${digit1}</div>
        <div class="w-20 h-20 ${digit2 !== '?' ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold' : 'bg-slate-50 border-dashed border-teal-400 text-slate-300'} border-2 rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-all">${digit2}</div>
      </div>
    `;
  }
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
    
    btn.onclick = function() {
      handleKeypadInput(key);
    };
    
    keypad.appendChild(btn);
  });
}

// Logika saat tombol angka ditekan atau di-trigger sensor
function handleKeypadInput(num) {
  const cleanNum = String(num).replace(/[^0-9]/g, '');
  const maxDigits = (currentLevel === 1) ? 1 : 2;

  if (userInputStr.length < maxDigits && cleanNum !== "") {
    userInputStr += cleanNum;
    updateAnswerSlots();
    
    if (userInputStr.length === maxDigits) {
      setTimeout(() => {
        checkAnswer();
      }, 300);
    }
  }
}

// Pengecekan jawaban benar atau salah dengan memicu modal meriah
function checkAnswer() {
  if (!currentQuestionsList || currentQuestionsList.length === 0) return;
  
  const q = currentQuestionsList[currentQuestionIndex];
  const userAnswer = parseInt(userInputStr, 10);

  if (userAnswer === q.kunciJawaban) {
    if (typeof showModalBenar === 'function') {
      showModalBenar(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestionsList.length) {
          loadQuestion();
        } else {
          if (typeof showModalSelesaiLevel === 'function') {
            showModalSelesaiLevel(currentLevel);
          } else {
            backToMenu();
          }
        }
      });
    } else {
      alert("Benar!");
      currentQuestionIndex++;
      if (currentQuestionIndex < currentQuestionsList.length) loadQuestion();
      else backToMenu();
    }
  } else {
    if (typeof showModalSalah === 'function') {
      showModalSalah(() => {
        userInputStr = "";
        updateAnswerSlots();
      });
    } else {
      alert("Salah, coba lagi!");
      userInputStr = "";
      updateAnswerSlots();
    }
  }
}

function getCurrentQuestion() {
  if (!currentQuestionsList || currentQuestionsList.length === 0) return null;
  return currentQuestionsList[currentQuestionIndex];
}