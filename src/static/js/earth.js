import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 

export default () => {
  let scene, camera, renderer, light, controls, sphereGeometry, sphereMaterial, sphere, starTexture, starGeometry, starMaterial, starField, group, boxGeometry, boxMaterial, box, clock, loader, delta;
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  document.querySelector('#earth').appendChild(renderer.domElement); 

  light = new THREE.AmbientLight(0xFFFFFF);
  controls = new OrbitControls(camera, renderer.domElement);

  sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
  sphereMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("../3d/earth@4x.png"),
    shininess: 0,
    // opacity: 0.2,
    // wireframe: true,
    transparent: true,
  });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  starTexture = new THREE.TextureLoader().load("/3d/stars.png");
  starTexture.wrapS = THREE.RepeatWrapping;
  starTexture.wrapT = THREE.RepeatWrapping;
  starTexture.repeat.set(8, 8);

  starGeometry = new THREE.SphereGeometry(1000, 50, 50);
  starMaterial = new THREE.MeshPhongMaterial({
    map: starTexture,
    side: THREE.DoubleSide,
    opacity: 0.01,
    shininess: 0
  });
  starField = new THREE.Mesh(starGeometry, starMaterial);



  group = new THREE.Group();
  boxGeometry = new THREE.BoxGeometry(0.25, 0.5, 0.5);
  boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(1, 0, 0);


  let mixer;
  let creature;
  clock = new THREE.Clock();

  loader = new GLTFLoader().setPath('../3d/');
  loader.load(
    'CreatureWeb_Creature-GLTF_WalkAndSwim.gltf',
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type == "Object3D") {
          // group.add(child);
          console.log();

          creature = child;

          child.scale.set(1.0025, 1.05, 1.0025);

          // usa walker
          // child.rotation.x = 0.85;
          // child.rotation.z = 0.2;

          // south america walker
          // child.rotation.x = 1.65;
          // child.rotation.z = -0.5;

          // africa walker
          // child.rotation.x = 3.75;
          // child.rotation.z = -1.75;

          // asia walker
          // child.rotation.x = -0.8;


          // 'creature-swim'
          // scale (1.0025, 1.05, 1.0025)
          //
          // south america ocean swimmer
          // child.rotation.x = 14.5;

          // hawaii swimmer
          // child.rotation.x = 1;
          // child.rotation.z = 1;

          // atlantic ocean swimmer
          // child.rotation.x = 0.75;
          // child.rotation.z = -0.7;
          
          // indian ocean swimmer
          // child.rotation.x = 4.25;
          // child.rotation.z = -0.25;

          // new zealand swimmer
          // child.rotation.z = 2.35;

          mixer = new THREE.AnimationMixer(gltf.scene);
          // mixer.timeScale = 0.5;
          gltf.animations.forEach((clip) => {
            console.log(clip);
            if (clip.name === 'creature_walkonglobe')
              mixer.clipAction(clip).play();
          });
        }
      });
      const helper = new THREE.SkeletonHelper( gltf.scene );
      scene.add( helper );
      group.add(gltf.scene);
    },
  );


  group.add(sphere);
  scene.add(starField);
  scene.add(light);
  scene.add(group);

  camera.position.z = 5;
  // controls.autoRotate = true;
  controls.autoRotateSpeed = 0.05;
  // controls.minPolarAngle = Math.PI * 0.35;
  // controls.maxPolarAngle = Math.PI * 0.65;
  controls.enablePan = false;
  // controls.enableZoom = false;
  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    // group.rotation.y += 0.001;
    // creature.rotation.z += 0.02;
    // box.rotation.x += 0.004;

    delta = clock.getDelta();
  if (mixer) mixer.update(delta);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();



  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

  }
  window.addEventListener( 'resize', onWindowResize );
}
