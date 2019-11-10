import NavbarE from "../element/navbarE.js";
import CreatePackE from "../element/createPackE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import QuestionTableE from "../element/questionTableE.js";

import { View } from "./view.js";


class MainMenuV extends View{};

export default new MainMenuV(
    document.getElementById("application"),
    NavbarE,
    CreatePackE,
    QuestionTableE,
    NetworkWarningE
);