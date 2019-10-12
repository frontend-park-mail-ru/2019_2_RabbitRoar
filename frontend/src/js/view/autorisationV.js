import NavbarE from '../element/navbarE.js'
import AutorisationE from '../element/autorisationE.js'

class AutorisationV {
    constructor(root = document.getElementById('application')) {
        if (!!AutorisationV.instance) {
            this.root = root;
            return AutorisationV.instance;
        }
        this.root = root;
        AutorisationV.instance = this;
        return this;
    }


    create(data = '') {
        console.log("autorisation view create");
        this.root.innerHTML = '';
        NavbarE.create(this.root);
        AutorisationE.create(this.root);
    }

    destroy() {
        console.log("view destroy");
        NavbarE.destroy();
        AutorisationE.destroy();
    }
}
export default new AutorisationV();