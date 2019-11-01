import ContentF from "../fasade/contentF.js";
import GameF from "../fasade/gameF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { id } from "../modules/id.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { SINGLE_GAME } from "../paths";

class TabsC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler(id.tabRoom, "click", this._tabClick);
        this.registerHandler(id.tabTop, "click", this._tabClick);
        this.registerHandler(id.tabPack, "click", this._tabClick);
        this.registerHandler(id.tabOffline, "click", this._tabClick);

        this.registerClassHandler(".tab", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab", "mouseout", this._unLightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab.bind(this));

        this.registerClassHandler(".join-button", "click", this._startGame.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }


    _lightTab(event) {
        event.target.classList.add("tab-hover");
    }

    _unLightTab(event) {
        event.target.classList.remove("tab-hover");
    }


    _tabClick(event) {
        ContentF.setCurrentTab(event.target.id);
    }

  

    _startGame(event) {
        let gameMode;

        if (document.getElementById("offline_mode") !== null) {
            gameMode = "offline";
            if (event.target.id === "play") {
                const continueButton = document.getElementById("continue");
                if (continueButton) {
                    const pack_id = event.target.getAttribute("pack_id");
                    continueButton.setAttribute("pack_id", pack_id);
                }

                const popup = document.getElementById("popup");
                if (popup) {
                    popup.classList.toggle("popup_show");
                    return;
                }
            } else if (event.target.id == "cansel") {
                const popup = document.getElementById("popup");
                if (popup) {
                    popup.classList.toggle("popup_show");
                    return;
                }

            }
        }

        const packId = event.target.getAttribute("pack_id");
        GameF.CreateGame(gameMode, packId);
        Bus.emit(ROUTER_EVENT.ROUTE_TO, SINGLE_GAME);
    }
}

export default new TabsC();