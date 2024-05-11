import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export let modifyObjects = [];
export let model;
export let loading = true;

const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // Adjust width and height as needed
const textureLoader = new THREE.TextureLoader();

export function loadModel(scene) {
  textureLoader.load(
    "textures/concrete_floor.jpg",
    function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(100, 100); // Adjust repeat values as needed
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: 1,
        opacity: 0.4,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, material);
      planeMesh.rotation.x = -Math.PI / 2; // Rotate by -90 degrees around the x-axis
      scene.add(planeMesh);
    },
    undefined,
    function (error) {
      console.error("Error loading texture:", error);
    }
  );


  const loader = new GLTFLoader();
  loader.load(
    "model/scene.gltf",
    function (gltf) {
      model = gltf.scene;
      console.log("Model loaded!");
      model.traverse((child) => {
        if (child.isMesh) {
          const material = new THREE.MeshStandardMaterial({
            color: child.material.color,
          });
          material.metalness = 1;
          console.log("Material:", material);
          modifyObjects.push(child);

          if (material.map) {
            console.log("Texture loaded:", material.map.image.src); //check texture source
          }
        }
      });

      scene.add(gltf.scene);

      loading = false;

      let progress = document.querySelector(".page-loader");
      progress.style.display = "none";
      settingBtn.style.display = "block";
    },
    undefined,

    (error) => {
      console.log("Error loading GLTF model:", error);
    }
  );
}
