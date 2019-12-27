import Bus from "../event_bus.js";
import ContentM from "../model/contentM.js";
import PackM from "../model/packM";
import UserM from "../model/userM";
import { getCSRF, deleteLeaveRoom } from "../modules/requests.js"

import { CHANGE_TAB } from "../modules/events.js";
import MainMenuM from "../model/mainMenuM.js";
import { PACK_WORKER_COMMAND } from "../modules/events.js";

import { ROUTER_EVENT } from "../modules/events.js";

import UserValidatorF from "./userValidatorF";


class ContentF {
    constructor() {
    }

    getUserPacks = async () => {
        const packs = await ContentM.getUserPacks();
        return packs;
    }

    setPaginator = (changes) => {
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

    getCurrentPackIDForEditing = () => {
        return PackM.packIdForEditing;
    }

    getCurrentPackForEditing = () => {
        return PackM.packForEditing;
    }

    getPackById = async (id) => {
        const packObj = await PackM.getPackById(id);
        return packObj;
    }

    setInfoForPackEditing = async (packId) => {
        await PackM.setInfoForPackEditing(packId);
    }

    updatePack = async (packObj, packId) => {
        this.packObj, this.packId
        const csrfJson = await UserValidatorF.getCSRF();
        const csrf = csrfJson.CSRF;

        PackM.updatePack(packObj, packId, csrf).catch(
            // (error) => console.log(`ERROR at: contentF.updatePack - ${error}`)
        );
    }

    savePack = async (packObj) => {
        const csrfJson = await UserValidatorF.getCSRF();
        const csrf = csrfJson.CSRF;

        PackM.savePack(packObj, csrf).catch(
            // (error) => console.log(`ERROR at: contentF.savePack - ${error}`)
        );
    }

    updateLocalPacks = async () => {
        await PackM.updatePackList();
        PackM.doPackValidation();

        const packList = PackM.getDownloadList();

        Bus.emit(PACK_WORKER_COMMAND, {
            command: "update",
            packList: packList
        });
    }

    getAllPacksForOnline = async () => {
        const packs = await ContentM.getAllPacksForOnline();
        return packs;
    }

    getTabContent = async () => {
        const currentId = MainMenuM.currentTab;

        let currentPage = MainMenuM.currentTabPage;
        let content;

        try {
            content = await ContentM.getTabContent(currentId, currentPage);
        } catch (err) {
            throw (err);
        }

        content.resume = localStorage.getItem("last_game_UUID");
        content.lastState = localStorage.getItem("last_game_state");

        return content;
    }

    getCurrentTab = () => {
        return MainMenuM.currentTab;
    }

    findChosen = (tabs) => {
        for (const tab of tabs) {
            if (tab.id === MainMenuM.currentTab) {
                return tab;
            }
        }
    }

    dropeTabs = () => {
        MainMenuM.currentTab = window.id.tabRoom;
    }

    setCurrentTab = (newValue, reload = true) => {
        MainMenuM.currentTab = newValue;
        if (reload) {
            Bus.emit(ROUTER_EVENT.FAKE_ROUTE, MainMenuM.currentTab);
            Bus.emit(CHANGE_TAB);
        }
    }

    deletePackById = async (packForDelete) => {
        const csrf = await UserM.getCSRF();
        const response = await PackM.deletePackById(csrf.CSRF, packForDelete);
    }
}

export default new ContentF();