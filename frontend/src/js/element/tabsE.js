import Template from './tabsT.pug'
import Bus from '../event_bus.js'
import ContentF from '../fasade/contentF.js'
import TabsC from '../controller/profileC.js'


class TabsE {
    constructor() {
        if (!!TabsE.instance) {
            return TabsE.instance;
        }
        TabsE.instance = this;
        this.controller = TabsC;

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        
        this.root.insertAdjacentHTML('beforeend', Template({userData}));
        this.controller.start();
    }


    destroy() {
        this.controller.drop();
        this.root.innerHTML = '';
    }
}

export default new TabsE();