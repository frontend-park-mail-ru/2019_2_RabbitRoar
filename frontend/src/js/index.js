import "../css/style.scss";
import { Router } from "./router.js";
import Bus from "./event_bus.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "./modules/events.js";
import { ROOT, LOGIN, SIGN_UP, PROFILE, SINGLE_GAME, ROOM_CREATOR, WAITING, PACK_CREATION, PACK_EDITING, ONLINE_GAME } from "./paths";
import { SERVICE_WORKER_CMD } from "./modules/events.js";
import { id } from "./modules/id.js";

import MainMenuV from "./view/mainMenuV.js";
import AutorisationV from "./view/autorisationV.js";
import RegistrationV from "./view/registrationV.js";
import ProfileV from "./view/profileV.js";
import SingleGameV from "./view/singleGameV.js";
import RoomCreatorV from "./view/roomCreatorV";
import GameWaitingV from "./view/gameWaitingV"
import PackCreatorV from "./view/packCreatorV"
import PackEditingV from "./view/packEditingV"
import OnlineGameV from "./view/onlineGameV"



import Worker from "./workers/gameLoader.worker.js";

import ContentF from "./fasade/contentF.js";

//Sentry.init({ dsn: "https://f01fba73e5e04b9eb288a0808cd9940e@sentry.io/1820862" });;;

const worker = new Worker();
window.packWorker = worker;
window.packWorker.onmessage = (msg) => Bus.emit(PACK_WORKER_MESSAGE, msg);
Bus.on(PACK_WORKER_COMMAND, (data) => window.packWorker.postMessage(data));

ContentF.updateLocalPacks().then(
    () => console.log()
);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(function (registration) {
        console.log("sw.js registration successful with scope: ", registration.scope);
    }).catch(function (err) {
        console.log("sw.js registration failed: ", err);
    });

}

Bus.on(SERVICE_WORKER_CMD, (cmd) => {
    if (navigator.serviceWorker.controller === null) {
        return;
    }
    if (!navigator.serviceWorker.controller) {
        console.log("ServiceWorker не поддерживается данным браузером");
    }
    navigator.serviceWorker.controller.postMessage(cmd)
});

// navigator.serviceWorker.addEventListener("message", function handler(event) {
//     console.log(event.data);
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
router.register(ROOM_CREATOR, RoomCreatorV);
router.register(WAITING, GameWaitingV);
router.register(PACK_CREATION, PackCreatorV);
router.register(PACK_EDITING, PackEditingV);
router.register(PACK_EDITING, PackEditingV);
router.register(ONLINE_GAME, OnlineGameV);

router.start();
