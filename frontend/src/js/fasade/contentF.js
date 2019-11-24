import Bus from "../event_bus.js";
import ContentM from "../model/contentM.js";
import PackM from "../model/packM";
import UserM from "../model/userM";


import { CHANGE_TAB } from "../modules/events.js";
import MainMenuM from "../model/mainMenuM.js";
import { PACK_WORKER_COMMAND } from "../modules/events.js";

import UserValidatorF from "./userValidatorF";


class ContentF {
    constructor() {
    }



    setPaginator(changes) {
        const _setPageNum = (paginator_counter, type, page_num) => {
            const lastPage = MainMenuM[paginator_counter];
            switch (type) {
                case "prev":
                    MainMenuM[paginator_counter]--;
                    break;
                case "next":
                    MainMenuM[paginator_counter]++;
                    break;
                case "page":
                    MainMenuM[paginator_counter] = page_num;
                    break;
                default:
                    break;
            }
            if (lastPage !== MainMenuM[paginator_counter]) {
                Bus.emit(CHANGE_TAB);
            }
        }

        switch (changes.paginator) {
            case "room-paginator":
                _setPageNum("roomPage", changes.type, changes.id);
                break;
            case "top-paginator":
                _setPageNum("topPage", changes.type, changes.id);
                break;
            case "pack-paginator":
                _setPageNum("packPage", changes.type, changes.id);
                break;
            default:
                break;
        }
    }

    getCurrentPackIDForEditing() {
        return PackM.packIdForEditing;
        //return PackM.getCurrentPackForEditing();
    }

    getCurrentPackForEditing() {
        //return PackM.getCurrentPackForEditing();
        return PackM.packForEditing;
    }

    async getPackById(id) {
        const packObj = await PackM.getPackById(id);
        return packObj;
    }

    async setInfoForPackEditing(packId) {
        await PackM.setInfoForPackEditing(packId);
    }

    async updatePack(packObj, packId) {
        this.packObj, this.packId
        const csrfJson = await UserValidatorF.getCSRF();
        const csrf = csrfJson.CSRF;

        PackM.updatePack(packObj, packId, csrf).catch(
            (error) => console.log(`ERROR at: contentF.updatePack - ${error}`));
    }

    async savePack(packObj) {
        const csrfJson = await UserValidatorF.getCSRF();
        const csrf = csrfJson.CSRF;

        PackM.savePack(packObj, csrf).catch(
            (error) => console.log(`ERROR at: contentF.savePack - ${error}`));
    }

    async updateLocalPacks() {
        await PackM.updatePackList();
        PackM.doPackValidation();

        const packList = PackM.getDownloadList();

        Bus.emit(PACK_WORKER_COMMAND, {
            command: "update",
            packList: packList
        });
    }

    async getPacksForOnline() {
        const packs = await ContentM.getPacksForOnline();
        return packs;
    }

    async getTabContent() {
        const currentId = MainMenuM.currentTab;

        let currentPage = MainMenuM.currentTabPage;
        let content;

        try {
            content = await ContentM.getTabContent(currentId, currentPage);
        } catch(err) {
            console.log(err);
            throw(err);
        }

        return content;
    }

    findChosen(tabs) {
        for (const tab of tabs) {
            if (tab.id === MainMenuM.currentTab) {
                return tab;
            }
        }
    }

    dropeTabs() {
        MainMenuM.currentTab = window.id.tabRoom;
    }

    setCurrentTab(newValue) {
        MainMenuM.currentTab = newValue;
        Bus.emit(CHANGE_TAB);
    }

    async deletePackById(packForDelete) {
        const csrf = await UserM.getCSRF();
        const response = await PackM.deletePackById(csrf.CSRF, packForDelete);
    }
}

export default new ContentF();