import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { WAITING, ROOM_CREATOR, ROOT } from "../paths.js";
import { ROUTER_EVENT, FORM_CHANGED } from "../modules/events.js";
import GameF from "../fasade/gameF.js";
import { replaceTwoCssClasses } from "../modules/css_operations";
import { roomCreatureVaildation } from "../modules/form_validation";

class RoomConstructorC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.usersCount = 0;
        this.roomName = "";
        this.currentFormPart = 1;
        this.packId = -1;


        this.registerClassHandler(".checkbox", "change", this._checkboxChanged.bind(this));
        this.registerHandler("further", "click", this._goFurther.bind(this));
        this.registerClassHandler(".back", "click", this._goBack.bind(this));
        this.registerClassHandler(".pack-button", "click", this._chosePack.bind(this));

        this.registerHandler("finish", "click", this._finish.bind(this));

        this.registerClassHandler(".tab", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab", "mouseout", this._unLightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab.bind(this));

        Bus.on(FORM_CHANGED, this._processForm.bind(this));
        return this;
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _chosePack(event) {
        const errorPackElement = document.getElementById("error_pack");
        replaceTwoCssClasses(errorPackElement, "error-visible", "error-annotation");
        this.packId = event.target.id;
        document.getElementById("pack-id").innerHTML = "Выбранный пак: " + String(this.packId);
    }

    _processForm(form_number) {
        if (form_number === 2) {
            this.currentFormPart = 2;
            document.getElementById("form-part-2").style.display = "block";
            document.getElementById("form-part-1").style.display = "none";
            return;
        }
        this.currentFormPart = 1;
        document.getElementById("form-part-2").style.display = "none";
        document.getElementById("form-part-1").style.display = "block";
    }

    _checkboxChanged() {
        const messageElement = document.getElementById("password_info");
        if (document.getElementById("checkbox").checked) {
            replaceTwoCssClasses(messageElement, "error-annotation", "info-message");

        } else {
            replaceTwoCssClasses(messageElement, "info-message", "error-annotation");
        }
    }

    _goFurther() {
        const error = roomCreatureVaildation();
        if (error) {
            return;
        }

        this.usersCount = parseInt(document.getElementById("users-number").value);

        this.roomName = document.getElementById("room-name").value;
        Bus.emit(FORM_CHANGED, 2);
    }

    _goBack() {
        this.usersCount = 0;
        this.roomName = "";
        if (this.currentFormPart == 1) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        } else if (this.currentFormPart == 2) {
            Bus.emit(FORM_CHANGED, 1);
        }

    }

    _lightTab(event) {
        event.target.classList.add("tab-hover");
    }

    _unLightTab(event) {
        event.target.classList.remove("tab-hover");
    }

    _finish() {
        const errorPackElement = document.getElementById("error_pack");
        if (this.packId == -1) {
            replaceTwoCssClasses(errorPackElement, "error-annotation", "error-visible");
            errorPackElement.innerHTML = "Необходимо выбрать пак для игры.";
            return;
        }

        var obj = new Object();
        obj.playersCapacity = this.usersCount;
        obj.name = this.roomName;

        GameF.CreateGame("online", this.packId, obj).then(
            () => Bus.emit(ROUTER_EVENT.ROUTE_TO, WAITING)
        );
    }
}

export default new RoomConstructorC();