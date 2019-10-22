import { signIn, logout, signUp, changeAvatar, changeTextFields } from "../modules/requests.js";
import Bus from "../event_bus.js";

class User {
    constructor() {
        if (!!User.instance) {
            return User.instance;
        }
        User.instance = this;

        this.autorised = localStorage.getItem("autorized") || false;
        this.email = "Kekos@mail.ru";
        this.username = "Kekos";
        this.password = "qwerty";
        return this;
    }

    getData() {
        return {
            email: this.email,
            username: this.username,
            password: this.password
        };
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