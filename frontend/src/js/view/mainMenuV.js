import NavbarE from "../element/navbarE.js";
import TabsE from "../element/tabsE.js";
import NetworkWarningE from "../element/networkWarningE.js";
import UsersPanelE from "../element/usersPanelE.js";
import UsersGamePanelE from "../element/usersGamePanelE.js";
import { View } from "./view.js";


class MainMenuV extends View{};

export default new MainMenuV(
    document.getElementById("application"),
    NavbarE,
    //UsersPanelE,
    //UsersGamePanelE,
    TabsE,
    NetworkWarningE
);