import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//creating a scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

const cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 100 ); //light that follows the camera

camera.position.set(10,2,20);
camera.lookAt(0,0,1);
camera.add(cameralight);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xcccccc, 1); //set color to grey

document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

var ambientlight = new THREE.AmbientLight(new THREE.Color(1,1,1),10); //lightens up tires and headlights etc
scene.add(ambientlight);

  

//model mesh:
const loader = new GLTFLoader();
loader.load('model/scene.gltf',
 function (gltf) {

  var model = gltf.scene;
  console.log("Model loaded!"); //check if model is loaded
	model.traverse((o) => {
    if (o.isMesh) {
      const material = o.material;
      console.log("Material:", material); // the material properties
  

      if (material.map) {
        console.log("Texture loaded:", material.map.image.src); //check texture source
      }
    }
});
gltf.scene.visible = true;

var spotlight = new THREE.SpotLight(new THREE.Color(1,1,1), 10000);
  spotlight.position.y=20;
  spotlight.angle = Math.PI / 6;
  spotlight.penumbra = 0.3;
  spotlight.castShadow = true;
  
  spotlight.target=model;
  scene.add(spotlight);
  var spotLightHelper = new THREE.SpotLightHelper( spotlight );
  scene.add( spotLightHelper );


gltf.scene.scale.multiplyScalar(1 * 3);
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});



//update loop func
var UpdateLoop = function ( )
{
  renderer.render(scene,camera);
  requestAnimationFrame(UpdateLoop);
};

requestAnimationFrame(UpdateLoop);

//this function is called when the window is resized
var MyResize = function ( )
{
  //get the new sizes
  var width = window.innerWidth;
  var height = window.innerHeight;
  //then update the renderer
  renderer.setSize(width,height);
  //and update the aspect ratio of the camera
  camera.aspect = width/height;
  //update the projection matrix given the new values
  camera.updateProjectionMatrix();

  //and finally render the scene again
  renderer.render(scene,camera);
};
//link the resize of the window to the update of the camera
window.addEventListener( 'resize', MyResize);