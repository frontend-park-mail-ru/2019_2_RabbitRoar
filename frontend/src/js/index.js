import "../css/style.scss";
import { Router } from "./router.js";
import { ROOT, LOGIN, SIGN_UP, PROFILE } from "./paths";
import { id } from "./modules/id.js";

import MainMenuV from "./view/mainMenuV.js";
import AutorisationV from "./view/autorisationV.js";
import RegistrationV from "./view/registrationV.js";
import ProfileV from "./view/profileV.js";


if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
      navigator.serviceWorker.register("./sw.js").then(function(registration) {
          console.log("ServiceWorker registration successful with scope: ", registration.scope);
      }).catch(function(err) {
          console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// navigator.serviceWorker.getRegistrations().then(function (registrations) {
//   for (let registration of registrations) {
//     registration.unregister();
//   }
// });

window.id = id;

const router = new Router;

router.register(ROOT, MainMenuV);
router.register(LOGIN, AutorisationV);
router.register(SIGN_UP, RegistrationV);
router.register(PROFILE, ProfileV);

router.start();



// import Template from "../css/WEB_LAB.pug"

// const root = document.getElementById("application");
// root.insertAdjacentHTML("beforeend", Template());