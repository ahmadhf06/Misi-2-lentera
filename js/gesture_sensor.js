let hoveredTarget = null;
let hoverStartTime = 0;
const DWELL_TIME_MS = 1000; // Tahan 1 detik untuk klik otomatis

let currentX = window.innerWidth / 2;
let currentY = window.innerHeight / 2;
const SMOOTHING_FACTOR = 0.15; 

function initMediaPipeHands() {
  const videoElement = document.getElementById('webcam-video');
  const canvasElement = document.getElementById('gesture-canvas');
  const canvasCtx = canvasElement.getContext('2d');
  const statusElement = document.getElementById('gesture-status');
  const cursor = document.getElementById('virtual-cursor');

  function onResults(results) {
    canvasElement.width = videoElement.videoWidth || 320;
    canvasElement.height = videoElement.videoHeight || 240;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      statusElement.innerText = "• Tangan Terdeteksi!";
      statusElement.className = "absolute bottom-1 left-1 bg-purple-950/80 px-1.5 py-0.5 rounded text-[9px] text-purple-300 border border-purple-800/50";
      cursor.classList.remove('hidden');

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#a855f7', lineWidth: 2.5});
        drawLandmarks(canvasCtx, landmarks, {color: '#c084fc', lineWidth: 1, radius: 3.5});

        const indexTip = landmarks[8];
        const targetX = (1 - indexTip.x) * window.innerWidth;
        const targetY = indexTip.y * window.innerHeight;

        currentX += (targetX - currentX) * SMOOTHING_FACTOR;
        currentY += (targetY - currentY) * SMOOTHING_FACTOR;

        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;

        let currentHovered = null;
        let targetIdentifier = null;

        const modal = document.getElementById('custom-modal');
        const isModalOpen = modal && !modal.classList.contains('hidden');

        const levelSelectScreen = document.getElementById('level-select-screen');
        const isLevelSelectOpen = levelSelectScreen && !levelSelectScreen.classList.contains('hidden');

        if (isModalOpen) {
          const modalBtn = document.getElementById('modal-btn');
          if (modalBtn) {
            const rect = modalBtn.getBoundingClientRect();
            if (currentX >= rect.left && currentX <= rect.right && currentY >= rect.top && currentY <= rect.bottom) {
              currentHovered = modalBtn;
              targetIdentifier = "MODAL_BTN";
            }
          }
        } else if (isLevelSelectOpen) {
          const levelCards = document.querySelectorAll('.level-card');
          levelCards.forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            if (currentX >= rect.left && currentX <= rect.right && currentY >= rect.top && currentY <= rect.bottom) {
              currentHovered = card;
              targetIdentifier = "LEVEL_" + (idx + 1);
            }
          });
        } else {
          document.querySelectorAll('.keypad-btn').forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (currentX >= rect.left && currentX <= rect.right && currentY >= rect.top && currentY <= rect.bottom) {
              currentHovered = btn;
              targetIdentifier = "NUM_" + btn.dataset.num;
            }
          });
        }

        if (currentHovered) {
          if (hoveredTarget === targetIdentifier) {
            const elapsed = Date.now() - hoverStartTime;
            cursor.style.borderColor = '#10b981';
            
            if (elapsed >= DWELL_TIME_MS) {
              if (isModalOpen) {
                closeCustomModal(); 
              } else if (isLevelSelectOpen) {
                const lvlNum = parseInt(targetIdentifier.split('_')[1]);
                startLevel(lvlNum);
              } else {
                handleKeypadInput(parseInt(currentHovered.dataset.num)); 
              }
              hoveredTarget = null;
              cursor.style.borderColor = '#f59e0b';
            }
          } else {
            hoveredTarget = targetIdentifier;
            hoverStartTime = Date.now();
          }
        } else {
          hoveredTarget = null;
          cursor.style.borderColor = '#f59e0b';
        }
      }
    } else {
      statusElement.innerText = "• Arahkan Tangan ke Kamera";
      statusElement.className = "absolute bottom-1 left-1 bg-purple-950/80 px-1.5 py-0.5 rounded text-[9px] text-amber-300 border border-purple-800/50";
      cursor.classList.add('hidden');
      hoveredTarget = null;
    }
    canvasCtx.restore();
  }

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  hands.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 320,
    height: 240
  });

  camera.start()
    .then(() => {
      statusElement.innerText = "• Kamera Aktif";
    })
    .catch(err => {
      console.error("Gagal kamera MediaPipe:", err);
      statusElement.innerText = "• Error Kamera";
    });
}

window.addEventListener('load', () => {
  initMediaPipeHands();
});