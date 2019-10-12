import NavbarE from '../element/navbarE.js'

class MainMenuV {
    constructor(root = document.getElementById('application')) {
        if (!!MainMenuV.instance) {
            this.root = root;
            return MainMenuV.instance;
        }
        this.root = root;
        MainMenuV.instance = this;
        return this;
    }


    create(data = '') {
        console.log("view create");
        this.root.innerHTML = '';
        NavbarE.create(this.root);
    }

    destroy() {
        console.log("view destroy");
        NavbarE.destroy();
    }
}
export default new MainMenuV();