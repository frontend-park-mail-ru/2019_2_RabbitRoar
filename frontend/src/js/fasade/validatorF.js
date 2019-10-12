import Bus from '../event_bus.js'
import User from '../model/userM.js'
import {
    GET_AUTORISE_EVENT,
    AUTORISE_DONE_EVENT,
    USER_EXIT_EVENT,
    EXIT_DONE_EVENT}
from '../modules/events.js' 


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;

        Bus.on(GET_AUTORISE_EVENT, this._getUserAutorise.bind(this));
        Bus.on(USER_EXIT_EVENT, this._unAutoriseUser.bind(this));
        return this;
    }


    _getUserAutorise() {//GET_AUTORISE_EVENT
        const isAutorised = User.checkAutorise();
        Bus.emit(AUTORISE_DONE_EVENT, {autorised: isAutorised});
    }


    _unAutoriseUser() {//USER_EXIT_EVENT
        console.log("exit_event");
        if (User.checkAutorise()) {
            User.unAutorise()
            const autorised = User.checkAutorise();
            Bus.emit(EXIT_DONE_EVENT, {autorised: autorised});
        } else {
            Bus.emit(EXIT_DONE_EVENT, {autorised: false});
        }
    }

}
export default new ValidatorF();