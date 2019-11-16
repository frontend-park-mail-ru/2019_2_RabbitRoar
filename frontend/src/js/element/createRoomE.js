import CreateRoomC from "../controller/createRoomC.js";
import Template from "./templates/createRoomT.pug";
import ContentF from "../fasade/contentF.js";


class CreateRoomE {
    constructor() {
        this.controller = CreateRoomC;
        return this;
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        const id = "offline_id";
        ContentF.getTabContent(id).then(
            templateContent => {
                this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
                this.controller.start();
            }
        );
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new CreateRoomE();