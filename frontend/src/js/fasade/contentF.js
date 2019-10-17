import Bus from '../event_bus.js'
import User from '../model/userM.js'
import { USER_VALIDATE, ROUTER_EVENT, PROFILE_UPDATE } from '../modules/events.js'


class ContentF {
    constructor() {
        if (!!ContentF.instance) {
            return ContentF.instance;
        }
        ContentF.instance = this;

        return this;
    }

}

export default new ContentF();