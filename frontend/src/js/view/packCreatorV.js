import NavbarE from "../element/navbarE.js";
import CreatePackE from "../element/createPackE.js";
import NetworkWarningE from "../element/networkWarningE.js";

import { View } from "./view.js";


class PackCreatorV extends View{};

export default new PackCreatorV(
    document.getElementById("application"),
    NavbarE,
    CreatePackE,
    NetworkWarningE
);