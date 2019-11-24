import Bus from "../event_bus.js";
import { ROUTER_EVENT, PROFILE_UPDATE } from "../modules/events.js";
import { LOGIN, ROOT, staticFiles } from "../paths";
import userM from "../model/userM.js";
import { basePhotoUrl } from "../modules/ajax.js"

const defaultAvatar = window.location.origin + staticFiles.userLogo;
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
        let userInfo;
        if (userM.checkLocalstorageAutorization()) {
            try {
                userInfo = await userM.getData();
            } catch (err) {
                console.log(err);
                userInfo = userM.getNoAutoriseData();
            }
        } else {
            userInfo = userM.getNoAutoriseData();
        }
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