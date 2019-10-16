import NavbarE from '../element/navbarE.js'

class MainMenuV {
    constructor(root = document.getElementById('application')) {
        if (!!MainMenuV.instance) {
            this.root = root;
            return MainMenuV.instance;
        }
        this.root = root;

        this.navbarDiv = document.createElement('div');
        this.navbarDiv.id = 'navbar_container';

        MainMenuV.instance = this;
        return this;
    }


    create(data = '') {
        console.log("Main view create");
        this.root.append(this.navbarDiv);

        NavbarE.create(this.navbarDiv);
    }

    destroy() {
        console.log("Main view destroy");
        NavbarE.destroy();
    }
}
export default new MainMenuV();