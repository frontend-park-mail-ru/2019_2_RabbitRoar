import NavbarE from '../element/navbarE.js'
import RegistrationE from '../element/registrationE.js'

class RegistrationV {
    constructor(root = document.getElementById('application')) {
        if (!!RegistrationV.instance) {
            this.root = root;
            return RegistrationV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement('div');
        this.navbarDiv.id = 'navbar_container';

        this.RegistrationDiv = document.createElement('div');
        this.RegistrationDiv.id = 'registration_container';

        RegistrationV.instance = this;
        return this;
    }


    create(data = '') {
        console.log("registration view create");
        this.root.append(this.navbarDiv);
        this.root.append(this.RegistrationDiv);

        NavbarE.create(this.navbarDiv);
        RegistrationE.create(this.RegistrationDiv);
    }

    destroy() {
        console.log("registration view destroy");
        NavbarE.destroy();
        RegistrationE.destroy();
    }
}
export default new RegistrationV();