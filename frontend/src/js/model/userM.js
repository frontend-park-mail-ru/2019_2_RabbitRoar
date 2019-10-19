import { signIn, logout, signUp } from '../modules/requests.js'

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

    change(changes) {
        //send changes;

        for (const key in changes) {
            console.log(changes[key]);
            this[key] = changes[key];
        }
        return true;
    }

    autorise() {
        this.autorised = true;
    }

    unAutorise() {
        this.autorised = false;
    }

    async exit() {
        await logout();
        return true;
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