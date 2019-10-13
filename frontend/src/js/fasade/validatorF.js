import Bus from '../event_bus.js'
import User from '../model/userM.js'
import {NAVBAR_EVENT, AUTORISATION_EVENT} from '../modules/events.js' 


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;

        Bus.on(NAVBAR_EVENT.GET_AUTORISE, this._getUserAutorise.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_EXIT, this._unAutoriseUser.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_MAIN_MENU, this._getUserAutorise.bind(this));

        Bus.on(AUTORISATION_EVENT.USER_SIGNIN, this._signIn.bind(this));
        return this;
    }


    _getUserAutorise(data) {//NAVBAR_EVENT.GET_AUTORISE, NAVBAR_EVENT.CLICK_MAIN_MENU
        const isAutorised = User.checkAutorise();
        data.callback(isAutorised);
    }


    _unAutoriseUser(data) {//NAVBAR_EVENT.CLICK_EXIT
        if (User.checkAutorise()) {
            User.unAutorise()
            const autorised = User.checkAutorise();
            data.callback(autorised);
        } else {
            data.callback(false);
        }
    }

    _signIn(data) {//AUTORISATION_EVENT.USER_SIGNIN
        const result = User.signIn(data.fromElem);
        data.callback(result);
    }

}
export default new ValidatorF();