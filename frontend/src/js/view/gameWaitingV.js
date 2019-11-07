import NavbarE from "../element/navbarE.js";
import TabsE from "../element/tabsE.js";
import UsersPanelE from "../element/usersPanelE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";

class GameWaitingV extends View {};

export default new GameWaitingV(
    document.getElementById("application"),
    NavbarE,
    UsersPanelE,
    NetworkWarningE
);


// const count = ValidatorF.getUsersCount();

// this.root.insertAdjacentHTML("beforeend", Template({ autorised: autorised }));