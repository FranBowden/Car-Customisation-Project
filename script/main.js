import * as THREE from "three";
import { loadModel, modifyObjects, model } from "./modelLoader.js";
import {speed} from "./cinematicView.js";
import { wheelCam, defaultCam, windowCam, customMode } from "./customiseView.js";

export const settingBtn = document.getElementById("settingBtn");
export const closeBtn = document.getElementById("closeBtn");
export let slowMode = false;



let wheelCamView = new THREE.Vector3(2, -0.5, 0);
let windowCamView = new THREE.Vector3(0, 3, 3);
let backCamView = new THREE.Vector3(2, 2, 3);
let defaultCamView = new THREE.Vector3(3, 2, 3);
const scene = new THREE.Scene();

loadModel(scene);

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(2, 2, 4);
scene.add(camera);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000, 1);

const canvasContainer = document.getElementById("canvas-container");
canvasContainer.appendChild(renderer.domElement);

const pointLight1 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight1.position.set(0, 30, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight2.position.set(30, 0, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xfffffff, 1000, 1000);
pointLight3.position.set(-30, 0, 0);
scene.add(pointLight3);

export let ambientLight = new THREE.AmbientLight(0x00433, 100);

scene.add(ambientLight);
ambientLight.visible = false;

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
  const radius = 4, height = 2;

  if (!customMode) { //continue to spin
    const center = model.position.clone();
  
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

function moveCamera(pos) {
  let distance = camera.position.distanceTo(pos);
  if (distance > 0.01) {
    camera.position.lerp(pos, 0.03);
    camera.lookAt(0, 0, 1);
  }
}


var UpdateLoop = function () {
  if (model ) {
    updateCameraPositions(model, slowMode);
  }

  if(defaultCam) {
    moveCamera(defaultCamView)
  }

  if(wheelCam) {
    moveCamera(wheelCamView)
  }

  if(windowCam) {
    moveCamera(windowCamView)
  }
    
  renderer.render(scene, camera);

  requestAnimationFrame(UpdateLoop);
};
requestAnimationFrame(UpdateLoop);

var MyResize = function () {
  var width = window.innerWidth; //get the new sizes
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix(); //update the projection matrix given the new values
  renderer.render(scene, camera);
};
window.addEventListener("resize", MyResize); //link the resize of the window to the update of the camera