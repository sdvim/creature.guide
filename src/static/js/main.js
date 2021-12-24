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

  let scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  // renderer.outputEncoding = THREE.sRGBEncoding;
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
  scene.add( light );


  const group = new THREE.Group();
  const boxGeometry = new THREE.BoxGeometry( 0.25, 0.5, 0.5 );
  const boxMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const box = new THREE.Mesh( boxGeometry, boxMaterial );
  box.position.set( 1, 0, 0 );


  let mixer;
  const clock = new THREE.Clock();

  
  group.add(sphere);

  const loader = new GLTFLoader().setPath( '../3d/' );
  loader.load(
    // resource URL
    'CreatureWeb_Creature-GLTF_WalkAndSwim.gltf',
    // called when the resource is loaded
    function ( gltf ) {

      console.log('!');
      console.log(gltf.scene);

      gltf.scene.traverse( function ( child ) {

        // console.log(child);
        // child.scale.set(50, 50, 50);
        // child.position.set(10, 10, 0);
      if ( child.type == "Object3D" ) {
        // group.add(child);
        console.log();

        child.position.y = 0.35;
        child.position.x = -0.05;
        child.scale.set(0.66, 0.66, 0.66);

        mixer = new THREE.AnimationMixer( gltf.scene );
        gltf.animations.forEach( ( clip ) => {
          console.log(clip);
          if (clip.name === 'creature-swim')
            mixer.clipAction( clip ).play();
        } );

          // roughnessMipmapper.generateMipmaps( child.material );

        }


      } );

      gltf.scene.background = new THREE.Color( 0xff00ff );
      
      group.add(gltf.scene);

      // scene = gltf.scene;

      // gltf.material = 

      // console.log(scene);
  
      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
  
    },
    // called while loading is progressing
    // function ( xhr ) {
  
    //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
    // },
    // called when loading has errors
    function ( error ) {
  
      console.log( 'An error happened' );
      console.error(error);
  
    }
  );

  scene.add(group);

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
    group.rotation.y += 0.001;
    box.rotation.x += 0.004;

    var delta = clock.getDelta();
  if ( mixer ) mixer.update( delta );

    controls.update();
    renderer.render(scene, camera);
  }
  animate();



  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.render(scene, camera);

  }

  window.addEventListener("load", onPageLoad);
  window.addEventListener("scroll", onPageScroll);
  window.addEventListener( 'resize', onWindowResize );
})();