import NavbarE from "../element/navbarE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import QuestionTableE from "../element/questionTableE";
import GamePanelE from "../element/gamePanelE";
import UsersGamePanelE from "../element/usersGamePanelE";


import { View } from "./view.js";


class OnlineGameV extends View{};

export default new OnlineGameV(
    document.getElementById("application"),
    //NavbarE,
    UsersGamePanelE,
    QuestionTableE,
    GamePanelE,
    NetworkWarningE
);