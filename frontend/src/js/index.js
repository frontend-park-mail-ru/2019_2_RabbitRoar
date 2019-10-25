import "../css/style.scss";
import { Router } from "./router.js";
import { ROOT, LOGIN, SIGN_UP, PROFILE, SINGLE_GAME } from "./paths";
import { id } from "./modules/id.js";

import MainMenuV from "./view/mainMenuV.js";
import AutorisationV from "./view/autorisationV.js";
import RegistrationV from "./view/registrationV.js";
import ProfileV from "./view/profileV.js";
import SingleGameV from "./view/singleGameV.js";



if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(function (registration) {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
    }).catch(function (err) {
        console.log("ServiceWorker registration failed: ", err);
    });
}

// navigator.serviceWorker.addEventListener("message", function handler(event) {
//     console.log("first data");
//     console.log(event.data.synSobaki);
// });

// navigator.serviceWorker.addEventListener("message", function handler(event) {
//     console.log("second data");
//     console.log(event.data.synSobaki);
// });

// navigator.serviceWorker.getRegistrations().then(function (registrations) {
//   for (let registration of registrations) {
//       console.log("UNREGISTER");
//     registration.unregister();
//   }
// });

window.id = id;

const router = new Router;

router.register(ROOT, MainMenuV);
router.register(LOGIN, AutorisationV);
router.register(SIGN_UP, RegistrationV);
router.register(PROFILE, ProfileV);
router.register(SINGLE_GAME, SingleGameV);

router.start();
