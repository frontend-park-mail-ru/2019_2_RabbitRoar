import Bus from "../event_bus.js";
import { ROUTER_EVENT, PROFILE_UPDATE } from "../modules/events.js";
import { LOGIN, ROOT, staticFiles } from "../paths";
import UserM from "../model/userM.js";
import { basePhotoUrl } from "../modules/ajax.js"

const defaultAvatar = window.location.origin + staticFiles.userLogo;



class ValidatorF {
    constructor() {
        this.networkState = window.navigator.onLine;
    }

    checkLocalstorageAutorization() {
        const result = UserM.checkLocalstorageAutorization();
        return result;
    }

    async getUserData() {
        let userInfo;
        if (UserM.checkLocalstorageAutorization()) {
            try {
                userInfo = await UserM.getData();
            } catch (err) {
                console.log(err);
                userInfo = UserM.getNoAutoriseData();
            }
        } else {
            userInfo = UserM.getNoAutoriseData();
        }
        return userInfo;
    }

    changeTextFields(changesMap, csrf) {
        UserM.changeTextFields(changesMap, csrf).then(
            resolve => { }
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }

    changeUserAvatar(formData, csrf) {
        UserM.changeAvatar(formData, csrf).then(
            resolve => { }
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }


    async doAutorise(username, password) {
        UserM.signIn(username, password).then(
            async resolve => {
                const currentUserData = await this.getUserData();
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }

    async doRegistration(userStructure) {
        UserM.signUp(userStructure).then(
            async resolve => {
                const currentUserData = await this.getUserData();
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT)
            }
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doRegistration - ${error}`));
    }

    doExit() {
        UserM.exit().then(
            resolve => Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN)
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doExit - ${error}`)
        );
    }

    async getCSRF() {
        const csrf = await UserM.getCSRF();
        return csrf;
    }
}
export default new ValidatorF();