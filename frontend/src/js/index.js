import {Router} from './router.js';


class testView {
    constructor(text) {
        this.text = text;
    }

    create() {
        console.log(`create ${this.text}`);
    }

    destroy() {
        console.log(`destroy ${this.text}`);
    }
}


const router = new Router;

router.register('/', new testView("root View"));
router.register('/lol', new testView("lol View"));
router.register('/kek', new testView("kek View"));

router.start();

router.routeTo('/kek');
router.routeTo('/lol');
router.routeTo('/kek');
