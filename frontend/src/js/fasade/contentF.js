import Bus from "../event_bus.js";
import ContentM from "../model/contentM.js";
import { CHANGE_TAB } from "../modules/events.js";
import MainMenuM from "../model/mainMenuM.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "../modules/events.js";


class ContentF {
    constructor() {

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


    async getTabContent(id = MainMenuM.currentTab) {
        const content = await ContentM.getTabContent(id);
        return content;
    }


    setCurrentTab(newValue) {
        MainMenuM.currentTab = newValue;
        Bus.emit(CHANGE_TAB);
    }

    async getPackTabContent(id) {
        const content = await ContentM.getPackTabContent(id);
        return content;
    }

}

export default new ContentF();