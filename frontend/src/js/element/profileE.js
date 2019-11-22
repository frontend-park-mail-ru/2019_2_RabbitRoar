import Template from "./templates/profileT.pug";
import Bus from "../event_bus.js";
import ValidatorF from "../fasade/userValidatorF.js";
import ProfileC from "../controller/profileC.js";
import { PROFILE_UPDATE } from "../modules/events.js";


class ProfileE {
    constructor() {
        this.controller = ProfileC;

        Bus.on(PROFILE_UPDATE, this._restartListener);

        return this;
    }

    create = async (root = document.getElementById("application")) => {
        this.root = root;
        const currentUserData = await ValidatorF.getUserData();
        currentUserData.avatar_url = ValidatorF.getFullImageUrl(currentUserData.avatar_url);

        this.root.insertAdjacentHTML("beforeend", Template({ userData: currentUserData }));
        this.controller.start();
    }

    _restartListener = () => {
        this.destroy();
        this.create(this.root);
    }

    destroy = () => {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new ProfileE();