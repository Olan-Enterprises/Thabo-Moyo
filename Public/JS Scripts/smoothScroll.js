const lenis = new Lenis();

function Raf(time) {
    lenis.raf(time);

    requestAnimationFrame(Raf);
}

requestAnimationFrame(Raf);