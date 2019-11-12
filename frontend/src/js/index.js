import "../css/style.scss";
import { Router } from "./router.js";
import Bus from "./event_bus.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "./modules/events.js";
import { SERVISE_WORKER_MESSAGE } from "./modules/events.js";
import { ROOT, LOGIN, SIGN_UP, PROFILE, SINGLE_GAME, ROOM_CREATOR, WAITING } from "./paths";
import { id } from "./modules/id.js";

import MainMenuV from "./view/mainMenuV.js";
import AutorisationV from "./view/autorisationV.js";
import RegistrationV from "./view/registrationV.js";
import ProfileV from "./view/profileV.js";
import SingleGameV from "./view/singleGameV.js";
import RoomCreatorV from "./view/roomCreatorV";
import GameWaitingV from "./view/gameWaitingV"
import Worker from "./workers/gameLoader.worker.js";

import ContentF from "./fasade/contentF.js";
//let socket = new WebSocket("wss://svoyak.fun:3010/game/ws");

    // socket.onopen = function (e) {
    //     console.log("[open] Соединение установлено");
    // };

    // socket.onclose = function (event) {
    //     if (event.wasClean) {
    //         console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    //     } else {
    //         console.log(`[close] Соединение прервано, код=${event.code} причина=${event.reason}`);
    //     }
    // };

    // socket.onerror = function (error) {
    //     console.log(`[error] ${error}`);
    //     console.log(error);
    // };


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

router.start();
