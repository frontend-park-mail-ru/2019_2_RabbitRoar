import ContentF from "../fasade/contentF.js";
import GameF from "../fasade/gameF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { id } from "../modules/id.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT, WEBSOCKET_CONNECTION } from "../modules/events.js";
import { SINGLE_GAME, ROOM_CREATOR, WAITING, LOGIN, ROOT } from "../paths";
import ValidatorF from "../fasade/userValidatorF.js";
import WebSocketIface from "../modules/webSocketIface.js"



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

        this.registerClassHandler(".join-button", "click", this._joinClick.bind(this));
        // this.registerClassHandler(".join-button-training", "click", this._joinTraining.bind(this));

        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
        this.registerClassHandler(".create-room-btn", "click", this._routeToRoomCreation.bind(this));

        Bus.on(WEBSOCKET_CONNECTION, this._onlineCreateResult.bind(this));
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
        const clickId = event.target.getAttribute("join_id");
        const options = {};

        let gameMode;
        if (document.getElementById("offline_mode") !== null) {
            gameMode = "offline";

            options.packId = clickId;
        } else {
            gameMode = "online";

            options.action = "join";
            options.roomId = clickId;
        }

        GameF.CreateGame(gameMode, options).then(
            () => {
                if (gameMode === "online") {
                    //SEE: this._onlineCreateResult()
                    return;
                } else {
                    Bus.emit(ROUTER_EVENT.ROUTE_TO, SINGLE_GAME);
                }
            }
        );
    }

    _onlineCreateResult(connect) {
        if (connect) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, WAITING);
        } else {
            alert("Не удалось подключиться к комнате");
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        }
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