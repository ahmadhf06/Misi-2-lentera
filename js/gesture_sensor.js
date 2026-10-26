// ==========================================
// GESTURE SENSOR - TOUCHLESS LENTERA (LEVEL 1-4)
// ==========================================

let handHoverTarget = null;
let hoverTimer = null;
const HOVER_DURATION = 1000; // Tahan jari 1 detik untuk melakukan klik/pilih

const videoElement = document.getElementById('webcam-video');
const canvasElement = document.getElementById('gesture-canvas');
const canvasCtx = canvasElement ? canvasElement.getContext('2d') : null;
const virtualCursor = document.getElementById('virtual-cursor');
const gestureStatus = document.getElementById('gesture-status');

// Inisialisasi MediaPipe Hands
if (typeof Hands !== 'undefined' && videoElement) {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  hands.onResults(onHandResults);

  if (typeof Camera !== 'undefined') {
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 320,
      height: 240
    });
    camera.start().catch(err => {
      console.warn("Kamera tidak diizinkan atau tidak ditemukan:", err);
      if (gestureStatus) gestureStatus.innerText = "• Kamera Nonaktif";
    });
  }
}

// Handler Deteksi Tangan & Kursor Virtual
function onHandResults(results) {
  if (!canvasCtx || !canvasElement) return;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];

    // Gambar titik penanda tangan
    if (typeof drawConnectors !== 'undefined' && typeof HAND_CONNECTIONS !== 'undefined') {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#a855f7', lineWidth: 2 });
      drawLandmarks(canvasCtx, landmarks, { color: '#ec4899', lineWidth: 1, radius: 3 });
    }

    // Gunakan Ujung Jari Telunjuk (Landmark 8)
    const indexTip = landmarks[8];
    const cursorX = (1 - indexTip.x) * window.innerWidth;
    const cursorY = indexTip.y * window.innerHeight;

    updateVirtualCursor(cursorX, cursorY);
    processCursorHover(cursorX, cursorY);

    if (gestureStatus) gestureStatus.innerText = "• Tangan Terdeteksi";
  } else {
    if (virtualCursor) virtualCursor.classList.add('hidden');
    clearHoverTimer();
    if (gestureStatus) gestureStatus.innerText = "• Memindai Tangan...";
  }

  canvasCtx.restore();
}

// Perbarui Posisi Kursor di Layar
function updateVirtualCursor(x, y) {
  if (!virtualCursor) return;
  virtualCursor.classList.remove('hidden');
  virtualCursor.style.left = `${x}px`;
  virtualCursor.style.top = `${y}px`;
}

// Deteksi Elemen Interaktif di Bawah Kursor (Level 1-4, Keypad, Modal)
function processCursorHover(x, y) {
  const element = document.elementFromPoint(x, y);
  if (!element) {
    clearHoverTimer();
    return;
  }

  // Mendukung kartu level 1-4, tombol keypad, tombol pop-up modal, dan elemen berpemicu onclick
  const targetBtn = element.closest('button, .level-card, .modal-action-btn, [onclick]');

  if (targetBtn) {
    if (handHoverTarget !== targetBtn) {
      clearHoverTimer();
      handHoverTarget = targetBtn;
      targetBtn.classList.add('ring-4', 'ring-green-400', 'scale-105');

      hoverTimer = setTimeout(() => {
        executeGestureClick(targetBtn);
        clearHoverTimer();
      }, HOVER_DURATION);
    }
  } else {
    clearHoverTimer();
  }
}

// Eksekusi Pemicu Klik dari Sensor Gestur
function executeGestureClick(target) {
  if (!target) return;

  // Efek visual klik
  target.classList.add('scale-95');
  setTimeout(() => target.classList.remove('scale-95'), 200);

  // Jika tombol keypad angka
  if (target.classList.contains('keypad-btn')) {
    const rawText = target.innerText.trim();
    const cleanNum = rawText.replace(/[^0-9]/g, '');

    if (cleanNum !== "" && typeof handleKeypadInput === 'function') {
      handleKeypadInput(cleanNum);
    } else {
      target.click();
    }
  } else {
    // Untuk kartu pemilihan level (termasuk Level 4) & tombol modal
    target.click();
  }
}

function clearHoverTimer() {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  if (handHoverTarget) {
    handHoverTarget.classList.remove('ring-4', 'ring-green-400', 'scale-105');
    handHoverTarget = null;
  }
}