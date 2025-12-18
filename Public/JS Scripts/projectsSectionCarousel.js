///////////////////////////////////////////////
// Card Slider Logic
/////////////////////////////////////////////////

const slider = document.getElementById("projects_section_cards");
const prevBtn = document.getElementById("projects_section_nav_btn_prev");
const nextBtn = document.getElementById("projects_section_nav_btn_next");
const cards = slider.querySelectorAll(".projects_section_card");

// NEW: autoplay progress bar elements
const autoplayProgressBar = document.getElementById("projects_section_autoscroll_progress");

function GetCardWidth() {
    const cardStyles = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const marginRight = parseInt(cardStyles.marginRight);
    const marginLeft = parseInt(cardStyles.marginLeft);

    return cardWidth + marginLeft + marginRight;
}

[prevBtn, nextBtn].forEach(button => {
    button.addEventListener("mousedown", () => button.style.transform = "scale(0.9)");

    ["mouseleave", "mouseup"].forEach(event => {
        button.addEventListener(event, () => button.style.transform = "scale(1)");
    });    
});

prevBtn.addEventListener("mousedown", () => {
    slider.scrollBy({
        left: -GetCardWidth(),
        behavior: "smooth"
    });
});

nextBtn.addEventListener("mousedown", () => {
    slider.scrollBy({
        left: GetCardWidth(),
        behavior: "smooth"
    });
});

[prevBtn, nextBtn].forEach(button => {
    button.addEventListener("mousedown", (event) => {
        if(!event.isTrusted) return; // Ignore synthetic events triggered by AutoScrollStep

        PauseAutoScroll(autoScrollPauseDelay1);
    });
});

/////////////////////////////////////////////////
// Card Slider Pseudo-Scrollbar Logic
/////////////////////////////////////////////////

const scrollbar = document.getElementById("projects_section_slider_scrollbar");
const scrollbarThumb = document.getElementById("projects_section_slider_scrollbar_thumb");

function UpdateScrollbar() {
    const scrollWidth = slider.scrollWidth - slider.clientWidth;
    const scrollLeft = slider.scrollLeft;
    const scrollPercent = scrollLeft / scrollWidth;
    const thumbWidth = slider.clientWidth / slider.scrollWidth * scrollbar.clientWidth;

    scrollbarThumb.style.width = `${thumbWidth}px`;
    scrollbarThumb.style.transform = `translateX(${scrollPercent * (scrollbar.clientWidth - thumbWidth)}px)`;
}

/////////////////////////////////////////////////
// Auto Scroll Logic
/////////////////////////////////////////////////

const autoScrollInterval = 3000;
const autoScrollPauseDelay1 = 10000; // Used when nav buttons are clicked
const autoScrollPauseDelay2 = 3000; // Used when card is hovered over
let autoScrollDirection = "right";
let autoScrollIntervalId = null;
let autoScrollResumeTimeoutId = null;
let autoScrollProgressAnimationId = null;
let autoScrollProgressStartTime = null;
let autoScrollProgressDuration = null;

const AtRightEnd = () => { return Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth; }
const AtLeftEnd = () => { return slider.scrollLeft <= 0; }

function ResetAutoScrollProgressBar() {
    if (!autoplayProgressBar) return;

    if (autoScrollProgressAnimationId !== null) {
        cancelAnimationFrame(autoScrollProgressAnimationId);
        autoScrollProgressAnimationId = null;
    }

    autoplayProgressBar.style.width = "0%";

    autoScrollProgressStartTime = null;
    autoScrollProgressDuration = null;
}

function StartAutoScrollProgressBar(duration) {
    if (!autoplayProgressBar) return;

    ResetAutoScrollProgressBar();

    autoScrollProgressStartTime = performance.now();
    autoScrollProgressDuration = duration;

    const Step = () => {
        if (!autoScrollProgressStartTime || !autoScrollProgressDuration) return;

        const elapsed = performance.now() - autoScrollProgressStartTime;
        const clamped = Math.min(Math.max(elapsed / autoScrollProgressDuration, 0), 1);

        autoplayProgressBar.style.width = `${clamped * 100}%`;

        if (clamped < 1) {
            autoScrollProgressAnimationId = requestAnimationFrame(Step);
        } else {
            autoScrollProgressAnimationId = null;
        }
    };

    autoScrollProgressAnimationId = requestAnimationFrame(Step);
}

function AutoScrollStep() {
    if(autoScrollDirection === "right") {
        if(AtRightEnd()) {
            autoScrollDirection = "left";

            prevBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            prevBtn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }
        else {
            nextBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            nextBtn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }
    }
    else {
        if(AtLeftEnd()) {
            autoScrollDirection = "right";
            nextBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            nextBtn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }
        else {
            prevBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            prevBtn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }
    }
}

function StartAutoScroll() {
    if(autoScrollIntervalId !== null) return;

    // When autoplay is running, we don't need the progress bar
    ResetAutoScrollProgressBar();

    autoScrollIntervalId = setInterval(AutoScrollStep, autoScrollInterval);
}

function StopAutoScroll() {
    if(autoScrollIntervalId !== null) {
        clearInterval(autoScrollIntervalId);
        autoScrollIntervalId = null;
    }
}

function PauseAutoScroll(duration) {
    StopAutoScroll();

    if(autoScrollResumeTimeoutId !== null) {
        clearTimeout(autoScrollResumeTimeoutId);
        autoScrollResumeTimeoutId = null;
    }

    // NEW: kick off the visual countdown bar
    // StartAutoScrollProgressBar(duration);

    autoScrollResumeTimeoutId = setTimeout(() => {
        StartAutoScroll();
    }, duration);
}

// Hover pause → short countdown
cards.forEach(card => {
    card.addEventListener("mouseover", () => PauseAutoScroll(autoScrollPauseDelay2));
});

// Scrollbar + init
slider.addEventListener("scroll", UpdateScrollbar);
window.addEventListener("resize", UpdateScrollbar);

window.addEventListener("load", () => {
    UpdateScrollbar();
    StartAutoScroll();
});
