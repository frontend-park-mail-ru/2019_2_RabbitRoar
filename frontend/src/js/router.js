import Bus from "./event_bus.js";
import { ROUTER_EVENT } from "./modules/events.js";
import { ROOT } from "./paths";
import ValidatorF from "./fasade/userValidatorF";

export class Router {
    constructor(root = document.getElementById("application")) {
        this.routes = new Map();
        this.root = root;
        Bus.on(ROUTER_EVENT.ROUTE_TO, this.routeTo.bind(this));

        window.addEventListener("popstate", (event) => {
            event.preventDefault();
            this.routeTo(location.pathname);    //  location == url новой страницы
        });
    }

    register(path = "/", view) {
        if (this.routes.get(path) == undefined) {
            this.routes.set(path, view);
        } else {
            console.log(`Router: path ${path} already exist`);
        }
    }


    routeTo(path = "/", firtsTime = false) {
        const parseUrl = new URL("https://localhost:8080" + path);
        path = parseUrl.pathname;
        let newView;
        const authorized = ValidatorF.checkLocalstorageAutorization();
        if (!authorized) {
            // ValidatorF.unAutorise();
        }
        if ((newView = this.routes.get(path)) != undefined) {
            if (!firtsTime) {
                this.currentView.destroy();
            }
            if (window.location.pathname !== path) {
                history.pushState(null, null, path);
            }
            if (!newView.create()) {
                this.currentView = newView;
                Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
                return;
            }
            this.currentView = newView;
        }
    }

    _exit(data = {}) {
        this.routeTo(ROOT);
    }


    start() {
        this.currentView = this.routes.get("/");
        this.routeTo(location.pathname, true);
    }
}