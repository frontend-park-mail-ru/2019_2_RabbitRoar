import { signIn, logout, signUp, changeAvatar, changeTextFields, getUserInfo, getCSRF } from "../modules/requests.js";
import Bus from "../event_bus.js";

class User {
    constructor() {
        if (!!User.instance) {
            return User.instance;
        }
        User.instance = this;

        if (localStorage.getItem("authorized") === "true"){
            this.autorised = true;
        } else {
            this.autorised = false;
        }
        return this;
    }

    async getData() {
        const userInfo = await getUserInfo();
        return userInfo;
    }

    async changeAvatar(formData, csrf) {
        await changeAvatar(formData, csrf);
    }

    async changeTextFields(changesMap, csrf) {
        await changeTextFields(changesMap, csrf);
    }

    autorise() {
        this.autorised = true;
        localStorage.setItem("authorized", this.autorised);
    }

    unAutorise() {
        this.autorised = false;
    }

    checkLocalstorageAutorization(){
        if (localStorage.getItem("authorized") === "true"){
            return true;
        } else {
            return false;
        }
    }

    async exit() {
        await logout();
        this.autorised = false;
        localStorage.removeItem("authorized");
    }


    async signIn(username, password) {
        await signIn(username, password);
        this.autorised = true;
        localStorage.setItem("authorized", this.autorised);
    }


    async signUp(userStructure) {
        let response = await signUp(userStructure);
        this.autorised = true;
        localStorage.setItem("authorized", this.autorised);
    }

    async getCSRF(){
        let csrf = await getCSRF();
        return csrf;
    }
}
export default new User();