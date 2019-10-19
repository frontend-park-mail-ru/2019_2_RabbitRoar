import { queryTabContent } from '../modules/requests.js'
import { id } from '../modules/id.js'


class MainMenuM {
    constructor() {
        this.currentTab = id.tabRoom;
    }


    
    get currentTab() {
        return this.currentTab_;
    }

    set currentTab(val) {
        if ((val === id.tabRoom) || (val === id.tabTop) || (val === id.tabPack)) {
            this.currentTab_ = val;
        }
    }
    
    
}
export default new MainMenuM();