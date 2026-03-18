const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initializeScrolling();
  initializeReveal();
  initializeTypeLine();
  initializeScrollProgress();
  initializeAmbientParticles();
});

function initializeScrolling() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });
}

function initializeReveal() {
  const elements = document.querySelectorAll(".reveal:not(.is-visible)");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));
}

function initializeTypeLine() {
  const target = document.getElementById("type-target");

  if (!target) {
    return;
  }

  const fullText = target.dataset.text || "";

  if (reduceMotion) {
    target.textContent = fullText;
    return;
  }

  let index = 1;

  const typeNextCharacter = () => {
    target.textContent = fullText.slice(0, index);
    index += 1;

    if (index <= fullText.length) {
      window.setTimeout(typeNextCharacter, 42);
    }
  };

  window.setTimeout(typeNextCharacter, 260);
}

function initializeScrollProgress() {
  const progressBar = document.getElementById("progress-bar");

  if (!progressBar) {
    return;
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

    progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function initializeAmbientParticles() {
  const layer = document.getElementById("ambient-layer");

  if (!layer || reduceMotion) {
    return;
  }

  const colors = [
    "rgba(255, 216, 229, 0.9)",
    "rgba(210, 183, 255, 0.9)",
    "rgba(158, 177, 255, 0.78)"
  ];
  const count = Math.min(20, Math.max(12, Math.floor(window.innerWidth / 90)));
  const fragment = document.createDocumentFragment();

  // Keep the atmosphere light and decorative rather than busy.
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    const size = `${randomBetween(2, 7)}px`;
    const duration = `${randomBetween(13, 24)}s`;
    const delay = `${randomBetween(-8, 0)}s`;
    const x = `${randomBetween(0, 100)}%`;
    const y = `${randomBetween(0, 100)}%`;
    const driftX = `${randomBetween(-24, 24)}px`;
    const driftY = `${randomBetween(16, 44)}px`;
    const opacity = `${randomBetween(0.25, 0.7)}`;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.className = "ambient-particle";
    particle.style.setProperty("--size", size);
    particle.style.setProperty("--duration", duration);
    particle.style.setProperty("--delay", delay);
    particle.style.setProperty("--x", x);
    particle.style.setProperty("--y", y);
    particle.style.setProperty("--drift-x", driftX);
    particle.style.setProperty("--drift-y", driftY);
    particle.style.setProperty("--opacity", opacity);
    particle.style.setProperty("--particle-color", color);
    fragment.appendChild(particle);
  }

  layer.appendChild(fragment);
}

function randomBetween(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}
