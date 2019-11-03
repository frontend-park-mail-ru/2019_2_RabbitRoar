import NavbarE from "../element/navbarE.js";
import RoomConstructorE from "../element/roomConstructorE.js";

class RoomConstructorV {
    constructor(root = document.getElementById("application")) {
        if (!!RoomConstructorV.instance) {
            this.root = root;
            return RoomConstructorV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement("div");
        this.navbarDiv.id = "navbar_container";

        this.RoomConstructorDiv = document.createElement("div");
        this.RoomConstructorDiv.id = "room_constructor_container";

        RoomConstructorV.instance = this;
        return this;
    }

    create(data = "") {
        this.root.append(this.navbarDiv);
        this.root.append(this.RoomConstructorDiv);

        NavbarE.create(this.navbarDiv);
        RoomConstructorE.create(this.RoomConstructorDiv);
    }

    destroy() {
        NavbarE.destroy();
        RoomConstructorE.destroy();
    }
}
export default new RoomConstructorV();