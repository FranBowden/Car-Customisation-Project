import { settingBtn, closeBtn, ambientLight } from "./main.js";
import {cinematicView} from "./customiseView.js"
export let speed = 0.0004


function toggleDisplay(showSettingBtn) {
    const topBar = document.querySelector(".black-bar.top");
    const bottomBar = document.querySelector(".black-bar.bottom");
    
    topBar.style.display = showSettingBtn ? "block" : "none";
    bottomBar.style.display = showSettingBtn ? "block" : "none";
    settingBtn.style.display = showSettingBtn ? "none" : "block";
  }
  
  document.addEventListener("mousedown", function (event) {
    if (settingBtn.contains(event.target) || closeBtn.contains(event.target)) {
      return; 
    }
    if(cinematicView) {
          speed = 0.0001;
          ambientLight.visible = true;
          toggleDisplay(true);
  }
  });

  // Hide black bars on mouse up
  document.addEventListener("mouseup", function (event) {
    if (settingBtn.contains(event.target) || closeBtn.contains(event.target)) {
      return;
    }
    if (event.button === 0) {
        speed = 0.0004
        ambientLight.visible = false;
        toggleDisplay(false);
    }
  });

/*
function shakeCamera(camera, intensity) {
    const offsetX = (Math.random() - 0.5) * intensity;
    const offsetY = (Math.random() - 0.5) * intensity;
    const offsetZ = (Math.random() - 0.5) * intensity;
  
    const offsetRotX = ((Math.random() - 0.5) * intensity * Math.PI) / 180;
    const offsetRotY = ((Math.random() - 0.5) * intensity * Math.PI) / 180;
    const offsetRotZ = ((Math.random() - 0.5) * intensity * Math.PI) / 180;
  
    camera.position.x += offsetX;
    camera.position.y += offsetY;
    camera.position.z += offsetZ;
  
    camera.rotation.x += offsetRotX;
    camera.rotation.y += offsetRotY;
    camera.rotation.z += offsetRotZ;
  }*/