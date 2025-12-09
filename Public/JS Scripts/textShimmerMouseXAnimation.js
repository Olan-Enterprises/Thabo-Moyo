const shimmerText = document.querySelectorAll(".statistics_section_header h1");
const maxPos = 200;
let targetPos = 0;
let currentPos = 0;

// Update target based on mouse X
window.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const w = window.innerWidth || 1;
    const ratio = x / w;                // 0 → 1 across viewport
    targetPos = ratio * maxPos;         // 0% → 200%
});

// Smoothly interpolate so it feels premium, not jittery
function animate() {
    // simple easing towards target
    currentPos += (targetPos - currentPos) * 0.1;

    shimmerText.forEach(text => {
    text.style.backgroundPosition = `${-currentPos + 46}% 50%`;
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);