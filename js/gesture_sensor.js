
 // ==========================================
 // GESTURE SENSOR - TOUCHLESS LENTERA
 // Telunjuk = menggerakkan kursor | Tangan mengepal = klik
 // ==========================================

 // ---------- PENGATURAN ----------
 const KLIK_DENGAN_KEPAL = true;
 const KLIK_DENGAN_TAHAN = false;
 const HOVER_DURATION = 1000;

 const RASIO_LURUS = 1.45;
 const RASIO_TEKUK = 1.15;
 const FRAME_KEPAL = 3;
 const FRAME_LEPAS = 3;
 const JEDA_KLIK_MS = 700;

 const ALPHA_LAMBAT = 0.15;
 const ALPHA_CEPAT = 0.65;
 const JARAK_CEPAT_PX = 120;
 const ZONA_MATI_PX = 4;
 const MARGIN_KAMERA = 0.1;
 const DEBUG_GESTUR = false;

 // ---------- STATE ----------
 let handHoverTarget = null;
 let hoverTimer = null;

 let kursorX = null;
 let kursorY = null;
 let frameKepal = 0;
 let frameLepas = 0;
 let sudahKlik = false;
 let waktuKlikTerakhir = 0;

 const videoElement = document.getElementById('webcam-video');
 const canvasElement = document.getElementById('gesture-canvas');
 const canvasCtx = canvasElement
     ? canvasElement.getContext('2d')
     : null;

 const virtualCursor = document.getElementById('virtual-cursor');
 const gestureStatus = document.getElementById('gesture-status');

 // ==========================================
 // 1. INISIALISASI MEDIAPIPE HANDS
 // ==========================================

 if (typeof Hands !== 'undefined' && videoElement) {
     const hands = new Hands({
         locateFile: (file) =>
             `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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
                 await hands.send({
                     image: videoElement
                 });
             },
             width: 320,
             height: 240
         });

         camera.start().catch(err => {
             console.warn(
                 "Kamera tidak diizinkan atau tidak ditemukan:",
                 err
             );

             if (gestureStatus) {
                 gestureStatus.innerText = "• Kamera Nonaktif";
             }
         });
     }
 }

 // ==========================================
 // 2. ANALISIS POSISI TANGAN
 // ==========================================

 function jarak(a, b) {
     const w =
         (videoElement && videoElement.videoWidth) || 320;

     const h =
         (videoElement && videoElement.videoHeight) || 240;

     return Math.hypot(
         (a.x - b.x) * w,
         (a.y - b.y) * h
     );
 }

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

     const lainTertekuk = [
         rasio.tengah,
         rasio.manis,
         rasio.kelingking
     ].filter(r => r <= RASIO_TEKUK).length;

     return {
         rasio,

         telunjukLurus:
             rasio.telunjuk >= RASIO_LURUS,

         kepal:
             rasio.telunjuk <= RASIO_TEKUK &&
             lainTertekuk >= 2
     };
 }

 function petakan(nilai) {
     const m = MARGIN_KAMERA;

     return Math.min(
         1,
         Math.max(0, (nilai - m) / (1 - 2 * m))
     );
 }

 function haluskanKursor(targetX, targetY) {
     if (kursorX === null) {
         kursorX = targetX;
         kursorY = targetY;
         return;
     }

     const dx = targetX - kursorX;
     const dy = targetY - kursorY;
     const jarakPx = Math.hypot(dx, dy);

     if (jarakPx < ZONA_MATI_PX) return;

     const t = Math.min(
         1,
         jarakPx / JARAK_CEPAT_PX
     );

     const alpha =
         ALPHA_LAMBAT +
         (ALPHA_CEPAT - ALPHA_LAMBAT) * t;

     kursorX += dx * alpha;
     kursorY += dy * alpha;
 }

 // ==========================================
 // 3. HANDLER DETEKSI TANGAN
 // ==========================================

 function onHandResults(results) {
     if (!canvasCtx || !canvasElement) return;

     const lebarAsli =
         results.image.videoWidth || results.image.width;

     const tinggiAsli =
         results.image.videoHeight || results.image.height;

     if (
         lebarAsli &&
         tinggiAsli &&
         (
             canvasElement.width !== lebarAsli ||
             canvasElement.height !== tinggiAsli
         )
     ) {
         canvasElement.width = lebarAsli;
         canvasElement.height = tinggiAsli;
     }

     canvasCtx.save();

     canvasCtx.clearRect(
         0,
         0,
         canvasElement.width,
         canvasElement.height
     );

     canvasCtx.drawImage(
         results.image,
         0,
         0,
         canvasElement.width,
         canvasElement.height
     );

     if (
         results.multiHandLandmarks &&
         results.multiHandLandmarks.length > 0
     ) {
         const landmarks =
             results.multiHandLandmarks[0];

         if (
             typeof drawConnectors !== 'undefined' &&
             typeof HAND_CONNECTIONS !== 'undefined'
         ) {
             drawConnectors(
                 canvasCtx,
                 landmarks,
                 HAND_CONNECTIONS,
                 {
                     color: '#a855f7',
                     lineWidth: 2
                 }
             );

             drawLandmarks(
                 canvasCtx,
                 landmarks,
                 {
                     color: '#ec4899',
                     lineWidth: 1,
                     radius: 3
                 }
             );
         }

         const posisi = bacaPosisiTangan(landmarks);

         // Telunjuk lurus menggerakkan kursor.
         if (posisi.telunjukLurus) {
             const tip = landmarks[8];

             const targetX =
                 petakan(1 - tip.x) * window.innerWidth;

             const targetY =
                 petakan(tip.y) * window.innerHeight;

             haluskanKursor(targetX, targetY);

             updateVirtualCursor(kursorX, kursorY);

             processCursorHover(kursorX, kursorY);

         } else if (
             virtualCursor &&
             kursorX !== null
         ) {
             virtualCursor.classList.remove('hidden');
         }

         // Mengepal berarti klik.
         if (KLIK_DENGAN_KEPAL) {
             if (posisi.kepal) {
                 frameKepal++;
                 frameLepas = 0;

                 gayaKursor(true);

                 const sekarang = Date.now();

                 if (
                     !sudahKlik &&
                     frameKepal >= FRAME_KEPAL &&
                     sekarang - waktuKlikTerakhir >
                         JEDA_KLIK_MS
                 ) {
                     klikDiPosisiKursor();

                     sudahKlik = true;
                     waktuKlikTerakhir = sekarang;
                 }

             } else {
                 frameKepal = 0;

                 gayaKursor(false);

                 if (posisi.telunjukLurus) {
                     frameLepas++;

                     if (frameLepas >= FRAME_LEPAS) {
                         sudahKlik = false;
                     }
                 }
             }
         }

         // Status kamera.
         if (gestureStatus) {
             let teks;

             if (posisi.kepal) {
                 teks = "• Mengepal (Klik)";
             } else if (posisi.telunjukLurus) {
                 teks = "• Menunjuk";
             } else {
                 teks = "• Tangan Terdeteksi";
             }

             if (DEBUG_GESTUR) {
                 teks +=
                     ` T:${posisi.rasio.telunjuk.toFixed(2)}` +
                     ` M:${posisi.rasio.tengah.toFixed(2)}`;
             }

             gestureStatus.innerText = teks;
         }

     } else {
         // Tidak ada tangan yang terdeteksi.
         if (virtualCursor) {
             virtualCursor.classList.add('hidden');
         }

         clearHoverTimer();
         gayaKursor(false);

         kursorX = null;
         kursorY = null;
         frameKepal = 0;
         frameLepas = 0;
         sudahKlik = false;

         if (gestureStatus) {
             gestureStatus.innerText =
                 "• Memindai Tangan...";
         }
     }

     canvasCtx.restore();
 }

 // ==========================================
 // 4. KURSOR VIRTUAL
 // ==========================================

 function updateVirtualCursor(x, y) {
     if (!virtualCursor) return;

     virtualCursor.classList.remove('hidden');

     virtualCursor.style.left = `${x}px`;
     virtualCursor.style.top = `${y}px`;
 }

 function gayaKursor(sedangKepal) {
     if (!virtualCursor) return;

     if (sedangKepal) {
         virtualCursor.style.borderColor = '#10b981';

         virtualCursor.style.backgroundColor =
             'rgba(16, 185, 129, 0.45)';

         virtualCursor.style.transform =
             'translate(-50%, -50%) scale(0.7)';

     } else {
         virtualCursor.style.borderColor = '';
         virtualCursor.style.backgroundColor = '';
         virtualCursor.style.transform = '';
     }
 }

 // ==========================================
 // 5. MEMILIH TARGET INTERAKTIF
 // ==========================================

 function cariTarget(x, y) {
     const element = document.elementFromPoint(x, y);

     if (!element) return null;

     const target = element.closest(
         'button, .level-card, .modal-action-btn, [onclick]'
     );

     if (!target) return null;

     // PERUBAHAN UTAMA:
     // Level yang dikunci tidak bisa dipilih dengan gestur.
     if (
         target.classList.contains('level-card') &&
         (
             target.dataset.locked === 'true' ||
             target.getAttribute('aria-disabled') === 'true'
         )
     ) {
         return null;
     }

     // Abaikan tombol yang dinonaktifkan.
     if (
         target.disabled ||
         target.getAttribute('aria-disabled') === 'true'
     ) {
         return null;
     }

     return target;
 }

 // ==========================================
 // 6. SOROTAN DAN KLIK GESTUR
 // ==========================================

 function processCursorHover(x, y) {
     const targetBtn = cariTarget(x, y);

     if (targetBtn) {
         if (handHoverTarget !== targetBtn) {
             clearHoverTimer();

             handHoverTarget = targetBtn;

             targetBtn.classList.add(
                 'ring-4',
                 'ring-green-400',
                 'scale-105'
             );

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

 function klikDiPosisiKursor() {
     if (kursorX === null || kursorY === null) {
         return;
     }

     const target = cariTarget(kursorX, kursorY);

     if (target) {
         executeGestureClick(target);
         clearHoverTimer();
     }
 }

 function executeGestureClick(target) {
     if (!target) return;

     // Validasi ulang sebelum mengeksekusi klik.
     if (
         target.classList.contains('level-card') &&
         (
             target.dataset.locked === 'true' ||
             target.getAttribute('aria-disabled') === 'true'
         )
     ) {
         return;
     }

     if (
         target.disabled ||
         target.getAttribute('aria-disabled') === 'true'
     ) {
         return;
     }

     target.classList.add('scale-95');

     setTimeout(() => {
         target.classList.remove('scale-95');
     }, 200);

     // Tombol angka keypad.
     if (target.classList.contains('keypad-btn')) {
         const rawText = target.innerText.trim();

         const cleanNum =
             rawText.replace(/[^0-9]/g, '');

         if (
             cleanNum !== "" &&
             typeof handleKeypadInput === 'function'
         ) {
             handleKeypadInput(cleanNum);
         } else {
             target.click();
         }

     } else {
         // Level, Hapus, Periksa, dan tombol modal.
         target.click();
     }
 }

 function clearHoverTimer() {
     if (hoverTimer) {
         clearTimeout(hoverTimer);
         hoverTimer = null;
     }

     if (handHoverTarget) {
         handHoverTarget.classList.remove(
             'ring-4',
             'ring-green-400',
             'scale-105'
         );

         handHoverTarget = null;
     }
 }
