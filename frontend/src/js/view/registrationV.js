import NavbarE from '../element/navbarE.js'
import RegistrationE from '../element/registrationE.js'

class RegistrationV {
    constructor(root = document.getElementById('application')) {
        if (!!RegistrationV.instance) {
            this.root = root;
            return RegistrationV.instance;
        }
        this.root = root;
        RegistrationV.instance = this;
        return this;
    }


    create(data = '') {
        console.log("autorisation view create");
        this.root.innerHTML = '';
        NavbarE.create(this.root);
        RegistrationE.create(this.root);
    }

    destroy() {
        console.log("view destroy");
        NavbarE.destroy();
        RegistrationE.destroy();
    }
}
export default new RegistrationV();