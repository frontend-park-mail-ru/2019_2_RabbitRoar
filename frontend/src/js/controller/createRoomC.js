import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT, CHANGE_VIEW_PACK_CREATION } from "../modules/events.js";
import GameF from "../fasade/gameF.js";
import { replaceTwoCssClasses } from "../modules/css_operations";
import { roomCreatureVaildation } from "../modules/form_validation";

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
        //this.registerClassHandler(".back", "click", this._goBack);
        this.registerClassHandler(".pack-button", "click", this._chosePack);
        this.registerHandler("back", "click", this._goToRoot);


        this.registerHandler("finish", "click", this._finish);

        this.registerClassHandler(".tab", "mouseover", this._lightTab);
        this.registerClassHandler(".tab", "mouseout", this._unLightTab);
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab);
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab);

        this.registerHandler("my-packs", "click", this._choseTab);
        this.registerHandler("all-packs", "click", this._choseTab);

        Bus.on(ROUTER_EVENT.ROUTE_TO, this._clearCurrentForm);
    }

    _clearCurrentForm = () => {
        this.currentFormPart = 1;
    }

    _choseTab = (event) => {
        //console.log("текущий таб", this.currentTabId)
        const currentTabElement = document.getElementById(this.currentTabId);
        replaceTwoCssClasses(currentTabElement, "tab-click", "tab");
        // console.log(currentTabElement);
        // console.log(currentTabElement.classList);

        const newTabElement = document.getElementById(event.target.id);
        replaceTwoCssClasses(newTabElement, "tab", "tab-click");
        this.currentTabId = event.target.id;
        //console.log("Новый таб", this.currentTabId)

        Bus.emit(CHANGE_VIEW_PACK_CREATION);
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
        const errorPackElement = document.getElementById("error_pack");
        replaceTwoCssClasses(errorPackElement, "error-visible", "error-annotation");
        this.packId = parseInt(event.target.id, 10);
        document.getElementById("pack-id").innerHTML = "Выбранный пак: " + String(this.packId);
    }

    _processForm = (form_number) => {
        // if (form_number === 2) {
        //     this.currentFormPart = 2;
        //     document.getElementById("form-part-2").style.display = "block";
        //     document.getElementById("form-part-1").style.display = "none";
        //     return;
        // }
        // this.currentFormPart = 1;
        // document.getElementById("form-part-2").style.display = "none";
        // document.getElementById("form-part-1").style.display = "block";
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
        // Bus.emit(FORM_CHANGED_ROOM_CREATION, 2);

        this.currentFormPart = 2;
        Bus.emit(CHANGE_VIEW_PACK_CREATION);


    }

    _goBack = () => {
        alert(this.currentFormPart);
        this.usersCount = 0;
        this.roomName = "";
        console.log("GO BACK ", this.currentFormPart);
        if (this.currentFormPart == 1) {

            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        } else if (this.currentFormPart == 2) {
            // Bus.emit(FORM_CHANGED_ROOM_CREATION, 1);

            this.currentFormPart = 1;
            Bus.emit(CHANGE_VIEW_PACK_CREATION);
        }

    }

    _lightTab = (event) => {
        event.target.classList.add("tab-hover");
    }

    _unLightTab = (event) => {
        event.target.classList.remove("tab-hover");
    }

    _finish = () => {
        const errorPackElement = document.getElementById("error_pack");
        if (this.packId == -1) {
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