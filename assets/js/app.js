"use strict";

// ===== Konfigurasi undangan =====
const WEDDING_DATE = new Date("2026-10-25T08:00:00+07:00");
const STORAGE_KEY = "laras-bagas-rsvp-v3";

// Membuat waktu dummy agar selalu berada maksimal tujuh hari terakhir.
function createDummyTime(daysAgo, hour, minute) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const initialGreetings = [
  {
    name: "Keluarga Budi Santoso",
    attendance: "Hadir",
    guests: 2,
    message:
      "Selamat menempuh hidup baru. Semoga menjadi keluarga sakinah, mawaddah, warahmah.",
    time: createDummyTime(6, 9, 30),
  },
  {
    name: "Nadia Prameswari",
    attendance: "Hadir",
    guests: 1,
    message: "Ikut berbahagia untuk Laras dan Bagas. Lancar sampai hari H!",
    time: createDummyTime(3, 18, 45),
  },
  {
    name: "Rizky Mahendra",
    attendance: "Masih Ragu",
    guests: 0,
    message: "InsyaAllah hadir. Semoga semua persiapan dilancarkan.",
    time: createDummyTime(1, 14, 10),
  },
];

let activeFilter = "Semua";
let greetings = loadGreetings();
let toast;
let backgroundMusic;
let musicToggle;

function loadGreetings() {
  try {
    const savedGreetings = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedGreetings) ? savedGreetings : initialGreetings;
  } catch {
    return initialGreetings;
  }
}

function saveGreetings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(greetings));
}

function showToast(message) {
  document.getElementById("toastText").textContent = message;
  toast.show();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===== Countdown =====
function updateCountdown() {
  const remaining = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  const units = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };

  Object.entries(units).forEach(([id, value]) => {
    document.getElementById(id).textContent = String(value).padStart(2, "0");
  });
}

// ===== RSVP dan ucapan =====
function renderGreetings() {
  const visibleGreetings = greetings.filter((greeting) => {
    return activeFilter === "Semua" || greeting.attendance === activeFilter;
  });
  const messageContainer = document.getElementById("guestMessages");
  const stats = { Hadir: 0, "Masih Ragu": 0, "Tidak Hadir": 0 };

  greetings.forEach((greeting) => {
    if (Object.hasOwn(stats, greeting.attendance)) {
      stats[greeting.attendance] += 1;
    }
  });

  document.getElementById("presentCount").textContent = stats.Hadir;
  document.getElementById("maybeCount").textContent = stats["Masih Ragu"];
  document.getElementById("absentCount").textContent = stats["Tidak Hadir"];

  if (!visibleGreetings.length) {
    messageContainer.innerHTML =
      '<p class="empty-state">Belum ada ucapan pada kategori ini.</p>';
    return;
  }

  messageContainer.innerHTML = visibleGreetings
    .map((greeting) => {
      const guestText =
        greeting.attendance === "Hadir" ? ` · ${greeting.guests} orang` : "";
      return `
      <article class="py-3 border-bottom">
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h4 class="h6 mb-1">${escapeHtml(greeting.name)}</h4>
            <p class="guest-message small text-secondary mb-1">${escapeHtml(greeting.message)}</p>
            <small class="text-secondary">${escapeHtml(greeting.time)}</small>
          </div>
          <span class="badge text-bg-light border text-dark fw-normal text-nowrap">
            ${escapeHtml(greeting.attendance)}${guestText}
          </span>
        </div>
      </article>`;
    })
    .join("");
}

function toggleGuestCount() {
  const isAbsent =
    document.getElementById("attendance").value === "Tidak Hadir";
  document
    .getElementById("guestCountGroup")
    .classList.toggle("d-none", isAbsent);
}

function handleRsvpSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const attendance = document.getElementById("attendance").value;
  greetings.unshift({
    name: document.getElementById("guestName").value.trim(),
    attendance,
    guests:
      attendance === "Hadir"
        ? Number(document.getElementById("guestCount").value)
        : 0,
    message: document.getElementById("message").value.trim(),
    time: new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date()),
  });

  saveGreetings();
  form.reset();
  activeFilter = "Semua";
  setActiveFilterButton();
  toggleGuestCount();
  renderGreetings();
  showToast("Terima kasih, konfirmasi dan ucapan Anda sudah tersimpan.");
}

function setActiveFilterButton() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === activeFilter);
  });
}

// ===== Utilitas halaman =====
function setGuestNameFromUrl() {
  const guestFromUrl = new URLSearchParams(window.location.search).get("to");
  if (!guestFromUrl) return;

  document.getElementById("coverGuestName").textContent = guestFromUrl;
  document.getElementById("guestName").value = guestFromUrl;
}

async function copyAccountNumber(accountNumber) {
  try {
    await navigator.clipboard.writeText(accountNumber);
    showToast("Nomor rekening berhasil disalin.");
  } catch {
    showToast(
      "Tidak dapat menyalin otomatis. Silakan salin nomor rekening secara manual.",
    );
  }
}

// ===== Backsound =====
function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "Jeda musik" : "Putar musik",
  );
  musicToggle.innerHTML = isPlaying
    ? '<i class="bi bi-pause-fill" aria-hidden="true"></i><span>Jeda</span>'
    : '<i class="bi bi-volume-up-fill" aria-hidden="true"></i><span>Musik</span>';
}

async function playMusic(showError = true) {
  try {
    await backgroundMusic.play();
    updateMusicButton();
  } catch {
    if (showError) {
      showToast(
        "Musik tidak dapat diputar. Tekan tombol Musik untuk mencoba lagi.",
      );
    }
  }
}

function toggleMusic() {
  if (backgroundMusic.paused) {
    playMusic();
    return;
  }

  backgroundMusic.pause();
  updateMusicButton();
}

function bindEvents() {
  document
    .getElementById("openInvitationButton")
    .addEventListener("click", () => {
      document.getElementById("invitationCover").classList.add("is-hidden");
      playMusic();
    });

  musicToggle.addEventListener("click", toggleMusic);

  document
    .getElementById("attendance")
    .addEventListener("change", toggleGuestCount);
  document
    .getElementById("rsvpForm")
    .addEventListener("submit", handleRsvpSubmit);

  document.querySelectorAll(".copy-account").forEach((button) => {
    button.addEventListener("click", () =>
      copyAccountNumber(button.dataset.account),
    );
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      setActiveFilterButton();
      renderGreetings();
    });
  });
}

// Menambahkan animasi sederhana saat bagian halaman mulai terlihat.
function setupScrollReveal() {
  const revealTargets = document.querySelectorAll(
    ".quote-section, .person-card, .event-card, .gift-card, .rsvp-card, .story-step",
  );

  revealTargets.forEach((element) => element.classList.add("reveal-item"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  revealTargets.forEach((element) => observer.observe(element));
}

function initializePage() {
  toast = new bootstrap.Toast(document.getElementById("notificationToast"));
  backgroundMusic = document.getElementById("backgroundMusic");
  musicToggle = document.getElementById("musicToggle");
  backgroundMusic.volume = 0.35;
  setGuestNameFromUrl();
  bindEvents();
  setupScrollReveal();
  updateMusicButton();
  playMusic(false);
  toggleGuestCount();
  renderGreetings();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", initializePage);
