import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

let rendererGetTarget = null;
//

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
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

  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2) {
  rendererGetTarget = new THREE.WebGLRenderTarget(800, 600, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    samples: 1,
  });
} else {
  rendererGetTarget = new THREE.WebGLRenderTarget(800, 600, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });
}

// const rendererTarget = new THREE.WebGLRenderTarget(800, 600, {
//   minFilter: THREE.LinearFilter,
//   magFilter: THREE.LinearFilter,
//   format: THREE.RGBAFormat,
// });

const effectComposer = new EffectComposer(renderer, rendererGetTarget);
// effectComposer.addPass(RenderPass);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const rendererPass = new RenderPass(scene, camera);
effectComposer.addPass(rendererPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
// glitchPass.goWild = true;
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const rgbShiftShaderPass = new ShaderPass(RGBShiftShader);
rgbShiftShaderPass.enabled = false;
effectComposer.addPass(rgbShiftShaderPass);

const gammaCorrectionShaderPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionShaderPass);

// Tint Pass
const tintShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTint: { value: null },
  },
  vertexShader: `
  varying vec2 vuv;
  void main()
  {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    vuv = uv;
  }
    `,
  fragmentShader: `
  varying vec2 vuv;
  uniform sampler2D tDiffuse;
  uniform vec3 uTint;
  void main()
  {
    vec4 color = texture2D(tDiffuse, vuv); 
    color.rgb += uTint;
    gl_FragColor = color;
  } 
  `,
};
const tintShaderPass = new ShaderPass(tintShader);
tintShaderPass.material.uniforms.uTint.value = new THREE.Vector3();
effectComposer.addPass(tintShaderPass);

// Displacement Pass
const displacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: null },
  },
  vertexShader: `
    varying vec2 vuv;
    void main()
    {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      vuv = uv;
    }
      `,
  fragmentShader: `
    varying vec2 vuv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    void main()
    {
      vec2 newvUv = vec2(
        vuv.x,
        vuv.y + sin(vuv.x * 10.0 + uTime) * 0.1
      );
      
      vec4 color = texture2D(tDiffuse, newvUv); 
      gl_FragColor = color;
    } 
    `,
};
const displacementShaderPass = new ShaderPass(displacementShader);
displacementShaderPass.enabled = false;
displacementShaderPass.material.uniforms.uTime.value = 0;
effectComposer.addPass(displacementShaderPass);

// FuturisticDisplacement Pass
const futuristcDisplacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
      varying vec2 vuv;
      void main()
      {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        vuv = uv;
      }
        `,
  fragmentShader: `
      varying vec2 vuv;
      uniform sampler2D tDiffuse;
      uniform sampler2D uNormalMap;
      void main()
      {
        vec3 newColor = texture2D(uNormalMap, vuv).xyz * 2.0 - 1.0;
        vec2 newvUv = vuv + newColor.xy * 0.1;
        
        vec4 color = texture2D(tDiffuse, newvUv);

        vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
            float lightness = clamp(dot(newColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

        gl_FragColor = color;
      }
      `,
};
const futuristcDisplacementShaderPass = new ShaderPass(
  futuristcDisplacementShader
);
futuristcDisplacementShaderPass.material.uniforms.uNormalMap.value =
  textureLoader.load("/textures/interfaceNormalMap.png");
effectComposer.addPass(futuristcDisplacementShaderPass);

gui
  .add(tintShaderPass.material.uniforms.uTint.value, "x")
  .min(0.1)
  .max(2)
  .step(0.01)
  .name("R");
gui
  .add(tintShaderPass.material.uniforms.uTint.value, "y")
  .min(0.1)
  .max(2)
  .step(0.01)
  .name("G");
gui
  .add(tintShaderPass.material.uniforms.uTint.value, "z")
  .min(0.1)
  .max(2)
  .step(0.01)
  .name("B");

const unRealbloomPass = new UnrealBloomPass();
unRealbloomPass.enabled = false;
unRealbloomPass.strength = 0.3;
unRealbloomPass.threshold = 0.6;
unRealbloomPass.radius = 1;
effectComposer.addPass(unRealbloomPass);

gui.add(unRealbloomPass, "enabled");
gui.add(unRealbloomPass, "strength").min(-1).max(1).step(0.01).name("Strength");
gui
  .add(unRealbloomPass, "threshold")
  .min(-1)
  .max(1)
  .step(0.01)
  .name("Threshold");
gui.add(unRealbloomPass, "radius").min(-1).max(10).step(0.01).name("Radius");

if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass();
  effectComposer.addPass(smaaPass);
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  displacementShaderPass.material.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  //   renderer.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
