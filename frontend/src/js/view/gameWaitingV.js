import NavbarE from "../element/navbarE.js";
import PackInfoE from "../element/packInfoE.js";
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

        this.packInfoDiv = document.createElement("div");
        this.packInfoDiv.id = "pack_info";

        console.log(this.usersPanelDiv);
        GameWaitingV.instance = this;
        return this;
    }

    create(data = "") {
        this.root.append(this.navbarDiv);
        this.root.append(this.usersPanelDiv);
        this.root.append(this.packInfoDiv);

        NavbarE.create(this.navbarDiv);
        UsersPanelE.create(this.usersPanelDiv);
        PackInfoE.create(this.packInfoDiv);
    }

    destroy() {
        NavbarE.destroy();
        UsersPanelE.destroy();
        PackInfoE.destroy();
    }
}
export default new GameWaitingV();