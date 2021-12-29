import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/utils/SkeletonUtils.js';

const planets = [
  {
    name: 'ercon',
    x: -40,
    y: 0,
    z: 56,
  },
  {
    name: 'gomba',
    x: 84,
    y: 8,
    z: 64,
  },
  {
    name: 'inciu',
    x: 0,
    y: -8,
    z: 96,
  },
  {
    name: 'marius',
    x: 0,
    y: 8,
    z: -56,
  },
  {
    name: 'uuary',
    x: -64,
    y: 16,
    z: -64,
  },
];

const creatures = [
  {
    // USA
    x: 0.85,
    z: 0.2,
    type: 'walk',
  },
  {
    // LatAm
    x: 1.65,
    z: -0.5,
    type: 'walk',
  },
  {
    // Africa
    x: 3.75,
    z: -1.75,
    type: 'walk',
  },
  {
    // Asia
    x: -0.8,
    type: 'walk',
  },
  {
    // South America
    x: 14.5,
    z: 0.2,
    type: 'swim',
  },
  {
    // Hawaii
    x: 1,
    z: 1,
    type: 'swim',
  },
  {
    // Atlantic Ocean
    x: 0.75,
    z: -0.7,
    type: 'swim',
  },
  {
    // Indian Ocean
    x: 4.25,
    z: -0.25,
    type: 'swim',
  },
  {
    // New Zealand
    x: -0.2,
    z: 2.35,
    type: 'swim',
  },
];

const creatureTypes = {
  walk: {
    animation: 'creature_walkonglobe',
    scale: [1.0025, 1.05, 1.0025],
    durationRange: [0.2, 0.6],
  },
  swim: {
    animation: 'creature-swim',
    scale: [1.0, 1.0, 1.0],
    durationRange: [0.1, 0.3],
  },
};

export default function Earth() {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const globe = new THREE.Group();
  const mixers = [];

  this.isRotating = false;
  this.isReadyToRotate = false;

  const sphere = (() => {
    let geometry = new THREE.SphereGeometry(1, 50, 50);
    let material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("../3d/earth@4x.png"),
      shininess: 0,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
  })();

  const starParticles = (() => {
    let geometry = new THREE.Geometry();
    let material = new THREE.PointsMaterial({
      color: 0xBAB479,
      size: 2,
      transparent: true,
    });
    let randCoordinate = () => {
      return THREE.Math.randInt(50, 650) * ((Math.random() >= 0.5) ? 1 : -1);
    };
    for (var p = 0; p < 8831 / 2; p++) {
      geometry.vertices.push(new THREE.Vector3(
        randCoordinate(),
        randCoordinate(),
        randCoordinate(),
      ));
    }
    return new THREE.Points(geometry, material);
  })();

  const planetSprites = (() => {
    let sprites = [];
    planets.forEach(({ name, x, y, z }) => {
      let sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load(`/img/${name}.png`)
      }));
      sprite.position.set(x, y, z);
      sprites.push(sprite);
    });
    return sprites;
  })();

  //
  // Event functions
  //
  const animate = () => {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();
    mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    globe.rotation.y += (this.isReadyToRotate && this.isRotating) ? 0.001 : 0;
    controls.update();
    renderer.render(scene, camera);
  };

  const onModelLoaded = (gltf) => {
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;
    controls.update();
    enableRotation();
    this.isReadyToRotate = true;
    
    scene.add(starParticles);
    scene.add(...planetSprites);

    setTimeout(() => {
      this.el.classList.add('loaded');
    }, 500);

    creatures.forEach(({x, z, type}) => {
      let [sX, sY, sZ] = creatureTypes[type].scale;
      let [minTime, maxTime] = creatureTypes[type].durationRange;
      let animation = creatureTypes[type].animation;
      let creature = SkeletonUtils.clone(gltf.scene);
      let mixer = new THREE.AnimationMixer(creature);
      let clip = THREE.AnimationClip.findByName(gltf.animations, animation);
      let action = mixer.clipAction(clip);

      creature.children[0].scale.set(sX, sY, sZ);
      creature.children[0].rotation.x = x || 0;
      creature.children[0].rotation.z = z || 0;
      mixer.timeScale = THREE.Math.randFloat(minTime, maxTime);

      action.play();
      mixers.push(mixer);
      globe.add(creature);
    });
  };

  const onWindowResize = () => {
    const { width, height } = this.el.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  };

  const disableRotation = () => { this.isRotating = false; };
  const enableRotation = () => { this.isRotating = true; };

  //
  // Public functions
  //
  this.toggleNight = (isVisible) => {
    [...planetSprites, starParticles].forEach((obj) => {
      obj.visible = isVisible;
    });
  };

  //
  // Setup
  //

  this.el = document.querySelector('.earth');
  let { width, height } = this.el.getBoundingClientRect();

  const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 1000);
  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  this.el.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI * 0.35;
  controls.maxPolarAngle = Math.PI * 0.65;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.update();

  globe.add(sphere);
  scene.add(new THREE.AmbientLight(0xFFFFFF));
  scene.add(globe);
  animate();
  onWindowResize();

  window.addEventListener('resize', onWindowResize);
  controls.addEventListener('start', disableRotation);
  controls.addEventListener('end', enableRotation);
  new GLTFLoader().setPath('../3d/').load('CreatureWeb_Creature_WalkAndSwim.glb', onModelLoaded);
}
