import NavbarE from "../element/navbarE.js";
import AutorisationE from "../element/autorisationE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";


class AutorisationV extends View {}

export default new AutorisationV(
    document.getElementById("application"),
    NavbarE,
    AutorisationE,
    NetworkWarningE
);