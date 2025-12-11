const heroSection = document.getElementById("home_hero_section");
const bgImages = document.querySelectorAll(".home_hero_section_background img");
const slideDuration = 6000;
const maxParallax = 300;
let currentIndex = 0;
let targetTranslate = 0;
let currentTranslate = 0;

function ShowFirstSlideInstant() {
    bgImages.forEach((img, i) => {
        img.style.transition = "none";
        img.classList.toggle("active", i === 0);
    });

    void heroSection.offsetHeight;

    bgImages.forEach(img => img.style.transition = "");
}

const ShowSlide = (index) => { bgImages.forEach((img, i) => img.classList.toggle("active", i === index)) }

function StartSlideshow() {
    ShowFirstSlideInstant();

    setInterval(() => {
        currentIndex = (currentIndex + 1) % bgImages.length;

        ShowSlide(currentIndex);
    }, slideDuration);
}

function UpdateTargetFromScroll() {
    const rect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if(rect.bottom < 0 || rect.top > viewportHeight) return;

    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));

    targetTranslate = (clamped - 0.5) * -maxParallax;
}

function AnimateParallax() {
    currentTranslate += (targetTranslate - currentTranslate) * 0.08;

    bgImages.forEach(img => img.style.transform = `translateY(${currentTranslate}px)`);

    requestAnimationFrame(AnimateParallax);
}

window.addEventListener("scroll", UpdateTargetFromScroll, { passive: true });
window.addEventListener("resize", UpdateTargetFromScroll);

UpdateTargetFromScroll();
AnimateParallax();
StartSlideshow();