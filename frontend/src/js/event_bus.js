import {ObservableMixin} from "./observable_mixin.js";

class Bus {
    constructor(){
        Object.assign(this, ObservableMixin);
    }
}
export default new Bus();