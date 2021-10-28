const planetImages = {
  ercon:
    "data:image/png;base64,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",
  marius:
    "data:image/png;base64,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",
  gomba:
    "data:image/png;base64,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",
  uuary:
    "data:image/png;base64,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",
  inciu:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAC+CAMAAAC8qkWvAAAB71BMVEUAAAAeRJceRJceRJceRJceRJceRJceRJceRJceRJceRJceRJceRJceRJceRJceRJdXcKjb1tDb1tDb1tAeRJceRJdLZ6VXcKh5irKPnLnBwsjb1tDb1tDb1tAeRJceRJfT0M7b1tDb1tBcdKrb1tAeRJceRJdRbKbb1tDb1tBrgK7b1tAeRJdAXqGXorujqr/b1tAeRJc1Vp5zhrHQzc3b1tApTZpEYaN7jLNieayMmbjb1tCor8Hb1tDb1tAeRJceRJdTbafb1tDb1tC5vMamrcDb1tAeRJfb1tAvUZybpL3KycseRJfExMm1ucWqsMHExcl1h7Fle61+j7RGY6OEk7bb1tCfp75qf67MyswmSpm9v8duga+dpr3b1tAtUJzb1tCxtsPb1tDb1tDb1tDb1tDb1tCAkLXb1tDb1tA4WZ9edqpIZKRqfq5keqyus8Lb1tDb1tCOmrlbc6nb1tCGlba0uMQ8W6Db1tAeRJdPaqYeRJceRJfb1tAeRJfb1tAeRJceRJfb1tAeRJegqb5ofa3b1tAeRJceRJePnLnb1tDb1tDb1tDb1tDb1tDb1tAeRJceRJceRJfb1tAeRJfb1tCVoLseRJfb1tAeRJceRJceRJceRJceRJdKZqQeRJceRJceRJceRJceRJceRJeowLEnAAAApXRSTlMAPU1jmcxcOC659f/wrR8XzJlcD6jb////////1qN7wv+9a/+tiuv/4YL/H1P///9F0f///8j//////5b/8HVF4f/RLv//imtT////Xv//////e////3v/////////9f8X/7qoSDjr/7iU////////Y0L//8L////bD/9CZsyzTTOUPSn//zQk6LOFZhToswrWo72cglf/x6uWdkh0aYVXCoWcyRSaGJHMAAAJmklEQVR42tXd/18UxxkH8MHv+JykguVYnsZcRYNV75Bl3eMIKl+OVCR7SuVEEVRMrVbvcq1E7QGlmJgvNViatkm0Sduk7R9aT0kf7mB3Zm5m7jbvn3i9fL30s+szz87O7C7MhIYtW7e9sH1N6ecdW3ay0Nu1ZVvj9t3gI7J9z7YtTSyUXtu6jYIHifxob3MLC5Wt+34MPK3RkjbLakfEn7zeHJbTvv8N4LNiWOmnB1rCnZ10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",
};

const lerp = (x, y, a) => x * (1 - a) + y * a;
const easeInExpo = (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));
const easeInCirc = (x) => 1 - Math.sqrt(1 - Math.pow(x, 2));
const randomInt = (min, max) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) +
  Math.ceil(min);
const planets = {
  ercon: null,
  marius: null,
  gomba: null,
  uuary: null,
  inciu: null,
};
const creatures = {
  laying: null,
  sitting: null,
  standing: null,
  standingAlt: null,
};
let currentTheme = localStorage.getItem("theme");
let isDarkModeOn = currentTheme === undefined || currentTheme === "dark-theme";

const toggleTheme = function(e) {
  if (e) e.preventDefault;
  isDarkModeOn = document.body.classList.contains("dark-theme");
  const toggleDarkMode = !isDarkModeOn;
  const newTheme = toggleDarkMode ? "dark-theme" : "light-theme";
  const oldTheme = toggleDarkMode ? "light-theme" : "dark-theme";
  document.body.classList.add(newTheme);
  document.body.classList.remove(oldTheme);
  localStorage.setItem("theme", newTheme);

  Object.values(planets).map((planet) => {
    planet.visible = toggleDarkMode;
  });
}

window.addEventListener("load", function () {
  document.body.classList.add(currentTheme !== null ? currentTheme : "dark-theme");
  isDarkModeOn = document.body.classList.contains("dark-theme");

  const toggleBtn = document.querySelector(".header__theme-toggle");
  toggleBtn.addEventListener("click", toggleTheme);
});

window.addEventListener("earthjsload", function () {
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

  planets.ercon = miniEarth.addPoints({
    points: [{ location: { lat: 0, lng: -18 }, scale: 20, offset: 46 }],
    image: planetImages.ercon,
    visible: isDarkModeOn,
  });

  planets.marius = miniEarth.addPoints({
    points: [{ location: { lat: 20, lng: -90 }, scale: 20, offset: 47 }],
    image: planetImages.marius,
    visible: isDarkModeOn,
  });

  planets.gomba = miniEarth.addPoints({
    points: [{ location: { lat: -30, lng: 60 }, scale: 22, offset: 45 }],
    image: planetImages.gomba,
    visible: isDarkModeOn,
  });

  planets.uuary = miniEarth.addPoints({
    points: [{ location: { lat: 30, lng: 130 }, scale: 22, offset: 48 }],
    image: planetImages.uuary,
    visible: isDarkModeOn,
  });

  planets.inciu = miniEarth.addPoints({
    points: [{ location: { lat: 10, lng: -160 }, scale: 25, offset: 42 }],
    image: planetImages.inciu,
    visible: isDarkModeOn,
  });

  ["laying", "sitting", "standing"].forEach(async (pose) => {
    const response = await fetch(`../3d/cloud-${pose}.obj`)
      .then(response => response.blob())
      .then(blob => blob.text())
      .then(mesh => {
        Earth.addMesh(mesh);
        for (let i = 0; i < 8; i++) {
          let cloud = miniEarth.addMarker({
            mesh: "Cloud" + pose.slice(0,1).toUpperCase() + pose.slice(1),
            location: { lat: randomInt(-70, 70), lng: randomInt(-170, 170) },
            rotationY: randomInt(-60, 60),
            color: '#fff',
            scale: 0.05,
            offset: 1,
          });
          cloud.animate(
            "offset",
            1.1,
            { duration: 0, relativeDuration: 6000 + (i * 1000), loop: true, oscillate: true },
          )
        }
      });
  });

  // Object.keys(creatures).forEach((pose, index) => {
  //   creatures[pose] = miniEarth.addMarker({
  //     mesh : "",
  //     location: { lat: 30 + (index * 30), lng: index * 30 },
  //     scale: 1,
  //     offset: 0
  //   });
  //   // creatures[pose].animate(
  //   //   "offset",
  //   //   1.1,
  //   //   { duration: 0, relativeDuration: 10000, loop: true, oscillate: true },
  //   // );
  //   loadObjFile(
  //     "../3d/",
  //     `creature-${pose}.obj`,
  //     `material.mtl`,
  //     function (obj) {
  //       creatures[pose].object3d.add(obj);
  //     }
  //   );  
  // });

  const starPoints = [];
  for (let i = 0; i < 1000; i++) {
    starPoints.push({
      location: { lat: randomInt(-60, 60), lng: randomInt(-180, 180) },
      offset: randomInt(52, 120),
      scale: 1,
      opacity: randomInt(20, 80) / 100,
      color: "#bab479",
    });
  }
  planets.stars = miniEarth.addPoints({
    points: starPoints,
    scale: 0.25 + window.innerHeight / 1000,
    visible: isDarkModeOn,
  });
});

const scales = [...Array(101)].map((_, i) => ({
  x: lerp(0.05, 1, easeInCirc(i / 100)),
  y: lerp(0.5, 1, easeInExpo(i / 100)),
}));

let lastKnownScrollPosition = 0;
let ticking = false;

document.addEventListener("scroll", function (e) {
  lastKnownScrollPosition = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const docHeight = document.body.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = lastKnownScrollPosition / (docHeight - winHeight);
      const index = Math.min(100, Math.max(0, Math.round(scrollPercent * 100)));
      const { x, y } = scales[index];
      document.querySelector("#rainbow").style.transform = `scale(${x}, ${y})`;
      document.querySelector("#rainbow").style.opacity = Math.min(1, x * 2);
      ticking = false;
    });
    ticking = true;
  }
});