import ContentF from "../fasade/contentF.js";
import GameF from "../fasade/gameF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { id } from "../modules/id.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { SINGLE_GAME, ROOM_CREATOR, WAITING, LOGIN, PACK_CREATION } from "../paths";
import ValidatorF from "../fasade/userValidatorF.js";


class TabsC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler(id.tabRoom, "click", this._tabClick);
        this.registerHandler(id.tabTop, "click", this._tabClick);
        this.registerHandler(id.tabPack, "click", this._tabClick);
        this.registerHandler(id.tabAboutGame, "click", this._tabClick);
        this.registerHandler(id.tabOffline, "click", this._tabClick);

        this.registerClassHandler(".tab", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab", "mouseout", this._unLightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab.bind(this));

        this.registerClassHandler(".join-button", "click", this._joinClick.bind(this));
        this.registerHandler("create-pack-button", "click", this._createPack.bind(this));

        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
        this.registerClassHandler(".tab__create-room-btn", "click", this._routeToRoomCreation.bind(this));
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

    _processPopUp(event) {
        if (event.target.id === "continue") {
            this._showOrHidePopUp();
            this._startGame(event);
        } else if (event.target.id == "cansel") {
            this._showOrHidePopUp();
        } else if (event.target.id == "login") {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN);
        }
    }


    _showOrHidePopUp() {
        const popup = document.getElementById("popup");
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    _createPack(){
        if (!ValidatorF.checkLocalstorageAutorization()){
            document.getElementById("popup-elem-top").innerHTML = "Для игры необходимо авторизоваться";
            this._showOrHidePopUp();
        } else {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, PACK_CREATION);
        }
    }

    _joinClick() {
        const continueBtn = document.getElementById("continue");
        if (continueBtn) {
            if (!ValidatorF.checkLocalstorageAutorization() && !document.getElementById("offline_mode")) {
                continueBtn.id = "login";
                document.getElementById("popup-elem-top").innerHTML = "Для игры необходимо авторизоваться";
            } else {
                const join_id = event.target.getAttribute("join_id");
                continueBtn.setAttribute("join_id", join_id);
            }
        }

        this._showOrHidePopUp();
    }

    _startGame(event) {
        let gameMode;
        if (document.getElementById("offline_mode") !== null) {
            gameMode = "offline";
        } else {
            gameMode = "online";
        }
        const clickId = event.target.getAttribute("join_id");
        GameF.CreateGame(gameMode, clickId).then(
            () => {
                if (gameMode === "online") {
                    Bus.emit(ROUTER_EVENT.ROUTE_TO, WAITING);
                } else {
                    Bus.emit(ROUTER_EVENT.ROUTE_TO, SINGLE_GAME);
                }
            }
        );
    }

    _routeToRoomCreation() {
        if (ValidatorF.checkLocalstorageAutorization()) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOM_CREATOR);
        } else {
            document.getElementById("popup-elem-top").innerHTML = "Для создания игры необходимо авторизоваться.";
            const continueButton = document.getElementById("continue");
            if (continueButton) {
                continueButton.id = "login";
            }
            this._showOrHidePopUp();
        }

    }
}

export default new TabsC();