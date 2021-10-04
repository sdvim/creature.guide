window.addEventListener("load", function () {
  const script = document.createElement("script");
  script.src = "/lib/miniature.earth.js";
  document.body.appendChild(script);
});

window.addEventListener("earthjsload", function () {
  const myearth = new Earth("earth", {
    location: { lat: 10, lng: -80 },
    light: "none",
    mapSeaColor: "#1e4497",
    mapLandColor: "#819647",
    autoRotate: true,
    autoRotateDelay: 0,
    autoRotateStart: 0,
  });
});

const lerp = (x, y, a) => x * (1 - a) + y * a;
const easeInExpo = (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));
const easeInCirc = (x) => 1 - Math.sqrt(1 - Math.pow(x, 2));

const scales = [...Array(101)].map((_, i) => ({
  x: lerp(0.05, 1, easeInCirc(i / 100)),
  y: lerp(0.5, 1, easeInExpo(i / 100)),
}));

let lastKnownScrollPosition = 0;
let ticking = false;

function doSomething(scrollPos) {
  const docHeight = document.body.offsetHeight;
  const winHeight = window.innerHeight;
  const scrollPercent = scrollPos / (docHeight - winHeight);
  const index = Math.min(100, Math.max(0, Math.round(scrollPercent * 100)));
  const { x, y } = scales[index];
  document.querySelector("#rainbow").style.transform = `scale(${x}, ${y})`;
  if (window.innerWidth <= 600)
    document.querySelector("#rainbow").style.opacity = Math.min(1, x * 2);
  else if (document.querySelector("#rainbow").style.opacity != 1)
    document.querySelector("#rainbow").style.opacity = 1;
}

document.addEventListener("scroll", function (e) {
  lastKnownScrollPosition = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function () {
      doSomething(lastKnownScrollPosition);
      ticking = false;
    });
    ticking = true;
  }
});
