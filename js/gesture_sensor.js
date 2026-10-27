// ==========================================
// GESTURE SENSOR - TOUCHLESS LENTERA
// Telunjuk = menggerakkan kursor | Tangan mengepal = klik
// ==========================================

// ---------- PENGATURAN (ubah di sini jika perlu menyesuaikan) ----------
const KLIK_DENGAN_KEPAL = true;   // true = klik dengan mengepalkan tangan
const KLIK_DENGAN_TAHAN = false;  // true = tahan kursor 1 detik juga ikut mengklik (cadangan)
const HOVER_DURATION = 1000;      // lama tahan (ms) jika KLIK_DENGAN_TAHAN = true

const RASIO_LURUS = 1.45;   // rasio jari >= ini dianggap LURUS (turunkan jika telunjuk sulit terdeteksi lurus)
const RASIO_TEKUK = 1.15;   // rasio jari <= ini dianggap TERTEKUK (naikkan jika kepalan sulit terdeteksi)
const FRAME_KEPAL = 3;      // berapa frame berturut-turut kepalan harus terdeteksi sebelum klik
const FRAME_LEPAS = 3;      // berapa frame telunjuk harus lurus lagi sebelum boleh klik berikutnya
const JEDA_KLIK_MS = 700;   // jeda minimal antar klik (ms)
const KEHALUSAN = 0.5;      // 0-1, makin kecil makin halus tapi makin lambat mengikuti jari
const DEBUG_GESTUR = false; // true = tampilkan angka rasio jari di label kamera (untuk penyetelan)

// ---------- STATE ----------
let handHoverTarget = null;
let hoverTimer = null;

let kursorX = null;   // posisi kursor terakhir (sudah dihaluskan); null = belum ada
let kursorY = null;
let frameKepal = 0;
let frameLepas = 0;
let sudahKlik = false;
let waktuKlikTerakhir = 0;

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

// ---------- ANALISIS POSISI TANGAN ----------

// Jarak dua titik landmark (dikoreksi sesuai rasio lebar x tinggi video)
function jarak(a, b) {
  const w = (videoElement && videoElement.videoWidth) || 320;
  const h = (videoElement && videoElement.videoHeight) || 240;
  return Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
}

// Rasio = jarak ujung jari ke pergelangan / jarak pangkal jari ke pergelangan
// Jari lurus -> rasio besar (sekitar 1,8 - 2,2). Jari tertekuk -> rasio kecil (sekitar 0,8 - 1,1).
function rasioJari(lm, pangkal, ujung) {
  const dasar = jarak(lm[pangkal], lm[0]);
  if (dasar === 0) return 0;
  return jarak(lm[ujung], lm[0]) / dasar;
}

function bacaPosisiTangan(lm) {
  const rasio = {
    telunjuk: rasioJari(lm, 5, 8),
    tengah: rasioJari(lm, 9, 12),
    manis: rasioJari(lm, 13, 16),
    kelingking: rasioJari(lm, 17, 20)
  };

  const lainTertekuk = [rasio.tengah, rasio.manis, rasio.kelingking]
    .filter(r => r <= RASIO_TEKUK).length;

  return {
    rasio,
    // Telunjuk lurus -> kursor boleh bergerak
    telunjukLurus: rasio.telunjuk >= RASIO_LURUS,
    // Kepalan: telunjuk tertekuk dan minimal 2 dari 3 jari lain juga tertekuk
    kepal: rasio.telunjuk <= RASIO_TEKUK && lainTertekuk >= 2
  };
}

// ---------- HANDLER DETEKSI TANGAN ----------
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

    const posisi = bacaPosisiTangan(landmarks);

    // 1) Telunjuk lurus -> gerakkan kursor mengikuti ujung telunjuk (landmark 8).
    //    Saat jari mulai menekuk/mengepal, kursor DITAHAN di posisi terakhir
    //    supaya klik tidak meleset ke tempat lain.
    if (posisi.telunjukLurus) {
      const tip = landmarks[8];
      const targetX = (1 - tip.x) * window.innerWidth;
      const targetY = tip.y * window.innerHeight;

      if (kursorX === null) {
        kursorX = targetX;
        kursorY = targetY;
      } else {
        kursorX += (targetX - kursorX) * KEHALUSAN;
        kursorY += (targetY - kursorY) * KEHALUSAN;
      }

      updateVirtualCursor(kursorX, kursorY);
      processCursorHover(kursorX, kursorY);
    } else if (virtualCursor && kursorX !== null) {
      // Tetap tampilkan kursor di posisi terakhir
      virtualCursor.classList.remove('hidden');
    }

    // 2) Kepalan -> klik (sekali per kepalan)
    if (KLIK_DENGAN_KEPAL) {
      if (posisi.kepal) {
        frameKepal++;
        frameLepas = 0;
        gayaKursor(true);

        const sekarang = Date.now();
        if (!sudahKlik && frameKepal >= FRAME_KEPAL &&
            sekarang - waktuKlikTerakhir > JEDA_KLIK_MS) {
          klikDiPosisiKursor();
          sudahKlik = true;
          waktuKlikTerakhir = sekarang;
        }
      } else {
        frameKepal = 0;
        gayaKursor(false);
        if (posisi.telunjukLurus) {
          frameLepas++;
          if (frameLepas >= FRAME_LEPAS) sudahKlik = false; // siap klik lagi
        }
      }
    }

    // Label status
    if (gestureStatus) {
      let teks;
      if (posisi.kepal) teks = "• Mengepal (Klik)";
      else if (posisi.telunjukLurus) teks = "• Menunjuk";
      else teks = "• Tangan Terdeteksi";

      if (DEBUG_GESTUR) {
        teks += ` T:${posisi.rasio.telunjuk.toFixed(2)} M:${posisi.rasio.tengah.toFixed(2)}`;
      }
      gestureStatus.innerText = teks;
    }
  } else {
    // Tangan tidak terlihat: reset semua
    if (virtualCursor) virtualCursor.classList.add('hidden');
    clearHoverTimer();
    gayaKursor(false);
    kursorX = null;
    kursorY = null;
    frameKepal = 0;
    frameLepas = 0;
    sudahKlik = false;
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

// Tampilan kursor: hijau & mengecil saat mengepal
function gayaKursor(sedangKepal) {
  if (!virtualCursor) return;
  if (sedangKepal) {
    virtualCursor.style.borderColor = '#10b981';
    virtualCursor.style.backgroundColor = 'rgba(16, 185, 129, 0.45)';
    virtualCursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
  } else {
    virtualCursor.style.borderColor = '';
    virtualCursor.style.backgroundColor = '';
    virtualCursor.style.transform = '';
  }
}

// ---------- SOROTAN & KLIK ----------

// Cari elemen interaktif di bawah kursor
function cariTarget(x, y) {
  const element = document.elementFromPoint(x, y);
  if (!element) return null;
  // Mendukung kartu level, keypad, tombol Hapus/Periksa, tombol pop-up, dan elemen ber-onclick
  return element.closest('button, .level-card, .modal-action-btn, [onclick]');
}

// Beri sorotan hijau pada tombol yang ditunjuk (dan timer tahan 1 detik jika diaktifkan)
function processCursorHover(x, y) {
  const targetBtn = cariTarget(x, y);

  if (targetBtn) {
    if (handHoverTarget !== targetBtn) {
      clearHoverTimer();
      handHoverTarget = targetBtn;
      targetBtn.classList.add('ring-4', 'ring-green-400', 'scale-105');

      if (KLIK_DENGAN_TAHAN) {
        hoverTimer = setTimeout(() => {
          executeGestureClick(targetBtn);
          clearHoverTimer();
        }, HOVER_DURATION);
      }
    }
  } else {
    clearHoverTimer();
  }
}

// Klik pada posisi kursor terakhir (dipanggil saat tangan mengepal)
function klikDiPosisiKursor() {
  if (kursorX === null || kursorY === null) return;

  const target = cariTarget(kursorX, kursorY);
  if (target) {
    executeGestureClick(target);
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
    // Kartu pemilihan level, tombol Hapus/Periksa, dan tombol modal
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