import { settingBtn, closeBtn } from "./main.js";
import { loading } from "./modelLoader.js";

function preloader() {
  settingBtn.style.display = "none";
  closeBtn.style.display = "none";
}

if (loading) {
  preloader();
}
