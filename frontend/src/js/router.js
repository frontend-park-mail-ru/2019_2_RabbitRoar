export class Router {
    constructor(root = document.getElementById('application')) {
        this.routes = new Map();
        this.root = root;

        window.addEventListener('popstate',  () => {
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
            this.currentView.destroy();
            if (window.location.pathname !== path) {
                history.pushState(null, null, path);
            }
            newView.create();
            this.currentView = newView;
        }
    }


	start() {
        console.log(`location: ${location.pathname}`);
        this.currentView = this.routes.get('/');
		this.routeTo('/');
	}
}