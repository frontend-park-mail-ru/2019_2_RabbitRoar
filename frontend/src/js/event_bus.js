import {ObservableMixin} from "./observable_mixin.js";

class Bus {
    constructor(){
        Object.assign(this, ObservableMixin);
        return this;
    }
}
export default new Bus();