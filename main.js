/*To do List:
 * Allow car to be seperated into different components
 * Add camera animation
 * Get the GUI loaded
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//creating a scene
const scene = new THREE.Scene();
const fov = 75; 
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; 
const far = 1000; 

let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.set(0, 2, 4);
camera.lookAt(0, 0, 1);
scene.add(camera);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222, 1); //set color to grey

const canvasContainer = document.getElementById('canvas-container');
canvasContainer.appendChild(renderer.domElement);
//document.body.appendChild(renderer.domElement);

const progressBar = document.getElementById('progress-bar');

const pointLight1 = new THREE.PointLight(0xfffffff, 1000, 1000); // Adjust color, intensity, and distance as needed
pointLight1.position.set(0, 30, 0); // Adjust position
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight2.position.set(30, 0, 0); // Adjust position
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight3.position.set(-30, 0, 0); // Adjust position
scene.add(pointLight3);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableRotate = true

// Create a plane geometry
const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // Adjust width and height as needed

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the texture image
textureLoader.load(
    'concrete_floor.jpg',
    function(texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(100, 100); // Adjust repeat values as needed
        const material = new THREE.MeshPhongMaterial({ map: texture,

          transparent: 1, // Black color
          opacity: 0.4});

        // Create a plane mesh
        const planeMesh = new THREE.Mesh(planeGeometry, material);

        // Rotate the plane downwards
        planeMesh.rotation.x = -Math.PI / 2; // Rotate by -90 degrees around the x-axis

        // Add the plane mesh to the scene
        scene.add(planeMesh);
    },
    undefined, // onProgress callback (optional)
    function(error) {
        console.error('Error loading texture:', error);
    }
);

let slowMode = false;

// Toggle visibility of black bars on mouse down
document.addEventListener('mousedown', function(event) {
  const topBar = document.querySelector('.black-bar.top');
  const bottomBar = document.querySelector('.black-bar.bottom');
  slowMode = true
  // Check if the left mouse button is pressed
  if (event.button === 0) {
    
      topBar.style.display = 'block';
      bottomBar.style.display = 'block';
  }
});

// Hide black bars on mouse up
document.addEventListener('mouseup', function(event) {
  const topBar = document.querySelector('.black-bar.top');
  const bottomBar = document.querySelector('.black-bar.bottom');
  slowMode = false;

  if (event.button === 0) {
      // Hide black bars
      topBar.style.display = 'none';
      bottomBar.style.display = 'none';
  }
});


let modifyObjects = []
let model;



const loader = new GLTFLoader();
loader.load(
  "model/scene.gltf",
  function (gltf) {
    document.getElementById('loader-menu').style.display = 'none';
   
    
    model = gltf.scene;
    console.log("Model loaded!"); //check if model is loaded
    model.traverse((child) => {
      if (child.isMesh) {
        
        const material = new THREE.MeshStandardMaterial({
          color: child.material.color, // You may want to preserve existing color
    
      });
        material.metalness = 1;
        console.log("Material:", material); // the material properties
        modifyObjects.push(child);
        
        if (material.map) {
          console.log("Texture loaded:", material.map.image.src); //check texture source
        }
       
      }
    });
   
    scene.add(gltf.scene);
  },
  
    (xhr) => { //progress bar - Needs updating..
        const progress = (xhr.loaded / xhr.total) * 100;
        progressBar.style.width = progress + '%';
    },
    (error) => {
        console.error('Error loading GLTF model:', error);
    }
);


document.addEventListener("mousedown", function (event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(modifyObjects, true);
  if (intersects.length > 0) {
 
    const selectedObject = intersects[0].object;
    console.log("Selected object:", selectedObject);

        
  } else {
    console.log("Not an object");
  }
});


function updateCameraPositions(model, slowMode) {
  const radius = 4; // Radius of the circular path
  const height = 2; // Height of the camera above the model
  let speed

    if (model) {
        const center = model.position.clone();
        if (slowMode) {
            speed = 0.0001;
            shakeCamera(camera, 0.005)
        } else {
            speed = 0.0004;
        }

        const angle = Date.now() * speed;
        const x = center.x + Math.cos(angle) * radius;
        const z = center.z + Math.sin(angle) * radius;
        camera.lookAt(center);
        // Set the position of the current camera
        if (slowMode) {
          camera.position.set(x, center.y + height, z);

        } else {
            camera.position.set(x, center.y + height, z);
        }

    
    }
}


function shakeCamera(camera, intensity) {

  const offsetX = (Math.random() - 0.5) * intensity;
  const offsetY = (Math.random() - 0.5) * intensity;
  const offsetZ = (Math.random() - 0.5) * intensity;

  const offsetRotX = (Math.random() - 0.5) * intensity * Math.PI / 180;
  const offsetRotY = (Math.random() - 0.5) * intensity * Math.PI / 180;
  const offsetRotZ = (Math.random() - 0.5) * intensity * Math.PI / 180;

  camera.position.x += offsetX;
  camera.position.y += offsetY;
  camera.position.z += offsetZ;

  camera.rotation.x += offsetRotX;
  camera.rotation.y += offsetRotY;
  camera.rotation.z += offsetRotZ;
}


var UpdateLoop = function () {
  if (model) {
   updateCameraPositions(model, slowMode);
  
}

  renderer.render(scene, camera);
  
  requestAnimationFrame(UpdateLoop);
};

requestAnimationFrame(UpdateLoop);




//this function is called when the window is resized
var MyResize = function () {
  //get the new sizes
  var width = window.innerWidth;
  var height = window.innerHeight;
  //then update the renderer
  renderer.setSize(width, height);
  //and update the aspect ratio of the camera
  camera.aspect = width / height;
  //update the projection matrix given the new values
  camera.updateProjectionMatrix();

  //and finally render the scene again
  renderer.render(scene, camera);
};
//link the resize of the window to the update of the camera
window.addEventListener("resize", MyResize);
