import Template from "./templates/tabsT.pug";
import Bus from "../event_bus.js";
import { CHANGE_TAB } from "../modules/events.js";
import ContentF from "../fasade/contentF.js";
import TabsC from "../controller/tabsC.js";


class TabsE {
    constructor() {
        if (!!TabsE.instance) {
            return TabsE.instance;
        }
        TabsE.instance = this;
        this.controller = TabsC;

        Bus.on(CHANGE_TAB, this._restartListener.bind(this));

        return this;
    }

    create(root = document.getElementById("application")) {
        // console.log(`id listeners: ${this.controller.events.size}`);
        console.log(`class listeners ${this.controller.classEvents.get(".tab").size}`);
        this.root = root;
        this.controller.start();
        const id = ContentF.getCurrentTab();

        ContentF.getTabContent(id).then(
            templateContent => {
                this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
                this._highlightChosen(id);
                this.controller.start();
            }
        ).catch(
            (error) => console.log(`ERROR at: tabsE.create - ${error}`)
        );
    }


    _restartListener(event) {
        this.destroy();
        this.create(this.root);
    }

    _highlightChosen(chosenId) {
        const targetElems = document.querySelectorAll(".tab");
        console.log(targetElems);

        if (targetElems) {
            targetElems.forEach(function (elem) {
                if (elem.id === chosenId) {
                    elem.className = "tab-click";
                } else {
                    elem.className = "tab";
                }
            });
        }
    }


    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new TabsE();