import { signIn, logout, signUp } from '../modules/requests.js'
import Bus from '../event_bus.js'

class User {
    constructor() {
        if (!!User.instance) {
            return User.instance;
        }
        User.instance = this;

        this.autorised = true;
        return this;
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


    async signIn(userData) {
        await signIn(userData.username, userData.password);
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