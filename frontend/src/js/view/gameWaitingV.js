import NavbarE from "../element/navbarE.js";
import PackInfoE from "../element/packInfoE.js";
import UsersPanelE from "../element/usersPanelE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";

class GameWaitingV extends View {};

export default new GameWaitingV(
    document.getElementById("application"),
    NavbarE,
    UsersPanelE,
    PackInfoE,
    NetworkWarningE,
);
