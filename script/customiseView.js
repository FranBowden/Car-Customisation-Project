import { settingBtn, closeBtn } from "./main.js";
import { modifyObjects } from "./modelLoader.js";

export let cinematicView = true;
export let windowCam = false;
export let wheelCam = false;
export let defaultCam = false;
export let customMode = false;


 const bodyBtn = document.getElementById("bodybutton");
 const wheelColorBtn = document.getElementById("wheelbutton");
 const windowColorBtn = document.getElementById("windowbutton");

function toggleCameras(currentCam) {
  defaultCam = false;
  wheelCam = false;
  windowCam = false;

  switch (currentCam) {
    case 'defaultCam':
      defaultCam = true;
      break;
    case 'wheelCam':
      wheelCam = true;
      break;
    case 'windowCam':
      windowCam = true;
      break;
    default:
      console.error('Invalid camera type');
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (event) {
    if (!cinematicView) {
      settingBtn.style.display = "none";
    }
  });

  settingBtn.addEventListener("click", function (event) {
    cinematicView = false;
    customMode = true
    defaultCam = true
    toggleButtons(true);
    toggleCustomButtons(true);
  });

  closeBtn.addEventListener("click", function (event) {
    cinematicView = true;
    customMode = false
    defaultCam = false
    toggleButtons(false);
    toggleCustomButtons(false);
    colorMenu.style.display = "none";
  });

  bodyBtn.addEventListener("click", function () {

    let carBody = modifyObjects.filter(
      (obj) => obj.name.toLowerCase().includes("paint_0")
    ).slice(); 
    toggleCameras('defaultCam');
    toggleColorMenu()
    toggleButtons(true);
    changeColor(carBody);
  });

  wheelColorBtn.addEventListener("click", function () {
 
    let wheels = modifyObjects.filter(
      (obj) => obj.name.toLowerCase().includes("r35_wheel_05a_20x11")  //only gets the wheels of the car
    ).slice();
    toggleCameras('wheelCam');
    toggleColorMenu()
    toggleButtons(true);
    changeColor(wheels);
  });

  windowColorBtn.addEventListener("click", function () {
    
    let window = modifyObjects.filter(
      (obj) => obj.name.toLowerCase().includes("r35_windshield") //only gets the glass/windows of car
    ).slice();
    toggleCameras('windowCam');
    toggleColorMenu()
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
          mesh.material.color.set(btn.id );
        });
    });
})
}

