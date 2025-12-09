// animateOnScroll.js

const hiddenElements1 = document.querySelectorAll(".hidden1");
const hiddenElements2 = document.querySelectorAll(".hidden2");
const hiddenElements3 = document.querySelectorAll(".hidden3");
const hiddenElements4 = document.querySelectorAll(".hidden4");
const hiddenElements5 = document.querySelectorAll(".hidden5");

const hiddenClassNames = ["hidden1", "hidden2", "hidden3", "hidden4", "hidden5"];
const showClasses      = ["show1",   "show2",   "show3",   "show4",   "show5"];

const allHiddenElements = [
    ...hiddenElements1,
    ...hiddenElements2,
    ...hiddenElements3,
    ...hiddenElements4,
    ...hiddenElements5,
];

// Default behaviour = your current behaviour
let scrollAnimationMode = "default";

const scrollAnimateObserver = new IntersectionObserver(entries => {
    // If animations are off, do nothing here
    if (scrollAnimationMode === "off") return;

    entries.forEach(entry => {
        const target = entry.target;

        // Work out which hiddenX / showX pair this element uses
        let index = -1;
        for (let i = 0; i < hiddenClassNames.length; i++) {
            if (target.classList.contains(hiddenClassNames[i])) {
                index = i;
                break;
            }
        }
        if (index === -1) return;

        const showClass   = showClasses[index];
        const hiddenClass = hiddenClassNames[index];

        if (entry.isIntersecting) {
            // Element enters viewport
            target.classList.add(showClass);

            if (scrollAnimationMode === "only-once") {
                // Animate once, then keep it visible permanently
                target.classList.remove(hiddenClass);
                scrollAnimateObserver.unobserve(target);
            }
        } else {
            // Element leaves viewport
            if (scrollAnimationMode === "default") {
                // Original behaviour: remove the show class so it can animate again
                target.classList.remove(showClass);
            }
            // For "only-once", once shown it stays shown; no need to remove anything
        }
    });
});

function observeAllHidden() {
    allHiddenElements.forEach(el => {
        if (hiddenClassNames.some(cls => el.classList.contains(cls))) {
            scrollAnimateObserver.observe(el);
        }
    });
}

function revealAllWithoutAnimation() {
    allHiddenElements.forEach(el => {
        hiddenClassNames.forEach(cls => el.classList.remove(cls));
        showClasses.forEach(cls => el.classList.remove(cls));
        scrollAnimateObserver.unobserve(el);
    });
}

/**
 * mode: "default" | "only-once" | "off"
 * - default  -> current behaviour (re-animate every time)
 * - only-once -> animate first time, then leave visible
 * - off       -> no animation at all; everything is just visible
 */
function setScrollAnimationMode(mode) {
    const normalised = mode || "default";
    scrollAnimationMode = normalised;

    if (scrollAnimationMode === "off") {
        // Turn animations off and just show everything
        revealAllWithoutAnimation();
    } else {
        // Ensure all relevant elements are being observed
        observeAllHidden();
    }
}

// Expose this so the settings panel can talk to it
window.setScrollAnimationMode = setScrollAnimationMode;

// Initialise mode from <html data-scroll-animations="..."> if present,
// otherwise fall back to "default"
const root = document.documentElement;
const initialMode = root.dataset.scrollAnimations || "default";
setScrollAnimationMode(initialMode);

// If you ever add new .hiddenX elements dynamically, just call observeAllHidden()
