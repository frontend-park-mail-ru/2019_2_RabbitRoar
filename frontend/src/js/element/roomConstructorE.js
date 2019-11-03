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
        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.start();

        // ContentF.getPackTabContent(id).then(
        //     templateContent => {
        //         this.root.insertAdjacentHTML("beforeend", Template({ templateContent }));
        //         this._highlightChosen(id);
        //         this.controller.start();
        //     }
        // );
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new RoomConstructorE();