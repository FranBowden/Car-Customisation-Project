import * as THREE from "three";
import { settingBtn, closeBtn } from "./main.js";
import { modifyObjects } from "./modelLoader.js";

export let cinematicView = true;




const bodyBtn = document.getElementById("bodybutton");
const wheelColorBtn = document.getElementById("wheelbutton");
const windowColorBtn = document.getElementById("windowbutton");


let windowCam = false;
export let wheelCam = false;
let defaultCam = true;

let wheelCamView = new THREE.Vector3(2, -0.5, 0);
let windowCamView = new THREE.Vector3(2, 2, 3);
let backCamView = new THREE.Vector3(2, 2, 3);

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (event) {
    if (!cinematicView) {
      settingBtn.style.display = "none";
    }
  });

  settingBtn.addEventListener("click", function (event) {
    cinematicView = false;
    toggleButtons(true); // Makes close button appear
    toggleCustomButtons(true);
  });

  closeBtn.addEventListener("click", function (event) {
    cinematicView = true;
    toggleButtons(false); // Lets settings appear
    toggleCustomButtons(false);
    colorMenu.style.display = "none";
  });

  bodyBtn.addEventListener("click", function () {
    toggleColorMenu()
    let carBody = modifyObjects.filter(
      (obj) => obj.name.toLowerCase().includes("paint_0")
    ).slice(); 
    toggleButtons(true);
    changeColor(carBody);
  });

  wheelColorBtn.addEventListener("click", function () {
    toggleColorMenu()
    let wheels = modifyObjects.filter(
      (obj) => obj.name.toLowerCase().includes("r35_wheel_05a_20x11")  //only gets the wheels of the car
    ).slice();
    toggleButtons(true);
    changeColor(wheels);
  });

  windowColorBtn.addEventListener("click", function () {
    toggleColorMenu()
    let window = modifyObjects.filter(
      (obj) => obj.name.toLowerCase().includes("r35_windshield") //only gets the glass/windows of car
    ).slice();
    toggleButtons(true);
    changeColor(window);
  });
});

function toggleButtons(showBtn) {
  //toggles the main setting buttons e.g. if setting is clicked, then show close btn
  settingBtn.style.display = showBtn ? "none" : "block";
  closeBtn.style.display = showBtn ? "block" : "none";
}

function toggleCustomButtons(showBtn) {
  const buttons = document.querySelectorAll(".hiddenButton");
  buttons.forEach((btn) => {
    btn.style.display = showBtn ? "block" : "none";
  });
  
}

function toggleColorMenu() {
  const circles = document.querySelectorAll("#colorMenu .circle");
  const colorMenu = document.getElementById("colorMenu");
  colorMenu.style.display = "flex";
  closeBtn.style.display = "none";

  circles.forEach(function(circle) {
    let colorId = circle.id;
    circle.classList.add(colorId)
});
}


function changeColor(carmesh) {
  
  const circles = document.querySelectorAll("#colorMenu .circle");
  circles.forEach(function (btn) {
    btn.addEventListener("click", function () {
        carmesh.forEach((mesh) => {
     //     mesh.material = mesh.material.clone()
          mesh.material.color.set(btn.id );
        });
    });
})
}




function moveCamera(pos) {
  let distance = camera.position.distanceTo(pos);
  if (distance > 0.01) {
    camera.position.lerp(pos, 0.03);
    camera.lookAt(0, 0, 1);
  }
}
