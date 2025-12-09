// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) =>
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
})

);

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
    });
  }
});