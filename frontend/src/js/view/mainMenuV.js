import NavbarE from "../element/navbarE.js";
import TabsE from "../element/tabsE.js";

class MainMenuV {
    constructor(root = document.getElementById("application")) {
        if (!!MainMenuV.instance) {
            this.root = root;
            return MainMenuV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement("div");
        this.navbarDiv.id = "navbar_container";

        this.tabsDiv = document.createElement("div");
        this.tabsDiv.id = "tabs_container";

        MainMenuV.instance = this;
        return this;
    }


    create(data = "") {
        this.root.append(this.navbarDiv);
        this.root.append(this.tabsDiv);

        NavbarE.create(this.navbarDiv);
        TabsE.create(this.tabsDiv);
    }

    destroy() {
        NavbarE.destroy();
        TabsE.destroy();
    }
}
export default new MainMenuV();