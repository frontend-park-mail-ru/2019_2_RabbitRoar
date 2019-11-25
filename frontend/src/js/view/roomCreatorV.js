import NavbarE from "../element/navbarE.js";
import createRoomE from "../element/createRoomE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";


class createRoomV extends View {};

export default new createRoomV(
    document.getElementById("application"),
    NavbarE,
    createRoomE,
    NetworkWarningE
);