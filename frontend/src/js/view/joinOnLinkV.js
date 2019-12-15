import NetworkWarningE from "../element/networkWarningE.js";
import JoinOnLinkE from "../element/joinOnLinkE.js";
import { View } from "./view.js";


class MainMenuV extends View{};

export default new MainMenuV(
    document.getElementById("application"),
    JoinOnLinkE,
    NetworkWarningE
);