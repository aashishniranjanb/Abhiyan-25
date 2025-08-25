document.addEventListener("DOMContentLoaded", () => {
  // === Poster Modal with Slideshow and Controls ===
  const modal = document.getElementById("poster-modal");
  const modalImg = modal.querySelector(".modal-img");
  const caption = document.getElementById("modal-caption");
  const closeModal = modal.querySelector(".modal-close");
  const pauseBtn = document.getElementById("pause-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const posterThumbs = Array.from(document.querySelectorAll(".poster-thumb"));
  let currentIndex = 0;
  let isPlaying = true;
  let slideshowInterval = null;

  function showImage(index, direction = "right") {
    const img = posterThumbs[index];
    if (!img) return;

    const slideClass = direction === "left" ? "slide-left" : "slide-right";

    modalImg.classList.add(slideClass);
    setTimeout(() => {
      modalImg.src = img.src;
      caption.textContent = img.alt || "Event Poster";
      modalImg.classList.remove(slideClass);
      currentIndex = index;
    }, 300);
  }

  function nextImage() {
    const nextIndex = (currentIndex + 1) % posterThumbs.length;
    showImage(nextIndex, "right");
  }

  function prevImage() {
    const prevIndex = (currentIndex - 1 + posterThumbs.length) % posterThumbs.length;
    showImage(prevIndex, "left");
  }

  function startSlideshow() {
    stopSlideshow();
    slideshowInterval = setInterval(nextImage, 4000);
    pauseBtn.classList.remove("paused");
    pauseBtn.classList.add("playing");
    pauseBtn.setAttribute("aria-label", "Pause Slideshow");
    pauseBtn.innerHTML = `<img src="https://www.svgrepo.com/show/176023/music-pause-button-pair-of-lines.svg" alt="Pause" style="width:24px;height:24px;display:block;margin:auto;">`;
    isPlaying = true;
  }

  function stopSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    pauseBtn.classList.remove("playing");
    pauseBtn.classList.add("paused");
    pauseBtn.setAttribute("aria-label", "Play Slideshow");
    pauseBtn.innerHTML = `<img src="https://www.svgrepo.com/show/526106/play.svg" alt="Play" style="width:24px;height:24px;display:block;margin:auto;">`;
    isPlaying = false;
  }

  function toggleSlideshow() {
    isPlaying ? stopSlideshow() : startSlideshow();
  }

  posterThumbs.forEach((img, index) => {
    img.addEventListener("click", () => {
      showImage(index, false);
      modal.classList.remove("hidden");
      startSlideshow();
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    stopSlideshow();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      stopSlideshow();
    }
  });

  pauseBtn.addEventListener("click", toggleSlideshow);
  nextBtn.addEventListener("click", () => {
    nextImage();
    if (isPlaying) stopSlideshow();
  });
  prevBtn.addEventListener("click", () => {
    prevImage();
    if (isPlaying) stopSlideshow();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("hidden")) {
      if (e.key === "ArrowRight") {
        nextImage();
        if (isPlaying) stopSlideshow();
      } else if (e.key === "ArrowLeft") {
        prevImage();
        if (isPlaying) stopSlideshow();
      } else if (e.key === " ") {
        e.preventDefault();
        toggleSlideshow();
      } else if (e.key === "Escape") {
        modal.classList.add("hidden");
        stopSlideshow();
      }
    }

    if (e.key === "ArrowUp") {
      window.scrollBy({ top: -100, behavior: "smooth" });
    } else if (e.key === "ArrowDown") {
      window.scrollBy({ top: 100, behavior: "smooth" });
    }
  });

  // === GSAP Scroll Animations ===
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".grow-on-scroll").forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
      delay: i * 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // === Scroll Reveal ===
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-down').forEach(section => {
    observer.observe(section);
  });

  // === Back to Top Button ===
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// === Countdown Timer ===
const targetDate = new Date("2025-09-09T09:30:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = "<span style='color:#ff6666'>Event Started!</span>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

