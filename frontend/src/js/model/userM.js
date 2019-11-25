import { signIn, logout, signUp, changeAvatar, changeTextFields, getUserInfo, getCSRF } from "../modules/requests.js";
import Bus from "../event_bus.js";
import StaticManager from "../modules/staticManager.js";

class User {
    constructor() {
    }

    async getData() {
        const userInfo = await getUserInfo();
        userInfo.avatar_url = StaticManager.getUserUrl(userInfo.avatar_url);
        return userInfo;
    }

    getNoAutoriseData() {
        const userInfo = {};
        userInfo.avatar_url = StaticManager.getUserUrl();
        userInfo.username = "Anon";
        return userInfo;
    }

    async changeAvatar(formData, csrf) {
        await changeAvatar(formData, csrf);
    }

    async changeTextFields(changesMap, csrf) {
        await changeTextFields(changesMap, csrf);
    }

    autorise() {
        localStorage.setItem("authorized", true);
    }

    checkLocalstorageAutorization() {
        if (localStorage.getItem("authorized") === "true") {
            return true;
        } else {
            return false;
        }
    }

    async exit() {
        await logout();
        localStorage.removeItem("authorized");
    }


    async signIn(username, password) {
        await signIn(username, password);
        localStorage.setItem("authorized", true);
    }


    async signUp(userStructure) {
        let response = await signUp(userStructure);
        localStorage.setItem("authorized", true);
    }

    async getCSRF() {
        let csrf = await getCSRF();
        return csrf;
    }


}
export default new User();