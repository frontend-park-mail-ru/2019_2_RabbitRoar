import { signIn, logout, signUp, changeAvatar, changeTextFields } from '../modules/requests.js'
import Bus from '../event_bus.js'

class User {
    constructor() {
        if (!!User.instance) {
            return User.instance;
        }
        User.instance = this;

        this.autorised = true;
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
        }
    }

    async changeAvatar(formData) {
        await changeAvatar(formData);
    }

    async changeTextFields(changesMap) {
        await changeTextFields(changesMap);
    }

    autorise() {
        this.autorised = true;
    }

    unAutorise() {
        this.autorised = false;
    }

    async exit() {
        await logout();
    }


    async signIn(username, password) {
        await signIn(username, password);
        this.autorised = true;
    }


    async signUp(userStructure) {
        try {
            let response = await signUp(userStructure);
        } catch (error) {
            throw (errpn)
        }
    }
}
export default new User();