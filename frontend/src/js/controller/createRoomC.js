import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT, CHANGE_VIEW_ROOM_CREATION } from "../modules/events.js";
import GameF from "../fasade/gameF.js";
import { replaceTwoCssClasses } from "../modules/css_operations";
import { roomCreatureVaildation, hidePackError } from "../modules/form_validation";

class CreateRoomC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.usersCount = 0;
        this.roomName = "";
        this.currentFormPart = 1;
        this.packId = -1;

        this.currentTabId = "my-packs";

        this.registerClassHandler(".checkbox", "change", this._checkboxChanged);
        this.registerHandler("further", "click", this._goFurther);
        this.registerClassHandler(".pack-button", "click", this._chosePack);
        this.registerHandler("finish", "click", this._finish);

        this.registerClassHandler(".tab", "mouseover", this._lightTab);
        this.registerClassHandler(".tab", "mouseout", this._unLightTab);
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab);
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab);

        this.registerHandler("my-packs", "click", this._choseTab);
        this.registerHandler("all-packs", "click", this._choseTab);
        this.registerHandler("back", "click", this._goBack);

        Bus.on(ROUTER_EVENT.ROUTE_TO, this._clearCurrentForm);
    }

    _goBack = () => {
        if (this.currentFormPart == 1) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        } else if (this.currentFormPart == 2) {
            this.currentFormPart = 1;
            Bus.emit(CHANGE_VIEW_ROOM_CREATION);
        }
    }

    _clearCurrentForm = () => {
        this.currentFormPart = 1;
    }

    _choseTab = (event) => {
        const currentTabElement = document.getElementById(this.currentTabId);
        replaceTwoCssClasses(currentTabElement, "tab-click", "tab");

        const newTabElement = document.getElementById(event.target.id);
        replaceTwoCssClasses(newTabElement, "tab", "tab-click");
        this.currentTabId = event.target.id;

        Bus.emit(CHANGE_VIEW_ROOM_CREATION);
    }

    _goToRoot = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

    _chosePack = (event) => {
        hidePackError();
        const previousPackId = this.packId;
        var bodyStyles = window.getComputedStyle(document.body);
        var colorForChoosedPack = bodyStyles.getPropertyValue("--color-success");

        if (previousPackId !== -1) {
            var ordinaryColor = bodyStyles.getPropertyValue("--border-color-theme");
            document.getElementById("pack-name-" + previousPackId).style.color = ordinaryColor;
        }
        this.packId = parseInt(event.target.id, 10);
        document.getElementById("pack-name-" + this.packId).style.color = colorForChoosedPack;
    }

    _checkboxChanged = () => {
        const messageElement = document.getElementById("password_info");
        if (document.getElementById("checkbox").checked) {
            replaceTwoCssClasses(messageElement, "error-annotation", "info-message");
        } else {
            replaceTwoCssClasses(messageElement, "info-message", "error-annotation");
        }
    }

    _goFurther = () => {
        const error = roomCreatureVaildation();
        if (error) {
            return;
        }

        this.usersCount = parseInt(document.getElementById("users-number").value);
        this.roomName = document.getElementById("room-name").value;

        this.currentFormPart = 2;
        Bus.emit(CHANGE_VIEW_ROOM_CREATION);
    }

    _goBack = () => {
        this.usersCount = 0;
        this.roomName = "";
        this.packId = -1;
        if (this.currentFormPart == 1) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        } else if (this.currentFormPart == 2) {
            this.currentFormPart = 1;
            Bus.emit(CHANGE_VIEW_ROOM_CREATION);
        }

    }

    _lightTab = (event) => {
        event.target.classList.add("tab-hover");
    }

    _unLightTab = (event) => {
        event.target.classList.remove("tab-hover");
    }

    _finish = () => {
        const errorPackElement = document.getElementById("error-pack-not-chosen");
        if (this.packId == -1) {
            console.log("in error");
            replaceTwoCssClasses(errorPackElement, "error-annotation", "error-visible");
            errorPackElement.innerHTML = "Необходимо выбрать пак для игры.";
            return;
        }


        var obj = new Object();
        obj.playersCapacity = this.usersCount;
        obj.name = this.roomName;
        obj.pack = this.packId;
        obj.private = false;

        const options = {
            action: "create",
            roomOptions: obj
        }

        GameF.CreateGame("online", options).then(
            () => { return }
        ).catch(
            (err) => {
                console.log("GAME CREATE FATAL ERROR");
                console.log(err);
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        );
    }
}

export default new CreateRoomC();