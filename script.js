"use strict";
const byId = (id) => document.getElementById(id);
const birthdayDate = new Date(2026, 10, 22, 0, 0, 0);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Countdown
function updateCountdown() {
  const remaining = birthdayDate.getTime() - Date.now();
  const note = byId("countdownNote");
  if (remaining <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach((id) => { byId(id).textContent = "00"; });
    note.textContent = "النهارده يومك يا نور الدين! كل سنة وأنت طيب 🎉";
    return;
  }
  const units = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  };
  Object.entries(units).forEach(([id, value]) => {
    byId(id).textContent = String(value).padStart(2, "0");
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Music is started only after a clear visitor action because browsers may block autoplay.
const audio = byId("birthdayAudio");
const musicButton = byId("musicToggle");
const musicLabel = byId("musicLabel");

function syncMusicState() {
  const playing = !audio.paused;
  musicButton.setAttribute("aria-pressed", String(playing));
  musicLabel.textContent = playing ? "إيقاف الموسيقى" : "شغّل الموسيقى";
}
audio.addEventListener("play", syncMusicState);
audio.addEventListener("pause", syncMusicState);
audio.addEventListener("error", () => {
  musicLabel.textContent = "الموسيقى غير مضافة";
  musicButton.title = "أضف ملف birthday.mp3 بجوار index.html داخل المستودع";
});
musicButton.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  try {
    await audio.play();
    syncMusicState();
  } catch {
    musicLabel.textContent = "تعذر تشغيل الموسيقى";
  }
});

// Reveal elements gently as they enter the screen.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Gift letter
const giftButton = byId("giftButton");
const letter = byId("letter");
giftButton.addEventListener("click", () => {
  const opening = letter.hidden;
  letter.hidden = !opening;
  giftButton.setAttribute("aria-expanded", String(opening));
  byId("giftLabel").textContent = opening ? "اقفل الرسالة" : "افتح رسالتك";
  giftButton.querySelector(".gift-icon").textContent = opening ? "♥" : "✉";
  if (opening) {
    if (!reducedMotion) launchConfetti(90);
    window.setTimeout(() => letter.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center"
    }), 80);
  }
});

// Wishes and celebration
byId("wishButton").addEventListener("click", () => {
  byId("wishResult").textContent = "يا رب تكون سنة كلها خير ونجاح وأخبار تفرّح قلبك يا نور! ✨";
  if (!reducedMotion) launchConfetti(150);
});

// Native share where available; otherwise copy the page link.
byId("shareButton").addEventListener("click", async () => {
  const shareData = {
    title: "إلى نور الدين — يومك المميز",
    text: "كل سنة وأنت طيب يا نور الدين! 🎂✨",
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      byId("shareButton").innerHTML = "تم نسخ الرابط <span>✓</span>";
    } else {
      window.prompt("انسخ رابط الموقع:", window.location.href);
    }
  } catch (error) {
    if (error.name !== "AbortError") window.prompt("انسخ رابط الموقع:", window.location.href);
  }
});

// Lightweight gold confetti. Animation runs only while particles exist.
const canvas = byId("confetti");
const context = canvas.getContext("2d");
let particles = [];
let animationFrame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

function launchConfetti(amount = 110) {
  const palette = ["#e8ca7b", "#c69c43", "#fff0bd", "#a98237", "#f7e5b1"];
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 3.8,
      vy: 2 + Math.random() * 3.5,
      size: 3 + Math.random() * 4,
      rotation: Math.random() * 6,
      spin: (Math.random() - 0.5) * 0.16,
      color: palette[Math.floor(Math.random() * palette.length)],
      life: 130 + Math.random() * 90
    });
  }
  if (!animationFrame) animationFrame = window.requestAnimationFrame(animateConfetti);
}
function animateConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) =>
    particle.life > 0 && particle.y < window.innerHeight + 25
  );
  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.025;
    particle.rotation += particle.spin;
    particle.life -= 1;
    context.save();
    context.translate(particle.x, particle.y);
    context.rotate(particle.rotation);
    context.fillStyle = particle.color;
    context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.65);
    context.restore();
  }
  if (particles.length) {
    animationFrame = window.requestAnimationFrame(animateConfetti);
  } else {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    animationFrame = 0;
  }
}
