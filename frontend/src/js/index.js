import "../css/style.scss";
import {Router} from "./router.js";
import {ROOT, LOGIN, SIGN_UP, PROFILE} from "./paths";
import {id} from "./modules/id.js";

import MainMenuV from "./view/mainMenuV.js";
import AutorisationV from "./view/autorisationV.js";
import RegistrationV from "./view/registrationV.js";
import ProfileV from "./view/profileV.js";

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