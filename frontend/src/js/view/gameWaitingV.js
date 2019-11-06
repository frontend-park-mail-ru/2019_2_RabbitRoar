import NavbarE from "../element/navbarE.js";
import TabsE from "../element/tabsE.js";
import UsersPanelE from "../element/usersPanelE.js";

class GameWaitingV {
    constructor(root = document.getElementById("application")) {
        if (!!GameWaitingV.instance) {
            this.root = root;
            return GameWaitingV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement("div");
        this.navbarDiv.id = "navbar_container";

        this.usersPanelDiv = document.createElement("div");
        this.usersPanelDiv.id = "user_panel_container";

        GameWaitingV.instance = this;
        return this;
    }

    create(data = "") {
        this.root.append(this.navbarDiv);
        NavbarE.create(this.navbarDiv);
        UsersPanelE.create(this.navbarDiv);

        // const count = ValidatorF.getUsersCount();

        // this.root.insertAdjacentHTML("beforeend", Template({ authorized: authorized }));
    }

    destroy() {
        NavbarE.destroy();
        UsersPanelE.destroy();
    }
}
export default new GameWaitingV();