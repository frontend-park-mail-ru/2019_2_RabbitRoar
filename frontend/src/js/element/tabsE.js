import Template from "./templates/tabsT.pug";
import Bus from "../event_bus.js";
import { CHANGE_TAB } from "../modules/events.js";
import ContentF from "../fasade/contentF.js";
import TabsC from "../controller/tabsC.js";


class TabsE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = TabsC;
        Bus.on(CHANGE_TAB, this._restartListener);
    }

    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.controller.start();

        ContentF.getTabContent().then(
            templateContent => {
                templateContent.connection = true;
                this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
                this._highlightChosen(id);
                this.controller.start();
            }
        ).catch(
            () => {
                const templateContent = {
                    contentType: window.id.tabRoom,
                    connection: false
                };
                this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
                this._highlightChosen();
                this.controller.start();
            }
        );
    }

    _restartListener = (event) => {
        this._localDestroy();
        this.create(this.root);
    }

    _highlightChosen = (chosenId) => {
        const targetElems = document.querySelectorAll(".tab");

        if (targetElems) {
            for (const elem of targetElems) {
                elem.className = "tab";
            }

            ContentF.findChosen(targetElems).className = "tab-click";
        }
    }

    _localDestroy = () => {
        this.controller.drop();
        this.root.innerHTML = "";
    }

    destroy = () => {
        ContentF.dropeTabs();
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new TabsE();