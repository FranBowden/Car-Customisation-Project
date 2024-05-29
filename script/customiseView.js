import * as THREE from "three";
import { settingBtn, closeBtn } from "./main.js";
import { modifyObjects } from "./modelLoader.js";

export let cinematicView = true;
export let windowCam = false;
export let wheelCam = false;
export let defaultCam = false;
export let insideCam = false;
export let customMode = false;
export let lightCam = false;

const bodyBtn = document.getElementById("bodybutton");
const wheelColorBtn = document.getElementById("wheelbutton");
const windowColorBtn = document.getElementById("windowbutton");
const viewInside = document.getElementById("viewInsideCar");
const lightBtn = document.getElementById("lightButton")
const closeMenuBtn = document.getElementById("closeMenuBtn")


function toggleCameras(currentCam) {
  defaultCam = false;
  wheelCam = false;
  windowCam = false;
  insideCam = false;
  lightCam = false;

  switch (currentCam) {
    case "defaultCam":
      defaultCam = true;
      break;
    case "wheelCam":
      wheelCam = true;
      break;
    case "windowCam":
      windowCam = true;
      break;
    case "insideCam":
      insideCam = true;
      break;
    case "lightCam":
      lightCam = true;
      break;
    default:
      console.error("Invalid camera type");
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function () {
    if (!cinematicView) {
      settingBtn.style.display = "none";
    }
  });

  settingBtn.addEventListener("click", function () {
    cinematicView = false;
    customMode = true;
    defaultCam = true;
    toggleButtons(true);
    toggleCustomButtons(true);
  });

  closeBtn.addEventListener("click", function () {
    cinematicView = true;
    customMode = false;
    defaultCam = false;
    toggleButtons(false);
    toggleCustomButtons(false);
    
    colorMenu.style.display = "none";
  });

  closeMenuBtn.addEventListener("click", function() {
    toggleCameras("defaultCam");
    toggleCustomButtons(true);
    toggleColorMenu(false)
    closeBtn.style.display = "block"
  })

  viewInside.addEventListener("click", function () {
    toggleCameras("insideCam");
    toggleCustomButtons(false);
    toggleButtons(true);
  });

  lightBtn.addEventListener("click", function () {
    let headlights = modifyObjects
      .filter((obj) => obj.name.toLowerCase().includes("headlight"))

    toggleCameras("lightCam");
    toggleCustomButtons(false);
    toggleButtons(true);
    toggleColorMenu(true);
    changeColor(headlights);
  });

  bodyBtn.addEventListener("click", function () {
    let carBody = modifyObjects
      .filter((obj) => obj.name.toLowerCase().includes("paint_0"))
   
    toggleCameras("defaultCam");
    toggleCustomButtons(false);
    toggleButtons(true);
    toggleColorMenu(true);
    changeColor(carBody);
    
  });

  wheelColorBtn.addEventListener("click", function () {
    let wheels = modifyObjects
      .filter(
        (obj) => obj.name.toLowerCase().includes("r35_wheel_05a_20x11") //only gets the wheels of the car
      )  
    
      
    toggleCameras("wheelCam");
    toggleCustomButtons(false);
    toggleButtons(true);
    toggleColorMenu(true);
    changeColor(wheels);
  });

  windowColorBtn.addEventListener("click", function () {
    let windshield = modifyObjects.filter((obj) =>
      obj.name.toLowerCase().includes("windshield")
    );

    let glassdoor = modifyObjects.filter((obj) =>
      obj.name.toLowerCase().includes("glassdoor")
    );

    let window = windshield.concat(glassdoor);
    toggleCustomButtons(false);
    toggleCameras("windowCam");
    toggleButtons(true);
    toggleColorMenu(true);
    changeColor(window);

    window.forEach((child) => {
      const color = child.material.color.clone();
      const newMaterial = new THREE.MeshStandardMaterial({ color: color });

      child.material = newMaterial;
      child.material.opacity = 0.2;
      child.material.transparent = true;
    });
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

function toggleColorMenu(showBtn) {
  const circles = document.querySelectorAll("#colorMenu .circle");
  const colorMenu = document.getElementById("colorMenu");
  colorMenu.style.display = showBtn ? "flex" : "none";
  closeBtn.style.display = "none"
}


function changeColor(carmesh) {
    const circles = document.querySelectorAll("#colorMenu .circle");
    circles.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const colorClass = btn.classList[1];
            carmesh.forEach((mesh) => {
                mesh.material.color.set(colorClass);
            });
           carmesh.length = 0
        });
        
    });
}

