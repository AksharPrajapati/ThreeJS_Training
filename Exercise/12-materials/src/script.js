import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
/**
 * Base
 */

/**
 * Debug
 */
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//load textures

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorcolorTexture = textureLoader.load("/textures/door/color.jpg");
const dooralphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorheightTexture = textureLoader.load("/textures/door/height.jpg");
const doormetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doornormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorroughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const gradients3Texture = textureLoader.load("/textures/gradients/3.jpg");
const matcaps1Texture = textureLoader.load("/textures/matcaps/3.png");

gradients3Texture.magFilter = THREE.NearestFilter;
gradients3Texture.minFilter = THREE.NearestFilter;
gradients3Texture.mipmaps = false;

const environmentTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/4/nx.png",
  "/textures/environmentMaps/4/ny.png",
  "/textures/environmentMaps/4/nz.png",
  "/textures/environmentMaps/4/px.png",
  "/textures/environmentMaps/4/py.png",
  "/textures/environmentMaps/4/pz.png",
]);

// Material

// const material = new THREE.MeshBasicMaterial({ map: doorcolorTexture });
// material.color.set(0xff00ff);
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = dooralphaTexture;
// material.side = THREE.BackSide;

// const material = new THREE.MeshNormalMaterial();

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcaps1Texture;

// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("red");

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradients3Texture;

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;
// material.map = doorcolorTexture;
// material.aoMap = doorambientOcclusionTexture;
// // material.aoMapIntensity = 10;
// material.displacementMap = doorheightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doormetalnessTexture;
// material.roughnessMap = doorroughnessTexture;
// material.normalMap = doornormalTexture;
// material.normalScale.set(1, 1);
// material.transparent = true;
// material.alphaMap = dooralphaTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.4;
material.roughness = 0.5;
material.envMap = environmentTexture;

gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);
gui.add(material, "displacementScale").min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lightning
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointingLight = new THREE.PointLight(0xffffff, 0.5);
pointingLight.position.x = 2;
pointingLight.position.y = 3;
pointingLight.position.z = 4;

scene.add(pointingLight);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.2 * elapsedTime;
  plane.rotation.x = 0.2 * elapsedTime;
  torus.rotation.x = 0.2 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
