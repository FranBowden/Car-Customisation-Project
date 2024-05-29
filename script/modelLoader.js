import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export let modifyObjects = [];
export let model;
export let loading = true;


export function loadModel(scene) {
 
  const loader = new GLTFLoader();
  loader.load(
    "model/car/scene.gltf",
    function (gltf) {
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          modifyObjects.push(child);
          const material = new THREE.MeshStandardMaterial({
            color: child.material.color,
          });
          console.log("Material:", material);
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


  const sceneLoader = new GLTFLoader();
  sceneLoader.load(
    "model/road/scene.gltf",function(gltf) {
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          modifyObjects.push(child);
          const material = new THREE.MeshStandardMaterial({
            color: child.material.color,
          });
          console.log("Material:", material);
          if (material.map) {
            console.log("Texture loaded:", material.map.image.src); //check texture source
          }
        }
      });
      scene.add(gltf.scene);
    })

}
