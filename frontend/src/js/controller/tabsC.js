import ContentF from "../fasade/contentF.js";
import GameF from "../fasade/gameF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { id } from "../modules/id.js";
import Bus from "../event_bus.js";
import PackM from "../model/packM.js";
import { replaceTwoCssClasses } from "../modules/css_operations";

import { ROUTER_EVENT, PACK_FOR_EDIT_WAS_CHOSEN } from "../modules/events.js";
import { SINGLE_GAME, ROOM_CREATOR, LOGIN, PACK_CREATION, PACK_EDITING, ROOT } from "../paths";
import { WAITING, ONLINE_GAME, TAB } from "../paths";

import ValidatorF from "../fasade/userValidatorF.js";



class TabsC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.noReload = [WAITING, SINGLE_GAME, ONLINE_GAME];

        this.registerHandler(id.tabRoom, "click", this._tabClick);
        this.registerHandler(id.tabTop, "click", this._tabClick);
        this.registerHandler(id.tabPack, "click", this._tabClick);
        this.registerHandler(id.tabAboutGame, "click", this._tabClick);
        this.registerHandler(id.tabOffline, "click", this._tabClick);


        this.registerHandler("resume", "click", this._resume);
        this.registerHandler("leave", "click", this._leave);

        this.registerClassHandler(".tab", "mouseover", this._lightTab);
        this.registerClassHandler(".tab", "mouseout", this._unLightTab);
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab);
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab);

        this.registerClassHandler(".create", "click", this._editPack);

        this.registerClassHandler(".join-button", "click", this._joinClick);
        this.registerClassHandler(".delete", "click", this._deletePack);

        this.registerHandler("create-pack-button", "click", this._createPack);

        this.registerClassHandler(".popup-button", "click", this._processPopUp);

        this.registerClassHandler(".pg-elem", "click", this._paginatorClick);

        this.registerHandler("join_offline_btn", "click", this._playOffline);

        this.registerHandler("create-room-button", "click", this._routeToRoomCreation);
        window.addEventListener("offline", this._offline);

    }


    _offline = () => {
        const path = window.location.pathname;
        if (this.noReload.includes(path)) {
            return;
        }
        this._wasInOffline = true;
        window.location.reload();
    }

    _playOffline = (event) => {
        ContentF.setCurrentTab("/training");
    }

    _editPack = async () => {
        const packIdForEdit = event.target.getAttribute("pack_id");
        await ContentF.setInfoForPackEditing(packIdForEdit);
        Bus.emit(ROUTER_EVENT.ROUTE_TO, PACK_EDITING);
    }


    _deletePack = (event) => {
        const packForDelete = event.target.getAttribute("pack_id");
        ContentF.deletePackById(packForDelete);
        //const tab_ = ContentF.getCurrentTab();
        //Bus.emit(ROUTER_EVENT.ROUTE_TO, tab_);
    }

    startAllListeners() {
        this.enableAll();
    }

    disableAllListeners() {
        this.disableAll();
    }

    _lightTab = (event) => {
        event.target.classList.add("tab-hover");
    }

    _unLightTab = (event) => {
        event.target.classList.remove("tab-hover");
    }


    _tabClick = (event) => {
        ContentF.setCurrentTab(event.target.id);
    }

    _paginatorClick = (event) => {
        const pag = {
            paginator: event.target.parentNode.parentNode.id,
            type: event.target.parentNode.id,
            id: event.target.id
        }

        ContentF.setPaginator(pag);
    }

    _processPopUp = (event) => {
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

    _joinClick = (event) => {
        if ((event.target.id === "leave") || (event.target.id === "resume")) {
            return;
        }
        const continueBtn = document.getElementById("continue");
        if (continueBtn) {
            if (!ValidatorF.checkLocalstorageAutorization() && !document.getElementById("offline_mode")) {
                continueBtn.id = "login";
                document.getElementById("popup-elem-top").innerHTML = "Для игры необходимо авторизоваться";
                this._showOrHidePopUp();
            } else {
                this._startGame(event);
            }
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
        ).catch(
            (err) => {
                console.log("GAME CREATE FATAL ERROR");
                console.log(err);
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        );
    }


    _routeToRoomCreation = () => {
        if (window.navigator.onLine === true) {
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


    _resume = (event) => {
        const lastGameUUID = event.target.getAttribute("room_id");
        GameF.ResumeGame(lastGameUUID).catch(
            (err) => {
                console.log("GAME RECONNECT FATAL ERROR");
                console.log(err);
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        );
    }

    _leave = (event) => {
        const lastGameUUID = event.target.getAttribute("room_id");
        GameF.LeaveGame(lastGameUUID);
    }

}

export default new TabsC();