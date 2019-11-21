import NavbarE from "../element/navbarE.js";
import EditPackE from "../element/editPackE";
import NetworkWarningE from "../element/networkWarningE.js";

import { View } from "./view.js";


class PackEditingV extends View { };

export default new PackEditingV(
    document.getElementById("application"),
    NavbarE,
    EditPackE,
    NetworkWarningE
);