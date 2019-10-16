import UserValidatorF from '../fasade/userValidatorF.js'
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'
import Bus from '../event_bus.js'
import { PROFILE_UPDATE } from '../modules/events.js'


class ProfileC {
    constructor(){
        if (!!ProfileC.instance) {
            return ProfileC.instance;
        }

        ProfileC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.changedForms = new Map();

        this.registerHandler('save_button', 'click', this._save.bind(this));
        this.registerHandler('cancel_button', 'click', this._cansel.bind(this));
        this.registerClassHandler('.input-valid', 'change', this._changeValue.bind(this));

    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _save() {
        const changes = {};

        this.changedForms.forEach(function(value, key){
            changes[key] = value;
        });

        UserValidatorF.doChangeUser(changes);
    }

    _cansel() {
        this.changedForms.clear()
        Bus.emit(PROFILE_UPDATE);
    }

    _changeValue(event) {
        this.changedForms.set(event.target.id, event.target.value);
    }

}

export default new ProfileC();