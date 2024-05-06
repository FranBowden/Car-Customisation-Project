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
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 2, 4);
camera.lookAt(0, 0, 1);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00111, 1); //set color to grey

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
         // color: 0x000000,
          transparent: 1, // Black color
          opacity: 0.5});

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

const radius = 4; // Radius of the circular path
const speed = 0.0004; // Angular speed (radians per frame)
const height = 2; // Height of the camera above the model
var UpdateLoop = function () {
  
  if (model) {
    const center = model.position.clone();
   //   model.rotation.y -= 0.002; //rotate car 
     
       // Update camera position for circular motion
       const angle = Date.now() * speed;
       const x = center.x + Math.cos(angle) * radius;
       const z = center.z + Math.sin(angle) * radius;
       camera.position.set(x, center.y + height, z);
       camera.lookAt(center);

 
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
