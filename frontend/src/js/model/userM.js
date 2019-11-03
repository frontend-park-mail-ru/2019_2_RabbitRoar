import { signIn, logout, signUp, changeAvatar, changeTextFields, getUserInfo } from "../modules/requests.js";
import Bus from "../event_bus.js";

class User {
    constructor() {
        if (!!User.instance) {
            return User.instance;
        }
        User.instance = this;

        if (localStorage.getItem("autorized") === "true"){
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

    async changeAvatar(formData) {
        await changeAvatar(formData);
    }

    async changeTextFields(changesMap) {
        await changeTextFields(changesMap);
    }

    autorise() {
        this.autorised = true;
        localStorage.setItem("autorized", this.autorised);
    }

    unAutorise() {
        this.autorised = false;
    }

    async exit() {
        await logout();
        this.autorised = false;
        localStorage.removeItem("autorized");
    }


    async signIn(username, password) {
        await signIn(username, password);
        this.autorised = true;
        localStorage.setItem("autorized", this.autorised);
    }


    async signUp(userStructure) {
        let response = await signUp(userStructure);
        this.autorised = true;
        localStorage.setItem("autorized", this.autorised);
    }
}
export default new User();