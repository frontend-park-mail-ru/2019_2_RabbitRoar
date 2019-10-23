import ContentF from "../fasade/contentF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { id } from "../modules/id.js"; 
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { SINGLE_GAME } from "../paths";

class TabsC {
    constructor(){
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler(id.tabRoom, "click", this._tabClick);
        this.registerHandler(id.tabTop, "click", this._tabClick);
        this.registerHandler(id.tabPack, "click", this._tabClick);
        this.registerClassHandler(".tab", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab", "mouseout", this._unLightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseover", this._lightTab.bind(this));
        this.registerClassHandler(".tab-click", "mouseout", this._unLightTab.bind(this));

        this.registerClassHandler(".join-button", "click", this._startGame.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }


    _lightTab(event) {
        event.target.classList.add("tab-hover");
    }

    _unLightTab(event) {
        event.target.classList.remove("tab-hover");
    }


    _tabClick(event){
        ContentF.setCurrentTab(event.target.id);
    }

    _startGame(){
        Bus.emit(ROUTER_EVENT.ROUTE_TO, SINGLE_GAME);
    }
}

export default new TabsC();