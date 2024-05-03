/*To do List:
 * Have the car rotate
 * Allow car to be seperated into different components
 * Add multiple camera angles
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

var cameraSpeed = 0.01;
var objectPosition = new THREE.Vector3();

const cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 100); //light that follows the camera

camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 1);
camera.add(cameralight);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcccccc, 1); //set color to grey

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

let rotationAngle = 0
let modifyObjects = []



let model;
//model mesh:
const loader = new GLTFLoader();
loader.load(
  "car_model/scene.gltf",
  function (gltf) {
    model = gltf.scene;
    console.log("Model loaded!"); //check if model is loaded
    model.traverse((o) => {
      if (o.isMesh) {
        const material = o.material;
        console.log("Material:", material); // the material properties
        modifyObjects.push(o);
        if (material.map) {
          console.log("Texture loaded:", material.map.image.src); //check texture source
        }
      }
    });
  

    gltf.scene.visible = true;

    var spotlight = new THREE.SpotLight(new THREE.Color(1, 1, 1), 10000);
    spotlight.position.y = 20;
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.3;
    spotlight.castShadow = true;

    spotlight.target = model;
    scene.add(spotlight);
    var spotLightHelper = new THREE.SpotLightHelper(spotlight);
    scene.add(spotLightHelper);

    gltf.scene.scale.multiplyScalar(1 * 3);
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
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

    if(selectedObject.name == 'Object_32') {
      z = camera.position.z 
      selectedObject.material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  
     
    }
  } else {
    console.log("Not an object");
  }
});



var UpdateLoop = function () {


  if (model) {
      model.rotation.y -= 0.005;
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
