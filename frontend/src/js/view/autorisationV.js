import NavbarE from '../element/navbarE.js'
import AutorisationE from '../element/autorisationE.js'

class AutorisationV {
    constructor(root = document.getElementById('application')) {
        if (!!AutorisationV.instance) {
            this.root = root;
            return AutorisationV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement('div');
        this.navbarDiv.id = 'navbar_container';

        this.AutorisationDiv = document.createElement('div');
        this.AutorisationDiv.id = 'autorisation_container';

        AutorisationV.instance = this;
        return this;
    }


    create(data = '') {
        console.log("autorisation view create");
        this.root.append(this.navbarDiv);
        this.root.append(this.AutorisationDiv);

        NavbarE.create(this.navbarDiv);
        AutorisationE.create(this.AutorisationDiv);
    }

    destroy() {
        console.log("autorisation view destroy");
        NavbarE.destroy();
        AutorisationE.destroy();
    }
}
export default new AutorisationV();