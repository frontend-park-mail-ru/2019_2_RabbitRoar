import { id } from "../modules/id.js";


class MainMenuM {
    constructor() {
        this._roomPage = 0;
        this._topPage = 0;
        this._packPage = 0;
    }

    get currentTabPage() {
        if (this.currentTab === window.id.tabRoom) {
            return this.roomPage;
        }
        if (this.currentTab === window.id.tabTop) {
            return this.topPage;
        }
        if (this.currentTab === window.id.tabPack) {
            return this.packPage;
        }
    }


    set roomPage(page) {
        if (page >= 0) {
            this._roomPage = page;
        }
    }
    set topPage(page) {
        if (page >= 0) {
            this._topPage = page;
        }
    }
    set packPage(page) {
        if (page >= 0) {
            this._packPage = page;
        }
    }

    get roomPage() {
        return this._roomPage;
    }
    get topPage() {
        return this._topPage;
    }
    get packPage() {
        return this._packPage;
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