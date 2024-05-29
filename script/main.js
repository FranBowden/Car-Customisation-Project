//importing:
import * as THREE from "three";
import { loadModel, modifyObjects, model } from "./modelLoader.js";
import { speed } from "./cinematicView.js";
import {
  wheelCam,
  defaultCam,
  windowCam,
  insideCam,
  lightCam,
  customMode,
} from "./customiseView.js";


//exporting variables
export const settingBtn = document.getElementById("settingBtn");
export const closeBtn = document.getElementById("closeBtn");
export let ambientLight = new THREE.AmbientLight(0x00433, 100);

//camera position coords: 
let wheelCamView = new THREE.Vector3(2, 0.5, 2);
let windowCamView = new THREE.Vector3(0, 3, 3);
let headlights = new THREE.Vector3(0, 2, 3.5);
let defaultCamView = new THREE.Vector3(3, 2, 3);
let insideCamView = new THREE.Vector3(0, 1.2, -0.5);

const scene = new THREE.Scene(); //create a new scene

let camera = new THREE.PerspectiveCamera( //create a new camera
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);


loadModel(scene); //load model into scene 
scene.add(camera); //add camera to scene 

//creating our canvas/renderer: 
const renderer = new THREE.WebGLRenderer(); //create a new renderer 
renderer.setSize(window.innerWidth, window.innerHeight); //set renderer to the width/height of window
const canvasContainer = document.getElementById("canvas-container");
canvasContainer.appendChild(renderer.domElement); 

//light settings:
const pointLight1 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight1.position.set(0, 30, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight2.position.set(30, 0, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight3.position.set(-30, 0, 0);
scene.add(pointLight3);

scene.add(ambientLight);
ambientLight.visible = false;

//For debugging purposes - Console log out information object that has been selected
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

let previousTime = 0;
let previousAngle = 0;
let currentTime = 0
let currentAngle = 0;

closeBtn.addEventListener("click", function() {
  previousAngle = 0.9
})

function rotateCameraAroundCar(model) { //default camera view - Allows camera to rotate around the car
  if (!customMode) { //as long as it is not in customise mode
    const radius = 4, height = 2;
    const center = model.position.clone()
    center.z -= 35
    currentTime += 1
    let elapsedTime = currentTime - previousTime;
    previousTime = currentTime;

    currentAngle = previousAngle + speed * elapsedTime;
    let x = center.x + Math.cos(currentAngle) * radius;
    let z = center.z + Math.sin(currentAngle) * radius;
    camera.position.set(x, center.y + height, z);
    camera.lookAt(center);

    previousAngle = currentAngle;
  }
}


function moveCamera(pos) { //This function allows the camera to move to certain coords that were previous created when user selects a button
  let distance = camera.position.distanceTo(pos);
  if (distance > 0.01) {
    camera.position.lerp(pos, 0.03);
    camera.lookAt(0, 0, 1);
  }
}

//update function:
var UpdateLoop = function () {
  if (model) {
    rotateCameraAroundCar(model);
  }

  if (defaultCam) {
    moveCamera(defaultCamView);
  }

  if (wheelCam) {
    moveCamera(wheelCamView);
  }

  if (windowCam) {
    moveCamera(windowCamView);
  }

  if (lightCam) {
    moveCamera(headlights);
  }

  if (insideCam) {
    moveCamera(insideCamView);
  }


  renderer.render(scene, camera);

  requestAnimationFrame(UpdateLoop);
};
requestAnimationFrame(UpdateLoop);

//resizing window
var MyResize = function () {
  var width = window.innerWidth; //get the new sizes
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix(); //update the projection matrix given the new values
  renderer.render(scene, camera);
};
window.addEventListener("resize", MyResize); //link the resize of the window to the update of the camera
