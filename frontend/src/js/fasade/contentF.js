import Bus from "../event_bus.js";
import ContentM from "../model/contentM.js";
import UserM from "../model/userM";

import { CHANGE_TAB } from "../modules/events.js";
import MainMenuM from "../model/mainMenuM.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "../modules/events.js";
import { id } from "../modules/id.js";


class ContentF {
    constructor() {

    }

    async savePack(packObj, csrf) {
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


    getCurrentTab() {
        return MainMenuM.currentTab;
    }

    async getTabContent(currentId = MainMenuM.currentTab) {
        const content = await ContentM.getTabContent(currentId);
        return content;
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