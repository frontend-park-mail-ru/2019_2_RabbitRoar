import Template from "./templates/createPackT.pug";
import CreatePackC from "../controller/createPackC.js";
import Bus from "../event_bus.js";
import { CHANGE_VIEW_PACK_CREATION } from "../modules/events.js";

class CreatePackE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = CreatePackC;

        Bus.on(CHANGE_VIEW_PACK_CREATION, this._changeForm);

    }

    _fillThemesInPage = () => {
        this.controller.themes.forEach((theme, index) => {
            const lineId = "Тема " + index;
            const children = document.getElementById(lineId).childNodes;
            children[0].innerHTML = theme;
        });
    }

    _changeForm = () => {
        this.destroy();
        this.create(this.root);
    }

    async create(root = document.getElementById("application")) {
        this.root = root;

        const formNumber = this.controller.currentFormPart;
        this.root.insertAdjacentHTML("beforeend", Template({ formNumber }));
        this.controller.startAllListeners();

        if (formNumber === 2) {
            this._fillThemesInPage();
        }
    }

    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new CreatePackE();