import Template from "./templates/navbarT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import NavbarC from "../controller/navbarC.js";

class NavbarE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = NavbarC;
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        let avatar;
        const authorized = ValidatorF.checkLocalstorageAutorization();

        if (authorized === true) {
            ValidatorF.getUserData().then(
                (currentUserData) => {
                    avatar = ValidatorF.getFullImageUrl(currentUserData.avatar_url);
                    const avatarContainer = document.getElementById("nav_profile");

                    const image = document.createElement("IMG");
                    image.src = avatar;
                    image.alt = "User";
                    image.id = "avatar";
                    image.classList.add("navbar__user-logo");

                    avatarContainer.insertAdjacentElement("beforeend", image);
                }
            );
        }
        this.root.insertAdjacentHTML("beforeend", Template({ authorized: authorized }));
        this.controller.start();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new NavbarE();