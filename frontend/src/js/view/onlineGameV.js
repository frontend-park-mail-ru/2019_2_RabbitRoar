import NavbarE from "../element/navbarE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import QuestionTableE from "../element/questionTableE";
import GamePanelE from "../element/gamePanelE";



import { View } from "./view.js";


class OnlineGameV extends View{};

export default new OnlineGameV(
    document.getElementById("application"),
    NavbarE,
    QuestionTableE,
    GamePanelE,
    NetworkWarningE
);