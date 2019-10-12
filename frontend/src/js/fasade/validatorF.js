import Bus from '../event_bus.js'
import User from '../model/userM.js'
import {
    GET_AUTORISE_EVENT,
    USER_EXIT_EVENT,
    USER_MAIN_MENU_EVENT,
    USER_LOGIN_EVENT,
    USER_REG_EVENT
}
from '../modules/events.js' 


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;

        Bus.on(GET_AUTORISE_EVENT, this._getUserAutorise.bind(this));
        Bus.on(USER_EXIT_EVENT, this._unAutoriseUser.bind(this));
        Bus.on(USER_MAIN_MENU_EVENT, this._getUserAutorise.bind(this));
        Bus.on(USER_LOGIN_EVENT, this._login.bind(this));
        Bus.on(USER_REG_EVENT, this._registration.bind(this));
        return this;
    }


    _getUserAutorise(callback) {//GET_AUTORISE_EVENT
        const isAutorised = User.checkAutorise();
        callback(isAutorised);
    }


    _unAutoriseUser(callback) {//USER_EXIT_EVENT
        if (User.checkAutorise()) {
            User.unAutorise()
            const autorised = User.checkAutorise();
            callback(autorised);
        } else {
            callback(false);
        }
    }

    _login(callback) {
        callback();
    }

    _registration(callback) {
        callback();
    }

}
export default new ValidatorF();