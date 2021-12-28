import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/utils/SkeletonUtils.js';

const walkers = [
  {
    // USA
    x: 0.85,
    z: 0.2,
  },
  {
    // LatAm
    x: 1.65,
    z: -0.5,
  },
  {
    // Africa
    x: 3.75,
    z: -1.75,
  },
  {
    // Asia
    x: -0.8,
  },
];

const swimmers = [
  {
    // South America
    x: 14.5,
    z: 0.2,
  },
  {
    // Hawaii
    x: 1,
    z: 1,
  },
  {
    // Atlantic Ocean
    x: 0.75,
    z: -0.7,
  },
  {
    // Indian Ocean
    x: 4.25,
    z: -0.25,
  },
  {
    // New Zealand
    x: -0.2,
    z: 2.35,
  },
];

export default () => {
  let scene, camera, renderer, controls, sphereGeometry, sphereMaterial, sphere, starTexture, starGeometry, starMaterial, starField, group, clock, loader, delta;
  const mixers = [];

  const earthEl = document.querySelector('#earth');
  
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5.5;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.05;
  controls.minPolarAngle = Math.PI * 0.35;
  controls.maxPolarAngle = Math.PI * 0.65;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.update();

  earthEl.appendChild(renderer.domElement); 

  sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
  sphereMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("../3d/earth@4x.png"),
    shininess: 0,
    transparent: true,
  });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // starTexture = new THREE.TextureLoader().load("/3d/stars.png");
  // starTexture.wrapS = THREE.RepeatWrapping;
  // starTexture.wrapT = THREE.RepeatWrapping;
  // starTexture.repeat.set(8, 8);

  // starGeometry = new THREE.SphereGeometry(1000, 50, 50);
  // starMaterial = new THREE.MeshPhongMaterial({
  //   map: starTexture,
  //   side: THREE.DoubleSide,
  //   opacity: 0.01,
  //   shininess: 0
  // });
  // starField = new THREE.Mesh(starGeometry, starMaterial);


  group = new THREE.Group();
  clock = new THREE.Clock();

  loader = new GLTFLoader().setPath('../3d/');
  loader.load(
    'CreatureWeb_Creature_WalkAndSwim.glb',
    (gltf) => {

      walkers.forEach(({x, z}) => {
        const walker = SkeletonUtils.clone(gltf.scene);
        walker.children[0].scale.set(1.0025, 1.05, 1.0025);
        walker.children[0].rotation.x = x || 0;
        walker.children[0].rotation.z = z || 0;

				const mixer = new THREE.AnimationMixer(walker);
				const clip = THREE.AnimationClip.findByName(gltf.animations, 'creature_walkonglobe');
        const action = mixer.clipAction(clip);
        mixer.timeScale = THREE.Math.randFloat(0.2, 0.6);
        action.play();
        mixers.push(mixer);

        group.add(walker);
      });
      
      swimmers.forEach(({x, z}) => {
        const walker = SkeletonUtils.clone(gltf.scene);
        walker.children[0].scale.set(1.0, 1.0, 1.0);
        walker.children[0].rotation.x = x || 0;
        walker.children[0].rotation.z = z || 0;

				const mixer = new THREE.AnimationMixer(walker);
				const clip = THREE.AnimationClip.findByName(gltf.animations, 'creature-swim');
        const action = mixer.clipAction(clip);
        mixer.timeScale = THREE.Math.randFloat(0.1, 0.3);
        action.play();
        mixers.push(mixer);

        group.add(walker);
      });
    },
 );


  group.add(sphere);
  scene.add(starField);
  scene.add(new THREE.AmbientLight(0xFFFFFF));
  scene.add(group);


  function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();
    mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    group.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const { width, height } = earthEl.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.render(scene, camera);

    console.log();
  }

  animate();
  onWindowResize();

  window.addEventListener('resize', onWindowResize);
}
