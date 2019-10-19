import Bus from '../event_bus.js'
import User from '../model/userM.js'
import { USER_VALIDATE, ROUTER_EVENT, PROFILE_UPDATE } from '../modules/events.js'
import { LOGIN, SIGN_UP, ROOT } from '../paths';
import userM from '../model/userM.js';


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;
        return this;
    }



    getUserAutorise() {
        return User.autorised;
    }

    getUserData() {
        return User.getData();
    }


    doChangeUser(changes) {
        if (userM.change(changes)) {
            Bus.emit(PROFILE_UPDATE);
        } else {

        }
    }

    
    doAutorise(username, password) {
        userM.signIn(username, password).then(
            resolve => Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }

    async doRegistration(userStructure) {
        userM.signUp(userStructure).then(
            resolve => Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doRegistration - ${error}`));
    }

    doExit() {
        userM.exit().then(
            resolve => Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doExit - ${error}`)
        );
    }

}
export default new ValidatorF();