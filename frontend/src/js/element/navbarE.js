import Template from "./templates/navbarT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import NavbarC from "../controller/navbarC.js";

import StaticManager from "../modules/staticManager";

class NavbarE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = NavbarC;
    }

    create(root = document.getElementById("application")) {
        const currentUrl = window.location.pathname;
        let navBarText;
        switch (currentUrl) {
            case "/":
                navBarText = "";
                break;
            case "/login":
                navBarText = "";
                break;
            case "/signup":
                navBarText = "";
                break;
            case "/user/profile":
                navBarText = "";
                break;
            case "/single_game":
                navBarText = "Тренировка";
                break;
            case "/online_game":
                navBarText = "Игра";
                break;
            case "/room":
                navBarText = "Комната";
                break;
            case "/waiting":
                navBarText = "Ожидание игры";
                break;
            case "/pack_creation":
                navBarText = "Создание пака";
                break;
            case "/pack_editing":
                navBarText = "Редактирование пака";
                break;
            default:
                navBarText = "";
        }

        this.root = root;

        const authorized = ValidatorF.checkLocalstorageAutorization();
        if (authorized === true) {
            ValidatorF.getUserData().then (
                (currentUserData) => {
                    const avatarContainer = document.getElementById("nav_profile");

                    const image = document.createElement("IMG");
                    image.src = currentUserData.avatar_url;
                    image.alt = "User";
                    image.id = "avatar";
                    image.classList.add("navbar__user-logo");

                    avatarContainer.insertAdjacentElement("beforeend", image);
                }
            );
        }

        this.root.insertAdjacentHTML("beforeend", Template({
            authorized: authorized,
            chatUrl: StaticManager.chatAvatar
        }));
        
        if (currentUrl === "/") {
            document.getElementById("back").style.visibility = "hidden";
        } else {
            document.getElementById("back").style.visibility = "visible"
        }
        document.getElementById("navigation").innerHTML = navBarText;
        this.controller.startAllListeners();
    }

    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new NavbarE();