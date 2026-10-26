let modalCallback = null;

function showCustomModal(isCorrect, message, callback) {
  const modal = document.getElementById('custom-modal');
  const modalCard = document.getElementById('modal-card');
  const iconContainer = document.getElementById('modal-icon-container');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');
  const btnEl = document.getElementById('modal-btn');

  modalCallback = callback;
  modal.classList.remove('hidden');
  setTimeout(() => modalCard.classList.remove('scale-95'), 10);

  if (isCorrect) {
    iconContainer.className = "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-lg bg-emerald-100 text-emerald-600";
    iconContainer.innerHTML = "🎉";
    titleEl.innerText = "Hebat, Raka! ✨";
    titleEl.className = "text-2xl font-black mb-2 text-emerald-700";
    btnEl.className = "modal-action-btn w-full py-3.5 rounded-2xl font-bold text-white shadow-lg transition active:scale-95 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30";
    btnEl.innerText = "Lanjut Misi Berikutnya ➔";
  } else {
    iconContainer.className = "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-lg bg-rose-100 text-rose-600";
    iconContainer.innerHTML = "💡";
    titleEl.innerText = "Kurang Tepat, Coba Lagi!";
    titleEl.className = "text-2xl font-black mb-2 text-rose-700";
    btnEl.className = "modal-action-btn w-full py-3.5 rounded-2xl font-bold text-white shadow-lg transition active:scale-95 bg-rose-600 hover:bg-rose-700 shadow-rose-600/30";
    btnEl.innerText = "Coba Hitung Lagi";
  }
  msgEl.innerText = message;
}

function closeCustomModal() {
  const modal = document.getElementById('custom-modal');
  const modalCard = document.getElementById('modal-card');
  modalCard.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
    if (modalCallback) {
      modalCallback();
      modalCallback = null;
    }
  }, 200);
}