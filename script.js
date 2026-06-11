// ==========================================
// 1. Relationship Timer Logic
// ==========================================
const DEFAULT_START_DATE = "2024-01-29T00:00:00";
let startDate = localStorage.getItem("relationshipStartDate");
if (startDate === "2024-06-01T00:00:00" || !startDate) {
  startDate = DEFAULT_START_DATE;
  localStorage.setItem("relationshipStartDate", DEFAULT_START_DATE);
}

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const editDateBtn = document.getElementById("editDateBtn");
const datePickerContainer = document.getElementById("datePickerContainer");
const startDateInput = document.getElementById("startDateInput");
const saveDateBtn = document.getElementById("saveDateBtn");

function updateTimer() {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now - start;

  if (diffMs < 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  const days = Math.floor(diffHours / 24);
  const hours = diffHours % 24;
  const minutes = diffMins % 60;
  const seconds = diffSecs % 60;

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

// Initialize date input
startDateInput.value = startDate.split("T")[0];

editDateBtn.addEventListener("click", () => {
  datePickerContainer.classList.toggle("hidden");
});

saveDateBtn.addEventListener("click", () => {
  const newDateVal = startDateInput.value;
  if (newDateVal) {
    startDate = `${newDateVal}T00:00:00`;
    localStorage.setItem("relationshipStartDate", startDate);
    datePickerContainer.classList.add("hidden");
    updateTimer();
  }
});

setInterval(updateTimer, 1000);
updateTimer();


// ==========================================
// 2. Audio Player Logic
// ==========================================
const bgMusic = document.getElementById("bgMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const cassettePlayer = document.getElementById("cassettePlayer");

bgMusic.volume = 0.35;

playPauseBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      cassettePlayer.classList.add("playing");
    }).catch(err => {
      console.log("Audio play failed or was blocked:", err);
    });
  } else {
    bgMusic.pause();
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    cassettePlayer.classList.remove("playing");
  }
});


// ==========================================
// 2.5 Welcome Intro Overlay Handler (Autoplay Bypass)
// ==========================================
const introOverlay = document.getElementById("introOverlay");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  // Just transition the overlay out without starting the music yet
  introOverlay.style.opacity = "0";
  setTimeout(() => {
    introOverlay.style.display = "none";
  }, 1000);
  
  // Clean enter heart burst
  setTimeout(() => {
    triggerHeartBurst(25, window.innerWidth / 2, window.innerHeight / 2);
  }, 200);
});


// ==========================================
// 3. Grayscale Photo Slideshow Logic
// ==========================================
const sliderImages = document.querySelectorAll(".slider-img");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function nextSlide() {
  if (sliderImages.length <= 1) return;
  
  sliderImages[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  
  currentSlide = (currentSlide + 1) % sliderImages.length;
  
  sliderImages[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

let slideInterval = setInterval(nextSlide, 3500);

dots.forEach(dot => {
  dot.addEventListener("click", (e) => {
    clearInterval(slideInterval);
    const index = parseInt(e.target.getAttribute("data-index"));
    
    sliderImages[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    
    currentSlide = index;
    
    sliderImages[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
    
    slideInterval = setInterval(nextSlide, 3500);
  });
});


// ==========================================
// 4. Floating Hearts Background & Confetti
// ==========================================
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Heart {
  constructor(x, y, size, speedX, speedY, opacity, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.opacity = opacity;
    this.color = color || "rgba(90, 143, 118, 0.15)"; // Soft sage green by default
    this.rotation = Math.random() * Math.PI;
    this.rotSpeed = (Math.random() - 0.5) * 0.015;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    
    ctx.beginPath();
    const d = this.size;
    ctx.moveTo(0, -d / 2);
    ctx.bezierCurveTo(d / 2, -d, d, -d / 3, 0, d);
    ctx.bezierCurveTo(-d, -d / 3, -d / 2, -d, 0, -d / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    
    if (this.opacity > 0.005) {
      this.opacity -= 0.002;
    }
  }
}

function spawnAmbientHeart() {
  if (hearts.length < 35 && Math.random() < 0.04) {
    const x = Math.random() * canvas.width;
    const y = canvas.height + 20;
    const size = Math.random() * 10 + 6;
    const speedX = (Math.random() - 0.5) * 0.4;
    const speedY = -(Math.random() * 0.8 + 0.4);
    const opacity = Math.random() * 0.22 + 0.06;
    
    const colors = [
      "rgba(90, 143, 118, 0.15)",  // Leaf Green (Blume)
      "rgba(212, 140, 140, 0.15)", // Soft Rose (Blume)
      "rgba(28, 26, 23, 0.1)"      // Soft Charcoal
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    hearts.push(new Heart(x, y, size, speedX, speedY, opacity, color));
  }
}

function triggerHeartBurst(count, sourceX, sourceY) {
  const x = sourceX || canvas.width / 2;
  const y = sourceY || canvas.height / 2;
  
  const colors = [
    "rgba(90, 143, 118, 0.7)",   // Leaf Green
    "rgba(212, 140, 140, 0.7)",   // Rose
    "rgba(28, 26, 23, 0.65)"      // Dark Charcoal
  ];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5 + 1.5;
    const size = Math.random() * 14 + 8;
    const speedX = Math.cos(angle) * velocity;
    const speedY = Math.sin(angle) * velocity - 1.5;
    const opacity = 0.9;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    hearts.push(new Heart(x, y, size, speedX, speedY, opacity, color));
  }
}

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spawnAmbientHeart();
  
  hearts = hearts.filter(heart => {
    heart.update();
    heart.draw();
    return heart.y > -50 && heart.opacity > 0.01 && heart.x > -50 && heart.x < canvas.width + 50;
  });
  
  requestAnimationFrame(animateBackground);
}
requestAnimationFrame(animateBackground);


// ==========================================
// 5. Declaration of Love & Floating Texts
// ==========================================
const btnRakNongNanny = document.getElementById("btnRakNongNanny");
const loveTextContainer = document.getElementById("loveTextContainer");
let loveSpawningInterval = null;

const lovePhrases = [
  "รักน้องเเนน",
  "khaotang rak nanny"
];

function spawnFloatingText(text) {
  const el = document.createElement("div");
  el.className = "floating-love-text";
  el.textContent = text;

  // Random horizontal position (5% to 85% to avoid cutoffs)
  const left = Math.random() * 80 + 10;
  
  // Randomize styling properties for organic/playful blume style
  const size = Math.random() * 1.5 + 1.2; // 1.2rem to 2.7rem
  const rotStart = Math.random() * 40 - 20; // -20deg to 20deg
  const rotEnd = rotStart + (Math.random() * 30 - 15); // drift rotation
  const delay = Math.random() * 0.15;
  const duration = Math.random() * 3 + 2.5; // 2.5 to 5.5s
  
  const colors = [
    "var(--accent-rose)",
    "var(--accent-green)",
    "var(--text-primary)",
    "#E25C5C", // warm love red
    "#E28F5C"  // warm orange
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  el.style.left = `${left}%`;
  el.style.bottom = `-10%`; // start just below viewport
  el.style.fontSize = `${size}rem`;
  el.style.color = color;
  el.style.setProperty('--rot-start', `${rotStart}deg`);
  el.style.setProperty('--rot-end', `${rotEnd}deg`);
  el.style.animationDelay = `${delay}s`;
  el.style.animationDuration = `${duration}s`;

  loveTextContainer.appendChild(el);

  // Remove element after animation completes
  setTimeout(() => {
    el.remove();
  }, (duration + delay) * 1000);
}

function startLoveFlood() {
  // Spawn initial burst
  for (let i = 0; i < 20; i++) {
    const phrase = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
    setTimeout(() => {
      spawnFloatingText(phrase);
    }, Math.random() * 800);
  }

  // Setup continuous spawning if not already running
  if (!loveSpawningInterval) {
    loveSpawningInterval = setInterval(() => {
      const phrase = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
      spawnFloatingText(phrase);
    }, 180);
  }
}

btnRakNongNanny.addEventListener("click", (e) => {
  // 1. Play Music and activate cassette player
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      cassettePlayer.classList.add("playing");
    }).catch(err => {
      console.log("Audio autoplay failed on button click:", err);
    });
  }

  // 2. Trigger Canvas Heart Burst
  const rect = btnRakNongNanny.getBoundingClientRect();
  triggerHeartBurst(35, rect.left + rect.width / 2, rect.top + rect.height / 2);
  
  // Also trigger center bursts
  setTimeout(() => {
    triggerHeartBurst(25, window.innerWidth / 2, window.innerHeight / 2);
  }, 150);

  // 3. Start love flood text spawning
  startLoveFlood();
  
  // 4. Add temporary pop effect on button
  btnRakNongNanny.style.transform = "scale(0.92)";
  setTimeout(() => {
    btnRakNongNanny.style.transform = "";
  }, 100);
});



// ==========================================
// 7. Scroll-Driven Animations Fallback
// ==========================================
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
  console.log("Scroll-driven animations not supported natively. Setting up IntersectionObserver.");
  
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: Array.from({ length: 21 }, (_, i) => i / 20)
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const ratio = entry.intersectionRatio;
      if (ratio > 0) {
        entry.target.style.opacity = ratio;
        entry.target.style.transform = `translateY(${30 - (30 * ratio)}px) scale(${0.97 + (0.03 * ratio)})`;
      } else {
        entry.target.style.opacity = 0;
        entry.target.style.transform = `translateY(30px) scale(0.97)`;
      }
    });
  }, observerOptions);

  document.querySelectorAll('.blume-card').forEach(card => {
    card.style.animation = "none";
    card.style.opacity = 0;
    card.style.transform = "translateY(30px) scale(0.97)";
    observer.observe(card);
  });
}
