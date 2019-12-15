import Template from "./templates/tabsT.pug";
import Bus from "../event_bus.js";
import { CHANGE_TAB } from "../modules/events.js";
import ContentF from "../fasade/contentF.js";
import TabsC from "../controller/tabsC.js";
import { TAB } from "../paths";


class TabsE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = TabsC;
    }

    create = (root = document.getElementById("application")) => {
        this.root = root;

        if (window.location.pathname === "/") {
            ContentF.setCurrentTab(TAB[0], false);
        } else {
            ContentF.setCurrentTab(window.location.pathname, false);
        }


        ContentF.getTabContent().then(
            templateContent => {
                templateContent.connection = true;
                this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
                this._highlightChosen();
                this.controller.startAllListeners();
            }
        ).catch(
            () => {
                const templateContent = {
                    contentType: ContentF.getCurrentTab(),
                    connection: false,
                    content: []
                };
                this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
                this._highlightChosen();
                this.controller.startAllListeners();
            }
        );
    }

    _highlightChosen = () => {
        const targetElems = document.querySelectorAll(".tab");

        let left;
        let right;
        const choosen = ContentF.findChosen(targetElems);
        const choosenOrder = choosen.getAttribute("order");
        const maxOrder = document.getElementById("max_order").getAttribute("maxOrder");

        if (targetElems) {
            for (const elem of targetElems) {
                elem.className = "tab";

                if (elem.getAttribute("order") === String(+choosenOrder - 1)) {
                    elem.classList.add("tab-left-click");
                } else if (elem.getAttribute("order") === String(1 + +choosenOrder)) {
                    elem.classList.add("tab-right-click");
                }

                if ((elem.getAttribute("order") === "1") && (elem !== choosen)) {
                    elem.classList.add("tab-left");
                } else if ((elem.getAttribute("order") === maxOrder) && (elem !== choosen)) {
                    elem.classList.add("tab-right");
                }
            }
            choosen.classList.add("tab-click");
            if (choosenOrder === "1") {
                choosen.style.borderLeftWidth = "2px";
            } else if (choosenOrder === maxOrder) {
                choosen.style.borderRightWidth = "2px";
            }
        }
    }

    _localDestroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }

    destroy = () => {
        ContentF.dropeTabs();
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new TabsE();