const BUFFER_VALUE = 10; // Pixel-value threshold before scroll is detected
const SCROLL_THRESHOLD = 56;
const nav = document.getElementById("main_top_nav");

function GetScrollDirection(buffer) {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let direction = "";

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDiff = scrollTop - lastScrollTop;

        if(Math.abs(scrollDiff) >= buffer) {
            direction = scrollDiff > 0 ? "down" : "up";
            lastScrollTop = scrollTop;
        }
    });

    return function GetDirection() {
        return direction;
    }
}

const scrollDirection = GetScrollDirection(BUFFER_VALUE);

window.addEventListener("scroll", () => {
    if(scrollDirection() === "down" && window.scrollY > SCROLL_THRESHOLD) nav.style.top = "-6rem";
    else if(scrollDirection() === "up") nav.style.top = "0";
});

const mainSections = document.querySelectorAll(".main_section");
const navLinks = Array.from(document.querySelector(".main_top_nav_right_links").children);

const MakeActive = (navElement) => {
    navLinks.forEach(link => link.classList.remove("active"));

    navElement.classList.add("active");
}

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;

        if(entry.target.id === "home_hero_section") MakeActive(navLinks[0]);
        else if(entry.target.id === "projects_section") MakeActive(navLinks[1]);
        else if(entry.target.id === "blog_section") MakeActive(navLinks[2]);
    });
}, { threshold: 0.5 });

mainSections.forEach(section => navObserver.observe(section));