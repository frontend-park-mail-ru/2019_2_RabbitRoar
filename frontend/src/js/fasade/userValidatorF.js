import Bus from "../event_bus.js";
import { ROUTER_EVENT, PROFILE_UPDATE } from "../modules/events.js";
import { LOGIN, ROOT, staticFiles } from "../paths";
import UserM from "../model/userM.js";

class ValidatorF {
    constructor() {
        this.networkState = window.navigator.onLine;
        this.userId;
        this.username;
        this.getUserData();
    }

    getCurrentUsername() {
        return this.username;
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
                userInfo = UserM.getNoAutoriseData();
            }
        } else {
            userInfo = UserM.getNoAutoriseData();
        }
        if (!this.userId) {
            this.userId = userInfo.ID;
        }
        if (!this.username) {
            this.username = userInfo.username;
        }
        return userInfo;
    }

    changeTextFields(changesMap, csrf) {
        UserM.changeTextFields(changesMap, csrf).then(
            resolve => { }
        ).catch(
            //(error) => console.log(`ERROR at: userValidatorF.changeTextFields - ${error}`)
        );
    }

    changeUserAvatar(formData, csrf) {
        UserM.changeAvatar(formData, csrf).then(
            resolve => { }
        ).catch(
            //(error) => console.log(`ERROR at: userValidatorF.changeUserAvatar - ${error}`)
        );
    }


    async doAutorise(username, password) {
        UserM.signIn(username, password).then(
            async resolve => {
                const currentUserData = await this.getUserData();
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
            }
        )
    }

    async doRegistration(userStructure) {
        UserM.signUp(userStructure).then(
            async resolve => {
                const currentUserData = await this.getUserData();
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT)
            }
        ).catch(
            // (error) => console.log(`ERROR at: userValidatorF.doRegistration - ${error}`)
        );
    }

    doExit() {
        UserM.exit().then(
            resolve => Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN)
        ).catch(
            (err) => {
                console.log("Оффлайн выход - успешно")
                Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN);
            }
        );
    }

    async getCSRF() {
        const csrf = await UserM.getCSRF();
        return csrf;
    }
}
export default new ValidatorF();