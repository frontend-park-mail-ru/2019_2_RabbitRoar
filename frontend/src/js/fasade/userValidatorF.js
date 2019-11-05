import Bus from "../event_bus.js";
import User from "../model/userM.js";
import { USER_VALIDATE, ROUTER_EVENT, PROFILE_UPDATE } from "../modules/events.js";
import { LOGIN, SIGN_UP, ROOT } from "../paths";
import userM from "../model/userM.js";


class ValidatorF {
    constructor() {
        if (!!ValidatorF.instance) {
            return ValidatorF.instance;
        }
        ValidatorF.instance = this;
        return this;
    }

    getUserAutorise() {
        console.log("autorisation returned", User.autorised);
        return User.autorised;
    }

    checkLocalstorageAutorization() {
        const result = userM.checkLocalstorageAutorization();
        return result;
    }

    async getUserData() {
        const userInfo = await User.getData();
        return userInfo;
    }


    changeTextFields(changesMap, csrf) {
        userM.changeTextFields(changesMap, csrf).then(
            resolve => Bus.emit(PROFILE_UPDATE)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }

    changeUserAvatar(formData, csrf) {
        userM.changeAvatar(formData, csrf).then(
            resolve => Bus.emit(PROFILE_UPDATE)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }


    async doAutorise(username, password) {
        userM.signIn(username, password).then(
            async resolve => {
                const currentUserData = await this.getUserData();
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }

    async doRegistration(userStructure) {
        userM.signUp(userStructure).then(
            async resolve => {
                const currentUserData = await this.getUserData();
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT)
            }
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

    async getCSRF() {
        const csrf = await User.getCSRF();
        return csrf;
    }

    unAutorise() {
        userM.unAutorise();
    }

}
export default new ValidatorF();