import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// scene.add(mesh);
// mesh.scale.set(2, 0.5, 0.5);

//Create group and add to scene and create mesh and add that into group eg. ship, house, etc.

const group = new THREE.Group();
scene.add(group);
group.rotation.y = 1;

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "red" })
);
cube1.position.set(-2, 0, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "yellow" })
);
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "pink" })
);
cube3.position.set(2, 0, 0);
group.add(cube3);

// Axes Helper
const axeshelper = new THREE.AxesHelper(3);
scene.add(axeshelper);

// Rotation
// Reorder use for order the rotation and ideally first we have to rotate Y and then X and then Z so..
// reorder before changing the rotation
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// length => check distance between scene and object
// distanceTo => check distance b/w camera and object
// normlize => normlize to 1
// mesh.position.set(x,y,z)
// mesh.scale.set(x,y,z)

//axeshelper => visible axes to set/move object

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
