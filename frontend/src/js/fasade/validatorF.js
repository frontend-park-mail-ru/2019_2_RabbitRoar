import Bus from '../event_bus.js'
import User from '../model/userM.js'
import {NAVBAR_EVENT} from '../modules/events.js' 


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;

        Bus.on(NAVBAR_EVENT.GET_AUTORISE, this._getUserAutorise.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_EXIT, this._unAutoriseUser.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_MAIN_MENU, this._getUserAutorise.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_LOGIN, this._login.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_REG, this._registration.bind(this));
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