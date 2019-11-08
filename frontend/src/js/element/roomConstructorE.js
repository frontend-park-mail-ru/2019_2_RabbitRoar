import RoomConstructorC from "../controller/roomConstructorC.js";
import Template from "./templates/roomConstructorT.pug";
import ContentF from "../fasade/contentF.js";


class RoomConstructorE {
    constructor() {
        if (!!RoomConstructorE.instance) {
            return RoomConstructorE.instance;
        }
        RoomConstructorE.instance = this;
        this.controller = RoomConstructorC;
        return this;
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        const id = "offline_id";
        ContentF.getTabContent(id).then(
            templateContent => {
                console.log(templateContent);
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

export default new RoomConstructorE();