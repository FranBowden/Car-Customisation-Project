import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//creating a scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls( camera, renderer.domElement );

var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5 );
camera.position.set(0,0,20);
camera.lookAt(0,0,1);
camera.add( cameralight );
scene.add(camera);

 //MESH LOADING
 const loader = new GLTFLoader();
 
 // Load a glTF resource
 loader.load(
	 // resource URL
	 '/model/scene.gltf',
	 // called when the resource is loaded
	 function ( gltf ) {
 
		 scene.add( gltf.scene );
 
		 gltf.animations; // Array<THREE.AnimationClip>
		 gltf.scene; // THREE.Group
		 gltf.scenes; // Array<THREE.Group>
		 gltf.cameras; // Array<THREE.Camera>
		 gltf.asset; // Object
 
	 },
	 // called while loading is progressing
	 function ( xhr ) {
 
		 console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
 
	 },
	 // called when loading has errors
	 function ( error ) {
 
		 console.log( 'An error happened' );
 
	 }
 );

 // instantiate a loader
const texloader = new THREE.TextureLoader();


const texture = Promise.all([texloader.load('texture1.jpg'), texloader.load('texture2.jpg')], (resolve, reject) => {
    resolve(texture);
}).then(result => {
    // result in array of textures
});


var MyUpdateLoop = function ( )
{
  renderer.render(scene,camera);
  requestAnimationFrame(MyUpdateLoop);
};

requestAnimationFrame(MyUpdateLoop);

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