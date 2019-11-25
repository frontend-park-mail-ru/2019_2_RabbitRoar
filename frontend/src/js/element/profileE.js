import Template from "./templates/profileT.pug";
import Bus from "../event_bus.js";
import ValidatorF from "../fasade/userValidatorF.js";
import ProfileC from "../controller/profileC.js";
import { PROFILE_UPDATE } from "../modules/events.js";


class ProfileE {
    constructor() {
        this.controller = ProfileC;
        Bus.on(PROFILE_UPDATE, this._restartListener);
    }

    create = async (root = document.getElementById("application")) => {
        this.root = root;
        const currentUserData = await ValidatorF.getUserData();

        this.root.insertAdjacentHTML("beforeend", Template({ userData: currentUserData }));
        this.controller.startAllListeners();
    }

    _restartListener = () => {
        this.destroy();
        this.create(this.root);
    }

    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new ProfileE();