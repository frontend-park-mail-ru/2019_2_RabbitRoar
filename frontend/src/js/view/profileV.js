import NavbarE from "../element/navbarE.js";
import ProfileE from "../element/profileE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";


class ProfileV extends View {}

export default new ProfileV(
    document.getElementById("application"),
    NavbarE,
    ProfileE,
    NetworkWarningE
);