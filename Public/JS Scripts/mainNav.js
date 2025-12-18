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
    document.querySelectorAll(".main_top_nav_right_link_active").forEach(element => element.style.opacity = "0");

    navElement.classList.add("active");

    if(navElement.classList.contains("active")) {
        navElement.querySelector(".main_top_nav_right_link_active").style.opacity = "1";
        navElement.querySelector(".main_top_nav_right_link_active").style.transition = "opacity 0.7s ease";
    }
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

////////////////////////////////////////////////////////
// Nav sidebar logic
////////////////////////////////////////////////////////

const hamburgerIcon = document.getElementById("main_top_nav_hamburger_icon");
const sidebar = document.getElementById("main_top_nav_sidebar");
const sidebarLinks = sidebar.querySelectorAll(".main_top_nav_sidebar_link");

let sidebarHiddenRight = "0px";
let sidebarOpen = false;

const CalculateHiddenPosition = () => {
  sidebarHiddenRight = `-${sidebar.getBoundingClientRect().width}px`;
};

const IsSidebarOpen = () => sidebarOpen;

const OpenSidebar = () => {
  sidebar.style.right = "0px";
  sidebarOpen = true;
};

const CloseSidebar = () => {
  sidebar.style.right = sidebarHiddenRight;
  sidebarOpen = false;
};

document.addEventListener("DOMContentLoaded", () => {
  CalculateHiddenPosition();
  CloseSidebar();
});

hamburgerIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  OpenSidebar();
});

// ✅ Close when clicking outside (works for mouse + touch)
document.addEventListener("pointerdown", (event) => {
  if (!IsSidebarOpen()) return;

  // If the click is inside the sidebar or on the hamburger icon, do nothing
  if (sidebar.contains(event.target) || hamburgerIcon.contains(event.target)) return;

  CloseSidebar();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && IsSidebarOpen()) CloseSidebar();
});

sidebarLinks.forEach(link => {
  link.addEventListener("click", () => CloseSidebar());
});

window.addEventListener("resize", () => {
  const wasOpen = IsSidebarOpen();

  CalculateHiddenPosition();

  if (!wasOpen) CloseSidebar();
});
