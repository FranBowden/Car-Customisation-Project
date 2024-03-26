import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //lets just move around in scene view
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; //load 3d Models


/*Controls */
const controls = new OrbitControls( camera, renderer.domElement );

//creating a scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//loading 3D model

const loader = new GLTFLoader();

loader.load( 'ferrari.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );