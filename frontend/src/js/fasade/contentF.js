import Bus from "../event_bus.js";
import ContentM from "../model/contentM.js";
import { CHANGE_TAB } from "../modules/events.js";
import MainMenuM from "../model/mainMenuM.js";


class ContentF {
    constructor() {
        
    }

    getCurrentTab() {
        return MainMenuM.currentTab;
    }


    async getTabContent(id = MainMenuM.currentTab) {
        if ((id === window.id.tabRoom) || (id === window.id.tabTop) || (id === window.id.tabPack)) {
            const content = await ContentM.getTabContent(id);

            return content;
        }
    }


    setCurrentTab(newValue) {
        MainMenuM.currentTab = newValue;
        Bus.emit(CHANGE_TAB);
    }

    
}

export default new ContentF();