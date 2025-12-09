/////////////////////////////////////////////////
// Card Slider Logic
/////////////////////////////////////////////////

const slider = document.getElementById("projects_section_cards");
const prevBtn = document.getElementById("projects_section_nav_btn_prev");
const nextBtn = document.getElementById("projects_section_nav_btn_next");
const card = slider.querySelector(".projects_section_card");

function GetCardWidth() {
    const cardStyles = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth;
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

        PauseAutoScrollFor(autoScrollPauseDelay);
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
const autoScrollPauseDelay = 10000;
let autoScrollDirection = "right";
let autoScrollIntervalId = null;
let autoScrollResumeTimeoutId = null;

const AtRightEnd = () => { return Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth; }
const AtLeftEnd = () => { return slider.scrollLeft <= 0; }

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

    autoScrollIntervalId = setInterval(AutoScrollStep, autoScrollInterval);
}

function StopAutoScroll() {
    if(autoScrollIntervalId !== null) {
        clearInterval(autoScrollIntervalId);

        autoScrollIntervalId = null;
    }
}

function PauseAutoScrollFor(duration) {
    StopAutoScroll();

    if(autoScrollResumeTimeoutId !== null) clearTimeout(autoScrollResumeTimeoutId);

    autoScrollResumeTimeoutId = setTimeout(() => { StartAutoScroll() }, duration);
}

slider.addEventListener("scroll", UpdateScrollbar);
window.addEventListener("resize", UpdateScrollbar);

window.addEventListener("load", () => {
    UpdateScrollbar();
    StartAutoScroll();
});