import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 250); // Initial camera position

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

let bus, wheelFL, wheelFR, wheelRL, wheelRR; // Variables to store the bus and wheel objects
let home;

// Load the bus model
loader.load(
  './model/scene.gltf',
  function (gltf) {
    bus = gltf.scene;
    bus.scale.set(0.2, 0.2, 0.2); // Adjust scale to make it smaller
    bus.position.set(-900, 17, 0); // Start bus at the left end of the road
    bus.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(bus);

    // Assuming wheel names or indices are known
    wheelFL = bus.getObjectByName("wheelFL"); // Front-left wheel
    wheelFR = bus.getObjectByName("wheelFR"); // Front-right wheel
    wheelRL = bus.getObjectByName("wheelRL"); // Rear-left wheel
    wheelRR = bus.getObjectByName("wheelRR"); // Rear-right wheel
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Error loading the bus model: ", error);
  }
);

loader.load(
  './model/home/scene.gltf', // Path to the home model file
  function (gltf) {
    home = gltf.scene;
    home.scale.set(4, 4, 4); // Adjust the scale of the home
    home.position.set(-300, 0, -175); // Position the home on the side of the road
    scene.add(home);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Error loading the home model: ", error);
  }
);
loader.load(
  './model/home/scene.gltf', // Path to the home model file
  function (gltf) {
    home = gltf.scene;
    home.scale.set(4, 4, 4); // Adjust the scale of the home
    home.position.set(100, 0, -175); // Position the home on the side of the road
    scene.add(home);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Error loading the home model: ", error);
  }
);
loader.load(
  './model/home/scene.gltf', // Path to the home model file
  function (gltf) {
    home = gltf.scene;
    home.scale.set(4, 4, 4); // Adjust the scale of the home
    home.position.set(-600, 0, 280); // Position the home on the side of the road
    scene.add(home);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Error loading the home model: ", error);
  }
);
loader.load(
  './model/home/scene.gltf', // Path to the home model file
  function (gltf) {
    home = gltf.scene;
    home.scale.set(4, 4, 4); // Adjust the scale of the home
    home.position.set(-900, 0, 280); // Position the home on the side of the road
    scene.add(home);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Error loading the home model: ", error);
  }
);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Create a longer road surface
const roadTexture = new THREE.TextureLoader().load('Road2.jpg'); // Load road texture
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(20, 1); // Increase repeat for a longer road

const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
const roadGeometry = new THREE.PlaneGeometry(2000, 250); // Double the road length
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
road.position.set(0, 0, 50); // Place the road under the bus
scene.add(road);

// Render loop with bus and camera animation
let busSpeed = 0.5; // Set to positive for forward motion
let cameraOffsetX = -150; // Initial offset behind the bus
let cameraElevation = 120; // Initial camera elevation

function animate() {
  requestAnimationFrame(animate);

  // Move the bus forward along the x-axis until the end of the road
  if (bus && bus.position.x < 900) {
    bus.position.x += busSpeed;
    bus.position.z = 0; // Keep bus centered on the road

    // Rotate wheels
    const wheelRotationSpeed = 0.1; // Adjust to control rotation speed
    if (wheelFL) wheelFL.rotation.x += wheelRotationSpeed;
    if (wheelFR) wheelFR.rotation.x += wheelRotationSpeed;
    if (wheelRL) wheelRL.rotation.x += wheelRotationSpeed;
    if (wheelRR) wheelRR.rotation.x += wheelRotationSpeed;

    // Camera follows the bus with a smooth position change
    camera.position.x = bus.position.x + cameraOffsetX;
    camera.position.y = cameraElevation;
    camera.lookAt(bus.position);

    // Create a dynamic camera movement effect
    cameraOffsetX = -150 + 50 * Math.sin(bus.position.x * 0.01); // Oscillates behind the bus
    cameraElevation = 120 + 30 * Math.sin(bus.position.x * 0.02); // Elevation oscillates as bus moves
  }

  renderer.render(scene, camera);
}

// Resize listener
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the rendering
animate();
