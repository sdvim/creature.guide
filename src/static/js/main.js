import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 

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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('#earth').appendChild(renderer.domElement); 

  const light = new THREE.AmbientLight( 0xFFFFFF );
  const geometry = new THREE.SphereGeometry(1, 50, 50);
  const material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("../3d/earth@4x.png"),
    shininess: 0
  });
  const sphere = new THREE.Mesh( geometry, material );
  const controls = new OrbitControls( camera, renderer.domElement );

  const starTexture = new THREE.TextureLoader().load("/3d/stars.png");
  // starTexture.wrapS = THREE.RepeatWrapping;
  // starTexture.wrapT = THREE.RepeatWrapping;
  // starTexture.repeat.set(8, 8);

  var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
  var starMaterial = new THREE.MeshPhongMaterial({
    map: starTexture,
    side: THREE.DoubleSide,
    opacity: 0.01,
    shininess: 0
  });
  var starField = new THREE.Mesh(starGeometry, starMaterial);
  scene.add(starField);

  scene.add( light )
  scene.add( sphere );

  camera.position.z = 5;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.05;
  controls.minPolarAngle = Math.PI * 0.35;
  controls.maxPolarAngle = Math.PI * 0.65;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("load", onPageLoad);
  window.addEventListener("scroll", onPageScroll);
})();