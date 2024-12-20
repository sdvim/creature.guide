import Earth from "./earth.js";
import * as Util from "./functions.js";

(() => {
  let earth;
  let currentTheme = localStorage.getItem("theme");
  let isDarkModeOn = currentTheme === undefined || currentTheme === "dark-theme";
  let scrolling = false;
  let lastKnownScrollPosition = window.scrollY;

  const earthEl = document.querySelector(".earth");

  const rainbowEl = document.querySelector("#rainbow");
  const rainbowPrecision = 5000;
  const rainbowScales = [...Array(rainbowPrecision + 1)].map((_, i) => ({
    x: Util.lerp(0.05, 1, Util.easeInSine(i / rainbowPrecision)),
    y: i / rainbowPrecision,
  }));

  const onToggleTheme = (e) => {
    if (e) e.preventDefault;
    isDarkModeOn = document.body.classList.contains("dark-theme");
    const toggleDarkMode = !isDarkModeOn;
    const newTheme = toggleDarkMode ? "dark-theme" : "light-theme";
    const oldTheme = toggleDarkMode ? "light-theme" : "dark-theme";
    document.body.classList.add(newTheme);
    document.body.classList.remove(oldTheme);
    localStorage.setItem("theme", newTheme);
    earth?.toggleNight(toggleDarkMode);
  };

  const onPageLoad = () => {
    document.body.classList.add(currentTheme !== null ? currentTheme : "dark-theme");
    isDarkModeOn = document.body.classList.contains("dark-theme");
    onPageScroll();

    const toggleBtn = document.querySelector(".header__theme-toggle");
    toggleBtn.addEventListener("click", onToggleTheme);

    if (earthEl) {
      earth = new Earth();
      earth.toggleNight(isDarkModeOn);  
    }

    let today = new Date();
    document.querySelectorAll(".timeline__event").forEach((el) => {
      let { date, future } = el.dataset;
      let dateObject = new Date(date);
      let inFuture = future || !date || today < dateObject;
      let previousEvent = el.previousElementSibling;

      if (!inFuture) {
        el.classList.add("timeline__event--past");
      } else if (previousEvent?.classList.contains("timeline__event--past")) {
        previousEvent.classList.add("timeline__event--present");
        previousEvent.classList.remove("timeline__event--past"); 
      }
    });
  };

  const onPageScroll = () => {
    lastKnownScrollPosition = window.scrollY;
    if (!scrolling && rainbowEl) {
      window.requestAnimationFrame(() => {
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = lastKnownScrollPosition / (docHeight - winHeight);
        const index = Math.min(rainbowPrecision, Math.max(0, Math.round(scrollPercent * rainbowPrecision)));
        const { x, y } = rainbowScales[index];
        rainbowEl.style.transform = `scale(${x}, ${y})`;
        rainbowEl.style.opacity = Math.min(1, x * 2);
        scrolling = false;
      });
      scrolling = true;
    }
  };

  window.addEventListener("load", onPageLoad);
  if (rainbowEl) window.addEventListener("scroll", onPageScroll);
})();