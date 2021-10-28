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

  const setupEarth = () => {
    const planetData = {
      ercon: { location: { lat: 0, lng: -18 }, scale: 20, offset: 46 },
      marius: { location: { lat: 20, lng: -90 }, scale: 20, offset: 47 },
      gomba: { location: { lat: -30, lng: 60 }, scale: 22, offset: 45 },
      uuary: { location: { lat: 30, lng: 130 }, scale: 22, offset: 48 },
      inciu: { location: { lat: 10, lng: -160 }, scale: 25, offset: 42 },
    };
    const creaturePoses = ["laying", "sitting", "standing", "standingAlt"];
    const maxCloudsPerPose = 3;
    const starPoints = [];
    const clouds = [];
    const miniEarth = new Earth("earth", {
      location: { lat: 10, lng: -80 },
      light: "none",
      mapSeaColor: "#1e4497",
      mapLandColor: "#819647",
      mapBorderWidth: 0,
      mapStyles: "#AQ { fill: #f0e4d8; }",
      autoRotate: true,
      autoRotateDelay: 0,
      autoRotateStart: 0,
    });

    // Add spaceObjects
    for (const [name, data] of Object.entries(planetData)) {
      spaceObjects[name] = miniEarth.addPoints({
        points: [data],
        image: planetImages[name],
        visible: isDarkModeOn,
      });
    }

    // Add clouds and creature models
    creaturePoses.forEach(async (pose) => {
      const cloudName = pose.substr(0, 8);
      await fetch(`../3d/cloud-${cloudName}.obj`)
        .then(response => response.blob())
        .then(blob => blob.text())
        .then(mesh => {
          Earth.addMesh(mesh);
          for (let i = 0; i < maxCloudsPerPose; i++) {
            const targetScale = Math.max(0.08, Math.random() * 0.15);
            let cloud = miniEarth.addMarker({
              mesh: "Cloud" + cloudName.slice(0,1).toUpperCase() + cloudName.slice(1),
              location: { lat: Util.randomInt(-70, 70), lng: Util.randomInt(-170, 170) },
              rotationY: Util.randomInt(-60, 60),
              color: '#fff',
              scale: 0,
              offset: 1,
              opacity: 0.95,
            });
            cloud.animate("offset", 1.1, { duration: 0, relativeDuration: 6000 + (i * 1000), loop: true, oscillate: true });
            setTimeout(async () => loadObjFile(
              "../3d/",
              `creature-${pose}.obj`,
              `material.mtl`,
              mesh => {
                cloud.object3d.add(mesh);
                cloud.animate("scale", targetScale, { duration: 300 });
              }
            ), 100 + (i * 400));
            clouds.push(cloud);
          }
        });
    });

    // Add stars
    for (let i = 0; i < 1000; i++) {
      starPoints.push({
        location: { lat: Util.randomInt(-60, 60), lng: Util.randomInt(-180, 180) },
        offset: Util.randomInt(52, 120),
        scale: 1,
        opacity: Util.randomInt(20, 80) / 100,
        color: "#bab479",
      });
    }
    spaceObjects.stars = miniEarth.addPoints({
      points: starPoints,
      scale: 0.25 + window.innerHeight / 1000,
      visible: isDarkModeOn,
    });


    let ticking = false;
    const updateEarth = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          clouds.forEach((cloud, index) => {
            let {lat, lng} = cloud.location;
            lat += 0.03 + (cloud.rotationY / 500);
            lng += 0.1 - 0.05 * cloud.scale;
            cloud.location = { lat, lng };
            cloud.lookAt = { lat, lng };
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    miniEarth.addEventListener("update", updateEarth);
  }

  window.addEventListener("earthjsload", setupEarth);
  window.addEventListener("load", onPageLoad);
  window.addEventListener("scroll", onPageScroll);
})();