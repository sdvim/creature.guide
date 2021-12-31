import Earth from "./earth.js";
import * as Util from "./functions.js";

(() => {
  let earth;
  let currentTheme = localStorage.getItem("theme");
  let isDarkModeOn = currentTheme === undefined || currentTheme === "dark-theme";
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
    earth.toggleNight(toggleDarkMode);
  };

  const onPageLoad = () => {
    document.body.classList.add(currentTheme !== null ? currentTheme : "dark-theme");
    isDarkModeOn = document.body.classList.contains("dark-theme");
    onPageScroll();

    const toggleBtn = document.querySelector(".header__theme-toggle");
    toggleBtn.addEventListener("click", onToggleTheme);
    earth = new Earth();
    earth.toggleNight(isDarkModeOn);

    let today = new Date();
    document.querySelectorAll(".timeline__event").forEach((el) => {
      let { date } = el.dataset;
      let dateObject = new Date(date);
      let tense = (today < dateObject) ? "future" : "past";
      let previous = el.previousElementSibling;
      let localizedString = dateObject.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (localizedString !== "Invalid Date")
        el.querySelector("time").innerHTML = localizedString;
      el.classList.add(`timeline__event--${tense}`);

      if (tense === "future" && previous && previous.classList.contains("timeline__event--past")) {
        previous.classList.add("timeline__event--present");
        previous.classList.remove("timeline__event--past");
      }
    });
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