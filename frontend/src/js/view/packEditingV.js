import NavbarE from "../element/navbarE.js";
import CreatePackE from "../element/createPackE.js";
import NetworkWarningE from "../element/networkWarningE.js";

import { View } from "./view.js";


class PackEditingV extends View{};

export default new PackEditingV(
    document.getElementById("application"),
    NavbarE,
   // CreatePackE,
    NetworkWarningE
);