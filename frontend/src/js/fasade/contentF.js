import Bus from "../event_bus.js";
import ContentM from "../model/contentM.js";
import UserM from "../model/userM";

import { CHANGE_TAB } from "../modules/events.js";
import MainMenuM from "../model/mainMenuM.js";
import { PACK_WORKER_COMMAND } from "../modules/events.js";

import UserValidatorF from "./userValidatorF";


class ContentF {
    constructor() {
    }

    async savePack(packObj) {
        const csrfJson = await UserValidatorF.getCSRF();
        const csrf = csrfJson.CSRF;
        ContentM.savePack(packObj, csrf).catch(
            (error) => console.log(`ERROR at: contentF.savePack - ${error}`));
    }

    async updateLocalPacks() {
        await ContentM.updatePackList();
        ContentM.doPackValidation();

        const packList = ContentM.getDownloadList();

        Bus.emit(PACK_WORKER_COMMAND, {
            command: "update",
            packList: packList
        });
    }


    async getTabContent() {
        const currentId = MainMenuM.currentTab;
        const content = await ContentM.getTabContent(currentId);
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
        const response = await ContentM.deletePackById(csrf.CSRF, packForDelete);
    }
}

export default new ContentF();