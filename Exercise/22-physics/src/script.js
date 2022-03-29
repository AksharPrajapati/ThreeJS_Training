import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANON, { World } from "cannon";

/**
 * Debug
 */
const gui = new dat.GUI();

const parametes = {};
parametes.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

parametes.createBox = () => {
  createBoxes(Math.random() * 1, Math.random() * 1, Math.random() * 1, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

parametes.reset = () => {
  for (const object of objectsToUpdate) {
    object.body.removeEventListener("collide", playMusic);
    world.removeBody(object.body);

    scene.remove(object.mesh);

    objectsToUpdate.slice(0, objectsToUpdate.length);
  }
};

gui.add(parametes, "createSphere");
gui.add(parametes, "createBox");
gui.add(parametes, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

//AUDIO

const hitSound = new Audio("/sounds/hit.mp3");

const playMusic = (collide) => {
  const impactStrength = collide.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) {
    hitSound.currentTime = 0;
    hitSound.volume = Math.random();
    hitSound.play();
  }
};

// Scene
const scene = new THREE.Scene();
const world = new CANON.World();

// Optimization
world.broadphase = new CANON.SAPBroadphase(world);
world.allowSleep = true;

world.gravity.set(0, -9.82, 0);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Physics
 */

// const concreteMaterial = new CANON.Material("concrete");
// const plasticMaterial = new CANON.Material("plastic");
const defaultMaterial = new CANON.Material("default");

const defaultContactMateral = new CANON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.9,
  }
);

world.addContactMaterial(defaultContactMateral);
world.defaultContactMaterial = defaultContactMateral;

// const sphereShape = new CANON.Sphere(0.5);
// const sphereBody = new CANON.Body({
//   mass: 1,
//   position: new CANON.Vec3(0, 2, 0),
//   shape: sphereShape,
// });
// sphereBody.applyLocalForce(new CANON.Vec3(250, 0, 0), new CANON.Vec3(0, 0, 0));
// world.add(sphereBody);

const floorShape = new CANON.Plane();
const floorBody = new CANON.Body({
  mass: 0,
  shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new CANON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.add(floorBody);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const objectsToUpdate = [];

const sphereGeo = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
  metalness: 0.3,
  roughness: 0.4,
});
// const createSphere = (radius, position) => {
//   // Three.js Sphere

//   const mesh = new THREE.Mesh(sphereGeo, sphereMaterial);
//   mesh.castShadow = true;
//   mesh.position.copy(position);
//   mesh.scale.set(radius, radius, radius);
//   scene.add(mesh);

//   // Canon.js Sphere

//   const shape = new CANON.Sphere(radius);
//   const body = new CANON.Body({
//     mass: 1,
//     position: new CANON.Vec3(0, 3, 0),
//     shape,
//     material: defaultMaterial,
//   });
//   world.add(body);

//   objectsToUpdate.push({
//     mesh,
//     body,
//   });
// };

// createSphere(0.5, { x: 5, y: 3, z: 0 });

const BoxGeo = new THREE.BoxGeometry(1, 1, 1);
const BoxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const createBoxes = (height, width, depth, position) => {
  // Three.js BOX

  const mesh = new THREE.Mesh(BoxGeo, BoxMaterial);
  mesh.castShadow = true;
  mesh.position.copy(position);
  mesh.scale.set(height, width, depth);
  scene.add(mesh);

  // Canon.js Box

  const shape = new CANON.Box(
    new CANON.Vec3(height * 0.5, width * 0.5, depth * 0.5)
  );
  const body = new CANON.Body({
    mass: 1,
    position: new CANON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.addEventListener("collide", playMusic);
  world.add(body);

  objectsToUpdate.push({
    mesh,
    body,
  });
};

createBoxes(2, 2, 2, { x: 1, y: 1, z: 1 });

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //   sphereBody.applyForce(new CANON.Vec3(-0.5, 0, 0), sphereBody.position);
  world.step(1 / 60, deltaTime, 3);
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }
  //   sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
