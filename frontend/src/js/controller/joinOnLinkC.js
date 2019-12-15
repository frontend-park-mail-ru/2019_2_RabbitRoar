import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";
import GameF from "../fasade/gameF.js";


class JoinOnLinkC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("popup_not_exist_join_link_route", "click", this._processPopUp);
        this.registerHandler("link_join", "click", this._join);
    }

    _join = (event) => {
        const options = {
            packId: "Зачем это?",
            action: "join",
            roomId: event.target.getAttribute("link")
        };

        GameF.CreateGame("online", options).then(
            () => {
                    //SEE: networcWarningC
            }
        ).catch(
            (err) => {
                console.log("GAME CREATE FATAL ERROR");
                console.log(err);
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        );
    }


    _processPopUp = (event) => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }


    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

}

export default new JoinOnLinkC();