document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.getElementById("home_hero_section");
    if (!heroSection) return;

    const bgImages = heroSection.querySelectorAll(".home_hero_section_background img");
    if (!bgImages.length) return;

    /* ---------------- SLIDESHOW (no fade on first load) --------------------- */

    let currentIndex = 0;
    const slideDuration = 6000; // ms per image

    // 1) Show first slide immediately WITHOUT transition
    function showFirstSlideInstant() {
        // Temporarily disable opacity transition
        bgImages.forEach(img => {
            img.style.transition = "none";
        });

        // Mark only the first image as active
        bgImages.forEach((img, i) => {
            img.classList.toggle("active", i === 0);
        });

        // Force a reflow so the browser applies the styles
        // (this "locks in" the first state with no animation)
        void heroSection.offsetHeight;

        // Re-enable the CSS transition for future fades
        bgImages.forEach(img => {
            img.style.transition = ""; // clears inline style, uses CSS rule again
        });
    }

    function showSlide(index) {
        bgImages.forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });
    }

    function startSlideshow() {
        showFirstSlideInstant(); // first image appears instantly

        setInterval(() => {
            currentIndex = (currentIndex + 1) % bgImages.length;
            showSlide(currentIndex); // later slides will fade because transition is back
        }, slideDuration);
    }

    /* ---------------- PARALLAX (unchanged) --------------------------------- */

    let targetTranslate = 0;
    let currentTranslate = 0;
    const maxParallax = 300;

    function updateTargetFromScroll() {
        const rect = heroSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const clamped = Math.max(0, Math.min(1, progress));

        targetTranslate = (clamped - 0.5) * -maxParallax;
    }

    function animateParallax() {
        currentTranslate += (targetTranslate - currentTranslate) * 0.08;

        bgImages.forEach(img => {
            img.style.transform = `translateY(${currentTranslate}px)`;
        });

        requestAnimationFrame(animateParallax);
    }

    window.addEventListener("scroll", updateTargetFromScroll, { passive: true });
    window.addEventListener("resize", updateTargetFromScroll);

    updateTargetFromScroll();
    animateParallax();
    startSlideshow();
});