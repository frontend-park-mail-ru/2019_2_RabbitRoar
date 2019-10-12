import {ObservableMixin} from './observable_mixin.js'

class Bus {
    constructor(){
        if (!!Bus.instance) {
            return Bus.instance;
        }

        Bus.instance = this;

        Object.assign(this, ObservableMixin);
        return this;
    }
}
export default new Bus();