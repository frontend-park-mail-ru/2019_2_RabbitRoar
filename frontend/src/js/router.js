import Bus from './event_bus.js'
import {ROUTER_EVENT} from './modules/events.js'
import {ROOT} from './paths';

export class Router {
    constructor(root = document.getElementById('application')) {
        this.routes = new Map();
        this.root = root;
        Bus.on(ROUTER_EVENT.SESSION_END, this._exit.bind(this));
        Bus.on(ROUTER_EVENT.ROUTE_TO, this.routeTo.bind(this));

        window.addEventListener('popstate',  (event) => {
            event.preventDefault();
            console.log('popstate occur:');
            console.log(event.state);
            this.routeTo(location.pathname);    //  location == url новой страницы
        });
    }

    register(path = '/', view) {
        if (this.routes.get(path) == undefined) {
            this.routes.set(path, view);
        } else {
            console.log(`Router: path ${path} already exist`);
        }
    }


    routeTo(path = '/') {
        let newView;
        if ((newView = this.routes.get(path)) != undefined) {
            console.log(newView);
            this.currentView.destroy();
            if (window.location.pathname !== path) {
                history.pushState(null, null, path);
            }
            newView.create();
            this.currentView = newView;
        }
    }

    _exit(data = {}) {
        this.routeTo(ROOT);
    }


	start() {
        console.log(`location: ${location.pathname}`);
        this.currentView = this.routes.get('/');
		this.routeTo('/');
	}
}