import NavbarE from "../element/navbarE.js";
import RegistrationE from "../element/registrationE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import { View } from "./view.js";


class RegistrationV extends View {}

export default new RegistrationV(
    document.getElementById("application"),
    NavbarE,
    RegistrationE,
    NetworkWarningE
);