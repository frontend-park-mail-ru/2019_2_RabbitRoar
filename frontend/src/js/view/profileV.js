import NavbarE from "../element/navbarE.js";
import ProfileE from "../element/profileE.js";

class ProfileV {
    constructor(root = document.getElementById("application")) {
        if (!!ProfileV.instance) {
            this.root = root;
            return ProfileV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement("div");
        this.navbarDiv.id = "navbar_container";

        this.profileDiv = document.createElement("div");
        this.profileDiv.id = "profile_container";

        ProfileV.instance = this;
        return this;
    }


    create() {
        this.root.append(this.navbarDiv);
        this.root.append(this.profileDiv);


        NavbarE.create(this.navbarDiv);
        ProfileE.create(this.profileDiv);
    }

    destroy() {
        NavbarE.destroy();
        ProfileE.destroy();
    }
}
export default new ProfileV();