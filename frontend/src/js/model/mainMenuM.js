import { id } from "../modules/id.js";


class MainMenuM {
    constructor() {
    }

    get currentTab() {
        if (this._currentTab) {
            return this._currentTab;
        }

        const currentTab = window.localStorage.getItem("currentTab");
        if (currentTab) {
            this.currentTab = currentTab;
        } else {
            this.currentTab = window.id.tabRoom;
        }

        return this._currentTab;
    }

    set currentTab(val) {
        window.localStorage.setItem("currentTab", val);
        this._currentTab = val;
    }


}
export default new MainMenuM();