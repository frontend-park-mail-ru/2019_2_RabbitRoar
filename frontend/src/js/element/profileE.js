import Template from './profileT.pug'
import Bus from '../event_bus.js'
import ValidatorF from '../fasade/userValidatorF.js'
import ProfileC from '../controller/profileC.js'
import { PROFILE_UPDATE } from '../modules/events.js'


class ProfileE {
    constructor() {
        if (!!ProfileE.instance) {
            return ProfileE.instance;
        }
        ProfileE.instance = this;
        this.controller = ProfileC;

        Bus.on(PROFILE_UPDATE, this.restartListener.bind(this));

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        const userData = ValidatorF.getUserData();
        
        this.root.insertAdjacentHTML('beforeend', Template({userData}));
        this.controller.start();
    }

    restartListener() {
        console.log('restart');
        this.destroy();
        this.create(this.root);
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = '';
    }
}

export default new ProfileE();