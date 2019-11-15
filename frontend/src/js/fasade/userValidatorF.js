import Bus from "../event_bus.js";
import User from "../model/userM.js";
import { USER_VALIDATE, ROUTER_EVENT, PROFILE_UPDATE } from "../modules/events.js";
import { LOGIN, SIGN_UP, ROOT } from "../paths";
import userM from "../model/userM.js";
import contentM from "../model/contentM.js";
import { basePhotoUrl } from "../modules/ajax.js"

const defaultAvatar = "https://pngimage.net/wp-content/uploads/2018/06/user-logo-png-4.png";
//PUBLUC:
//getUserAutorise()
//checkLocalstorageAutorization()
//async getUserData()
//changeTextFields()
//changeUserAvatar()
//async doAutorise()
//async doRegistration()
//doExit()
//async getCSRF()
//unAutorise()
//PRIVATE:


class ValidatorF {
    constructor() {
        this.networkState = window.navigator.onLine;
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
            resolve => { }
        ).catch(
            (error) => console.log(`ERROR at: userValidatorF.doAutorise - ${error}`));
    }

    changeUserAvatar(formData, csrf) {
        userM.changeAvatar(formData, csrf).then(
            resolve => { }
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

    getFullImageUrl(avatarUrlFromServer) {
        if (avatarUrlFromServer == "") {
            return defaultAvatar;
        } else {
            return basePhotoUrl + avatarUrlFromServer;
        }
    }

    getDefaultAvatar() {
        return defaultAvatar;
    }
}
export default new ValidatorF();