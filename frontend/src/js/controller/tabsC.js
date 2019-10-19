import ContentF from '../fasade/contentF.js'
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'
import { id } from '../modules/id.js' 

class TabsC {
    constructor(){
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler(id.tabRoom, 'click', this._tabClick);
        this.registerHandler(id.tabTop, 'click', this._tabClick);
        this.registerHandler(id.tabPack, 'click', this._tabClick);
        this.registerClassHandler('.tab', 'mouseover', this._lightTab.bind(this));
        this.registerClassHandler('.tab', 'mouseout', this._unLightTab.bind(this));
        this.registerClassHandler('.tab-click', 'mouseover', this._lightTab.bind(this));
        this.registerClassHandler('.tab-click', 'mouseout', this._unLightTab.bind(this));

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
}

export default new TabsC();