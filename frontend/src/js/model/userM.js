class User {
    constructor() {
        if (!!User.instance) {
            return User.instance;
        }
        User.instance = this;

        this.uuid = true;
        return this;
    }


    autorise() {
        this.uuid = true;
    }

    unAutorise() {
        this.uuid = false;
    }

    checkAutorise() {
        //goToBackend(this.uuid);
        return this.uuid;
    }


}
export default new User();