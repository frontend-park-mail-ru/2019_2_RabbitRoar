import CreateRoomC from "../controller/createRoomC.js";
import Template from "./templates/createRoomT.pug";
import ContentF from "../fasade/contentF.js";
import Bus from "../event_bus.js";
import { CHANGE_VIEW_ROOM_CREATION } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class CreateRoomE {
    constructor() {
        this.controller = CreateRoomC;
        this.root = document.getElementById("application");

        this.allPacks;
        this.userPacks;

        this.packUploaded = false;

        Bus.on(CHANGE_VIEW_ROOM_CREATION, this._changePackContent);
    }

    _changePackContent = () => {
        this.destroy();
        this.create(this.root);
    }

    create = async (root = document.getElementById("application")) => {
        this.root = root;
        if (!this.packUploaded) {
            this.allPacks = await ContentF.getAllPacksForOnline();
            this.userPacks = await ContentF.getUserPacks();
            this.packUploaded = true;
        }

        const tabPackId = this.controller.currentTabId;
        const formNumber = this.controller.currentFormPart;

        let packs;
        let disabledTabId;
        if (tabPackId === "all-packs") {
            packs = this.allPacks;
            disabledTabId = "my-packs";
        } else if (tabPackId === "my-packs") {
            packs = this.userPacks;
            disabledTabId = "all-packs";
        }

        this.root.insertAdjacentHTML("beforeend", Template({ packs, formNumber }));
        if (formNumber === 2) {
            const disabledTabElement = document.getElementById(disabledTabId);
            replaceTwoCssClasses(disabledTabElement, "tab-click", "tab");

            const currentTabElement = document.getElementById(tabPackId);
            replaceTwoCssClasses(currentTabElement, "tab", "tab-click");
        }
        this.controller.startAllListeners();

    }

    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new CreateRoomE();