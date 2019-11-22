import ContentF from "../fasade/contentF.js";
import GameF from "../fasade/gameF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { id } from "../modules/id.js";
import Bus from "../event_bus.js";

import { ROUTER_EVENT } from "../modules/events.js";
import { SINGLE_GAME, ROOM_CREATOR, LOGIN, PACK_CREATION } from "../paths";

import ValidatorF from "../fasade/userValidatorF.js";



class TabsC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler(id.tabRoom, "click", this._tabClick);
        this.registerHandler(id.tabTop, "click", this._tabClick);
        this.registerHandler(id.tabPack, "click", this._tabClick);
        this.registerHandler(id.tabAboutGame, "click", this._tabClick);
        this.registerHandler(id.tabOffline, "click", this._tabClick);

        this.registerClassHandler(".tab", "mouseover", this._lightTab);
        this.registerClassHandler(".tab", "mouseout", this._unLightTab);
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab);
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab);

        this.registerClassHandler(".join-button", "click", this._joinClick);
        this.registerClassHandler(".delete", "click", this._deleteCurrentClass);

        this.registerHandler("create-pack-button", "click", this._createPack);

        this.registerClassHandler(".popup-button", "click", this._processPopUp);
        this.registerClassHandler(".tab__create-room-btn", "click", this._routeToRoomCreation);

    }

    _deleteCurrentClass(event) {
        const packForDelete = event.target.getAttribute("join_id");
        ContentF.deletePackById(packForDelete);
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _lightTab = () => {
        event.target.classList.add("tab-hover");
    }

    _unLightTab = (event) => {
        event.target.classList.remove("tab-hover");
    }


    _tabClick = (event) => {
        ContentF.setCurrentTab(event.target.id);
    }

    _processPopUp = (event) => {
        // if (event.target.id === "continue") {
        //     this._showOrHidePopUp();
        //     this._startGame(event);
        // } 
        if (event.target.id == "cansel") {
            this._showOrHidePopUp();
        } else if (event.target.id == "login") {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN);
        }
    }


    _showOrHidePopUp(popupId = "popup") {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    _createPack = () => {
        if (!ValidatorF.checkLocalstorageAutorization()) {
            document.getElementById("popup-elem-top").innerHTML = "Для создания пака необходимо авторизоваться";
            this._showOrHidePopUp();
        } else {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, PACK_CREATION);
        }
    }

    _joinClick = () => {
        const continueBtn = document.getElementById("continue");
        if (continueBtn) {
            if (!ValidatorF.checkLocalstorageAutorization() && !document.getElementById("offline_mode")) {
                continueBtn.id = "login";
                document.getElementById("popup-elem-top").innerHTML = "Для игры необходимо авторизоваться";
                this._showOrHidePopUp();
            } else {
                this._startGame(event);
            }
            // else {
            //     const join_id = event.target.getAttribute("join_id");
            //     continueBtn.setAttribute("join_id", join_id);
            // }
        }

    }

    _startGame = (event) => {
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
                    //SEE: networcWarningC
                    return;
                } else {
                    Bus.emit(ROUTER_EVENT.ROUTE_TO, SINGLE_GAME);
                }
            }
        );
    }


    _routeToRoomCreation = () => {
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