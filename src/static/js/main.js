import Earth from "./earth.js";
import planetImages from "./planetImages.js";
import * as Util from "./functions.js";

(() => {
  let currentTheme = localStorage.getItem("theme");
  let isDarkModeOn = currentTheme === undefined || currentTheme === "dark-theme";
  let spaceObjects = {};
  let scrolling = false;
  let lastKnownScrollPosition = window.scrollY;

  const rainbowScales = [...Array(101)].map((_, i) => ({
    x: Util.lerp(0.05, 1, Util.easeInCirc(i / 100)),
    y: Util.lerp(0.5, 1, Util.easeInExpo(i / 100)),
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

    Object.values(spaceObjects).map((planet) => {
      planet.visible = toggleDarkMode;
    });
  };

  const onPageLoad = () => {
    document.body.classList.add(currentTheme !== null ? currentTheme : "dark-theme");
    isDarkModeOn = document.body.classList.contains("dark-theme");
    onPageScroll();

    const toggleBtn = document.querySelector(".header__theme-toggle");
    toggleBtn.addEventListener("click", onToggleTheme);
    const earth = Earth();
  };

  const onPageScroll = () => {
    lastKnownScrollPosition = window.scrollY;
    if (!scrolling) {
      window.requestAnimationFrame(() => {
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = lastKnownScrollPosition / (docHeight - winHeight);
        const index = Math.min(100, Math.max(0, Math.round(scrollPercent * 100)));
        const { x, y } = rainbowScales[index];
        document.querySelector("#rainbow").style.transform = `scale(${x}, ${y})`;
        document.querySelector("#rainbow").style.opacity = Math.min(1, x * 2);
        scrolling = false;
      });
      scrolling = true;
    }
  };

  window.addEventListener("load", onPageLoad);
  window.addEventListener("scroll", onPageScroll);
})();