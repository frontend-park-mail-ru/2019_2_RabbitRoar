import Bus from '../event_bus.js'
import User from '../model/userM.js'
import { NAVBAR_EVENT, AUTORISATION_EVENT } from '../modules/events.js'
import { userInfo } from 'os';
import userM from '../model/userM.js';


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;

        Bus.on(USER_MODEL_EVENT, this._processChange.bind(this));


        Bus.on(NAVBAR_EVENT.GET_AUTORISE, this._getUserAutorise.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_EXIT, this._unAutoriseUser.bind(this));
        Bus.on(NAVBAR_EVENT.CLICK_MAIN_MENU, this._getUserAutorise.bind(this));

        Bus.on(AUTORISATION_EVENT.USER_SIGNIN, this._signIn.bind(this));
        return this;
    }



    async getUserAutorise() {
    }


    setExit() {

    }

    async doRegistration() {
        let user = {
            username: document.getElementById('login').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
        };
        userM.signUp(user).then(
            resolve => Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doRegistration - ${error}`)
        );
    }

}
export default new ValidatorF();