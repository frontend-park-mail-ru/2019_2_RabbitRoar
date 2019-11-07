import NavbarE from "../element/navbarE.js";
import QuestionTableE from "../element/questionTableE.js";
import GamePanelE from "../element/gamePanelE.js";
import NetworkWarningE from "../element/networkWarningE.js";

import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths";
import { ROUTER_EVENT } from "../modules/events.js";
import { View } from "./view.js";


class SingleGameV extends View {
    create() {
        if (!GameF.gameExist()) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            return;
        }

        super.create();
    }
};

export default new SingleGameV(
    document.getElementById("application"),
    NavbarE,
    QuestionTableE,
    GamePanelE,
    NetworkWarningE
);
