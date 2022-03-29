import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { AdditiveBlending } from "three";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Objects
 */

const objectDistance = 4;
const material = new THREE.MeshToonMaterial({
  gradientMap: gradientTexture,
});
const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 64), material);

const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const torusKont = new THREE.Mesh(
  new THREE.TorusKnotBufferGeometry(0.8, 0.35, 100, 16),
  material
);

torus.position.x = 2;
cone.position.x = -2;
torusKont.position.x = 2;

torus.position.y = -objectDistance * 0;
cone.position.y = -objectDistance * 1;
torusKont.position.y = -objectDistance * 2;

scene.add(torus, cone, torusKont);

const objects = [torus, cone, torusKont];

/**
 * Particles
 */
const particlesCount = 500;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;

  positions[i3] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] =
    (Math.random() - 0.5) * objectDistance * objectDistance * objects.length;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

const particleGeo = new THREE.BufferGeometry();

particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  depthWrite: false,
  blending: AdditiveBlending,
});
const particlePoints = new THREE.Points(particleGeo, particleMaterial);
scene.add(particlePoints);

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
 * On Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", (event) => {
  scrollY = window.scrollY;

  const nextSection = Math.round(window.scrollY / sizes.height);
  if (currentSection !== nextSection) {
    currentSection = nextSection;

    gsap.to(objects[currentSection].rotation, {
      duration: 1.5,
      x: "+=6",
      y: "+=4",
    });
  }
});

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Camera Group
 */

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
// scene.add(camera);
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - currentTime;
  currentTime = elapsedTime;

  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallelX = cursor.x;
  const parallelY = -cursor.y;
  cameraGroup.position.x = parallelX;
  cameraGroup.position.y = parallelY;

  for (const object of objects) {
    object.rotation.y += deltaTime * 0.1;
    object.rotation.x += deltaTime * 0.12;
  }
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
