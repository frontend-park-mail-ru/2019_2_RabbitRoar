import NavbarE from "../element/navbarE.js";
import RoomConstructorE from "../element/roomConstructorE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";


class RoomConstructorV extends View {};

export default new RoomConstructorV(
    document.getElementById("application"),
    NavbarE,
    RoomConstructorE,
    NetworkWarningE
);