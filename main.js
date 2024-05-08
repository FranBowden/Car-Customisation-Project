/*To do List:
 * Allow car to be seperated into different components
 * Add camera animation
 * Get the GUI loaded
 */

import * as THREE from "three";
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

let slowMode = false;
let drivingActivated = false;
let spinning = true;
let customMode = false;
let resetPosition = false

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000, 1); //set color to grey

const canvasContainer = document.getElementById('canvas-container');
canvasContainer.appendChild(renderer.domElement);

let settingBtn = document.getElementById("settingBtn");
let closeBtn = document.getElementById("closeBtn");

settingBtn.style.display = 'none'


const pointLight1 = new THREE.PointLight(0xfffffff, 1000, 1000); // Adjust color, intensity, and distance as needed
pointLight1.position.set(0, 30, 0); // Adjust position
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight2.position.set(30, 0, 0); // Adjust position
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight3.position.set(-30, 0, 0); // Adjust position
scene.add(pointLight3);

let ambientLight = new THREE.AmbientLight( 0x00433, 100 ); // soft white light

// Add the ambient light to the scene initially
scene.add(ambientLight);
ambientLight.visible = false

const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // Adjust width and height as needed
const textureLoader = new THREE.TextureLoader();

textureLoader.load(
    'textures/concrete_floor.jpg',
    function(texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(100, 100); // Adjust repeat values as needed
        const material = new THREE.MeshPhongMaterial({ map: texture,

          transparent: 1, // Black color
          opacity: 0.4});
        const planeMesh = new THREE.Mesh(planeGeometry, material);
        planeMesh.rotation.x = -Math.PI / 2; // Rotate by -90 degrees around the x-axis
        scene.add(planeMesh);
    },
    undefined,
    function(error) {
        console.error('Error loading texture:', error);
    }
);

if(!customMode) {

// Toggle visibility of black bars on mouse down
document.addEventListener('mousedown', function(event) {
  if (settingBtn.contains(event.target) || closeBtn.contains(event.target)) {
    return; //exit if button is clicked instead
}
  if(!customMode) {
  const topBar = document.querySelector('.black-bar.top');
  const bottomBar = document.querySelector('.black-bar.bottom');
  slowMode = true
  // Check if the left mouse button is pressed
  if (event.button === 0) {
      topBar.style.display = 'block';
      bottomBar.style.display = 'block';
      settingBtn.style.display = 'none'
  }
}
});

// Hide black bars on mouse up
document.addEventListener('mouseup', function(event) {
  if (settingBtn.contains(event.target) || closeBtn.contains(event.target)) {
    return; //exit if button is clicked..
}
  const topBar = document.querySelector('.black-bar.top');
  const bottomBar = document.querySelector('.black-bar.bottom');
  slowMode = false;

  if (event.button === 0) {
      topBar.style.display = 'none';
      settingBtn.style.display = 'block'
      bottomBar.style.display = 'none';
  }
});

}

let modifyObjects = []
let model;

const loader = new GLTFLoader();
loader.load(
  "model/scene.gltf",
  function (gltf) {
   
   
    
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

    let progress = document.querySelector('.page-loader');
    progress.style.display = 'none';
    settingBtn.style.display = 'block'
  },
  undefined,
   
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


function updateCameraPositions(model, slowMode) { //allows the camera to move around the car
  const radius = 4; 
  const height = 2; 
  let speed

    if (model) {
        const center = model.position.clone();
        if (slowMode && !customMode) {
            speed = 0.0001;
            ambientLight.visible = true
            shakeCamera(camera, 0.005)
        } else {
            speed = 0.0004;
            ambientLight.visible = false
        }

        const angle = Date.now() * speed;
        const x = center.x + Math.cos(angle) * radius;
        const z = center.z + Math.sin(angle) * radius;
        camera.lookAt(center);
       
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







/*
function driveMode() {
  drivingActivated = true
  spinning = false
  console.log("drivemode activated")

const filteredObjects = modifyObjects.filter(obj => obj.name.toLowerCase().includes('wheel'));
  console.log(filteredObjects)
}
const toggleButton = document.getElementById('btn'); // Assuming you have a button with id="toggleButton"
toggleButton.addEventListener('click',driveMode );

function wheelsMoving() {
 

filteredObjects.forEach(obj => {
    // Calculate the center of the object (assuming it's centered at its own local origin)
    const boundingBox = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Rotate the object around its center
    obj.rotation.x += 0.1;

    // Translate the object back to its original position after rotation
    obj.position.sub(center);
    obj.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0); // Rotate the position
    obj.position.add(center);
});
}
*/

settingBtn.addEventListener("click", function (event) {
  toggleButtons();
});

closeBtn.addEventListener("click", function (event) {
  toggleButtons();
});

let resetCam = new THREE.Vector3(2,2,3);

function toggleButtons() { //toggle setting btn on and off
  let buttons = document.querySelectorAll('.hiddenButton');
  buttons.forEach(function(button) {
    if (button.style.display === 'none') {
    
      settingBtn.style.display = 'none';
      closeBtn.style.display = 'block'; 
      button.classList.add("fade-in");  
      if(resetPosition) {
      
        button.style.display = 'block';
      }
    
      customMode = true;

    } else {
      button.style.display = 'none';
      settingBtn.style.display = 'block';
      closeBtn.style.display = 'none';
      customMode = false;
    }
  });
  resetPosition = false
}
let bodyBtn = document.getElementById("bodybutton") 
let wheelColorBtn = document.getElementById("wheelbutton") 
let windowColorBtn = document.getElementById("windowbutton")


function filterObject() {
  bodyBtn.addEventListener('click', function() {
    let carBody = modifyObjects.filter(obj => obj.name.toLowerCase().includes('paint_0')); //gets the entire body paint 
    assignColor()
    changeColor(carBody)
  })

  wheelColorBtn.addEventListener('click', function() {
    let wheels = modifyObjects.filter(obj => obj.name.toLowerCase().includes('wheel_05')); //gets the entire body paint 
    assignColor()
    changeColor(wheels)
  })

  windowColorBtn.addEventListener('click', function() {
    let window = modifyObjects.filter(obj => obj.name.toLowerCase().includes('r35_windshield')); //gets the entire body paint 
    assignColor()
    changeColor(window)
  })

}

filterObject()




function assignColor() { //very basic idea behind changing color. Needs to be able to take in different mesh arrays
  let colorMenu = document.getElementById('colorMenu')
  let circles = document.querySelectorAll('#colorMenu .circle');
  circles.forEach(function(circle) {
      let colorId = circle.id;
      circle.classList.add(colorId)
  });
    if (colorMenu.style.display == 'none') {
    
      colorMenu.style.display = 'flex'
      closeBtn.style.display = 'none'
      settingBtn.style.display = 'none'
    } else {
      colorMenu.style.display = 'none'
      closeBtn.style.display = 'block'
    }
}


let circles = document.querySelectorAll('#colorMenu .circle');


function changeColor(CarMesh) {

  circles.forEach(function(circle) {
    circle.addEventListener('click', function() {
       
       
        let colorId = circle.id;
  
        let material = new THREE.MeshStandardMaterial({ color: colorId });
        closeBtn.style.display = 'none';
        settingBtn.style.display = 'none'
       
        CarMesh.forEach(mesh => {
            mesh.material = material;
        });
    });
  });
}

var UpdateLoop = function () {
  if (model && !customMode) {
   updateCameraPositions(model, slowMode);
  }

  
    let distance = camera.position.distanceTo(resetCam);
    if (distance > 0.01) { 
        camera.position.lerp(resetCam, 0.03);
        camera.lookAt(0,0,1)
        resetPosition = true
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
