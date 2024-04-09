import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//creating a scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

const cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5 );
camera.position.set(0,0,20);
camera.lookAt(0,0,1);
//camera.add(cameralight);
scene.add(camera);



const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xcccccc, 1); // Set clear color to light gray with full opacity

document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const loader = new GLTFLoader();
loader.load('model/scene.gltf',
 function (gltf) {

  var model = gltf.scene;
  console.log("Model loaded!");
	model.traverse((o) => {
    if (o.isMesh) {
      const material = o.material;
      console.log("Material:", material); // Inspect the material properties
  
      // Check if textures are loaded (e.g., material.map for diffuse texture)
      if (material.map) {
        console.log("Texture loaded:", material.map.image.src); // Check texture source
      }
    }
});
gltf.scene.visible = true;

gltf.scene.scale.multiplyScalar(1 * 3);
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});


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