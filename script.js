"use strict";
const $ = (id) => document.getElementById(id);
const birthday = new Date(2026, 10, 22, 0, 0, 0);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateCountdown() {
  const diff = birthday.getTime() - Date.now();
  if (diff <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => { $(id).textContent = "00"; });
    $("countdownNote").textContent = "النهارده يومك يا نور الدين! كل سنة وأنت طيب 🎉";
    return;
  }
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
  Object.entries(values).forEach(([id, value]) => { $(id).textContent = String(value).padStart(2, "0"); });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Music: attempt autoplay, then resume after the visitor's first interaction if the browser blocks it.
const audio = $("birthdayAudio");
const musicButton = $("musicToggle");
const musicLabel = $("musicLabel");
function syncMusicButton() {
  const playing = !audio.paused;
  musicButton.setAttribute("aria-pressed", String(playing));
  musicLabel.textContent = playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى";
}
audio.addEventListener("play", syncMusicButton);
audio.addEventListener("pause", syncMusicButton);
audio.addEventListener("error", () => {
  musicLabel.textContent = "الصوت غير متاح";
  musicButton.title = "تأكد من وجود birthday.mp3 بجوار index.html";
});
async function startMusic() {
  if (!audio.paused) return true;
  try {
    await audio.play();
    syncMusicButton();
    return true;
  } catch {
    syncMusicButton();
    return false;
  }
}
startMusic();
let triedGesture = false;
async function resumeAfterGesture(event) {
  if (musicButton.contains(event.target) || triedGesture || !audio.paused) return;
  triedGesture = true;
  const started = await startMusic();
  if (started) {
    window.removeEventListener("pointerdown", resumeAfterGesture);
    window.removeEventListener("keydown", resumeAfterGesture);
  } else {
    triedGesture = false;
  }
}
window.addEventListener("pointerdown", resumeAfterGesture);
window.addEventListener("keydown", resumeAfterGesture);
musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    const ok = await startMusic();
    if (!ok) musicLabel.textContent = "تعذر تشغيل الصوت";
  } else {
    audio.pause();
  }
});

// Open and close the birthday letter.
const giftButton = $("giftButton");
const letter = $("letter");
giftButton.addEventListener("click", () => {
  const open = letter.hidden;
  letter.hidden = !open;
  giftButton.setAttribute("aria-expanded", String(open));
  giftButton.querySelector(".gift-box").textContent = open ? "💝" : "🎁";
  giftButton.querySelector(".gift-label").textContent = open ? "اضغط لإغلاق الرسالة" : "اضغط لفتح الهدية";
  if (open) {
    if (!reduceMotion) launchConfetti(130);
    letter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }
});

// Gallery lightbox.
const lightbox = $("lightbox");
const lightboxImage = $("lightboxImage");
const lightboxClose = $("lightboxClose");
let lastFocused = null;
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  if (lastFocused) lastFocused.focus();
}
document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    lastFocused = card;
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector("img").alt;
    lightbox.hidden = false;
    lightboxClose.focus();
  });
});
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

// Wish button and celebration effects.
$("wishButton").addEventListener("click", () => {
  $("wishResult").textContent = "يا رب تكون سنة كلها خير ونجاح وأخبار حلوة يا نور! ✨";
  if (!reduceMotion) launchConfetti(170);
});

// Share the page using the native share sheet when available.
$("shareButton").addEventListener("click", async () => {
  const data = {
    title: "عيد ميلاد سعيد يا نور الدين",
    text: "كل سنة وأنت طيب يا نور الدين! 🎂✨",
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      $("shareButton").textContent = "تم نسخ الرابط ✓";
    } else {
      window.prompt("انسخ رابط الموقع:", window.location.href);
    }
  } catch (error) {
    if (error.name !== "AbortError") window.prompt("انسخ رابط الموقع:", window.location.href);
  }
});

// Lightweight gold confetti.
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();
function launchConfetti(amount = 120) {
  const colors = ["#e8ca7b", "#c69c43", "#fff0bd", "#a98237", "#f7e5b1"];
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * .35,
      vx: (Math.random() - .5) * 4,
      vy: 2 + Math.random() * 4,
      size: 3 + Math.random() * 5,
      rotation: Math.random() * 6,
      spin: (Math.random() - .5) * .18,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 150 + Math.random() * 100
    });
  }
}
function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.life > 0 && p.y < window.innerHeight + 30);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += .025;
    p.rotation += p.spin;
    p.life--;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .65);
    ctx.restore();
  }
  window.requestAnimationFrame(animateConfetti);
}
if (!reduceMotion) animateConfetti();
