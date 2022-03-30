import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Fog
 */
const fog = new THREE.Fog("#262837", 1, 15);
// scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

/**
 * Load Gltf Loader
 */

gltfLoader.load("gltf/hunt_park_large_tree/scene.gltf", (gltf) => {
  console.log(gltf);
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.position.set(2, -1, -1);

  scene.add(gltf.scene);
});

gltfLoader.load("gltf/japanese_tori_gate/scene.gltf", (gltf) => {
  console.log(gltf);
  gltf.scene.scale.set(0.3, 0.4, 0.3);
  gltf.scene.position.set(0, 3.4, 9.6);
  gui.add(gltf.scene.position, "x").min(1).max(10).step(0.1).name("gateX");
  gui.add(gltf.scene.position, "y").min(1).max(10).step(0.1).name("gateY");
  gui.add(gltf.scene.position, "z").min(1).max(10).step(0.1).name("gateZ");
  gui.add(gltf.scene.scale, "x").min(1).max(10).step(0.1).name("gateScaleX");
  gui
    .add(gltf.scene.scale, "y")
    .min(0.01)
    .max(0.4)
    .step(0.01)
    .name("gateScaleY");
  gui.add(gltf.scene.scale, "z").min(1).max(10).step(0.1).name("gateScaleZ");

  scene.add(gltf.scene);
});

gltfLoader.load("gltf/wooden_fence/scene.gltf", (gltf) => {
  console.log(gltf);
  gltf.scene.scale.set(0.15, 0.1, 0.21);
  gltf.scene.position.set(5.9, -0.1, 9.6);
  gltf.scene.rotation.set(0, -1.57, 0);

  gui
    .add(gltf.scene.position, "x")
    .min(-5)
    .max(10)
    .step(0.1)
    .name("FancesPostionX");
  gui
    .add(gltf.scene.position, "y")
    .min(-5)
    .max(10)
    .step(0.1)
    .name("FancesPostionY");
  gui
    .add(gltf.scene.position, "z")
    .min(-5)
    .max(10)
    .step(0.1)
    .name("FancesPostionZ");

  gui
    .add(gltf.scene.scale, "x")
    .min(0.01)
    .max(0.4)
    .step(0.01)
    .name("FancesScaleX");
  gui
    .add(gltf.scene.scale, "y")
    .min(0.01)
    .max(0.4)
    .step(0.01)
    .name("FancesScaleY");
  gui
    .add(gltf.scene.scale, "z")
    .min(0.01)
    .max(0.4)
    .step(0.01)
    .name("FancesScaleZ");

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name("FancesRotationY");

  scene.add(gltf.scene);
});

gltfLoader.load("gltf/wooden_fence/scene.gltf", (gltf) => {
  gltf.scene.scale.set(0.15, 0.1, 0.21);
  gltf.scene.position.set(-5.9, -0.1, 9.6);
  gltf.scene.rotation.set(0, -1.57, 0);

  scene.add(gltf.scene);
});

gltfLoader.load("gltf/wooden_fence/scene.gltf", (gltf) => {
  gltf.scene.scale.set(0.15, 0.1, 0.21);
  gltf.scene.position.set(-10, -0.1, 5.4);
  gltf.scene.rotation.set(0, Math.PI, 0);

  scene.add(gltf.scene);

  gui
    .add(gltf.scene.position, "x")
    .min(-15)
    .max(10)
    .step(0.1)
    .name("FancesSidePostionX");
  gui
    .add(gltf.scene.position, "z")
    .min(-15)
    .max(10)
    .step(0.1)
    .name("FancesSidePostionZ");
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name("FancesSideRotaiony");
  gui
    .add(gltf.scene.scale, "z")
    .min(-15)
    .max(10)
    .step(0.01)
    .name("FancesSideScaleZ");
});

gltfLoader.load("gltf/wooden_fence/scene.gltf", (gltf) => {
  gltf.scene.scale.set(0.15, 0.1, 0.21);
  gltf.scene.position.set(10, -0.1, 5.4);
  gltf.scene.rotation.set(0, 0, 0);

  scene.add(gltf.scene);
});
/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

//Wall Texture

const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);
/**
 * Walls
 */
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(3, 2, 3),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAmbientOcclusionTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
  })
);

walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1;
house.add(walls);

/**
 * Roof
 */
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(2.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Load Door Textures
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

/**
 * Door
 */
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.1, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    aoMap: doorAmbientOcclusionTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 1.5 + 0.01;
door.position.y = 0.5;
house.add(door);

/**
 * Bushes
 */
const bushGeoMetry = new THREE.SphereGeometry(0.5, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeoMetry, bushMaterial);
bush1.position.set(0.8, 0, 1.5);
bush1.scale.set(0.8, 0.8, 0.8);

const bush2 = new THREE.Mesh(bushGeoMetry, bushMaterial);
bush2.position.set(1.2, 0, 1.5);
bush2.scale.set(0.3, 0.3, 0.3);

const bush3 = new THREE.Mesh(bushGeoMetry, bushMaterial);
bush3.position.set(-0.8, 0, 1.5);
bush3.scale.set(0.7, 0.7, 0.7);

const bush4 = new THREE.Mesh(bushGeoMetry, bushMaterial);
bush4.position.set(-1.2, 0, 1.5);
bush4.scale.set(0.5, 0.5, 0.5);

house.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
const graves = new THREE.Group();
scene.add(graves);

const graveGeoMetry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeoMetry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

// Temporary sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial({ roughness: 0.7 })
// );
// sphere.position.y = 1;
// scene.add(sphere);

//Floor Texture

const floorColorTexture = textureLoader.load("/textures/grass/color.jpg");
const floorAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const floorNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const floorRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

floorColorTexture.repeat.set(8, 8);
floorAmbientOcclusionTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorRoughnessTexture.repeat.set(8, 8);

floorRoughnessTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;

floorRoughnessTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorAmbientOcclusionTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
    roughness: 2,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;

scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("orange", 1, 7);
doorLight.position.set(0, 1.8, 2);
house.add(doorLight);

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
// scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#0000ff", 2, 3);
scene.add(ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   doorLight.position.x = Math.cos(0.1) * Math.random() * 0.1;
  doorLight.intensity = Math.random();

  //Update Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 3;
  ghost1.position.z = Math.sin(ghost1Angle) * 3;
  //   ghost1.position.y = Math.sin(ghost1Angle) * 4;

  const ghost2Angle = elapsedTime * 0.3;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;

  const ghost3Angle = elapsedTime * 0.13;
  ghost3.position.x = Math.cos(ghost3Angle) * 7;
  ghost3.position.z = Math.sin(ghost3Angle) * 7;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
