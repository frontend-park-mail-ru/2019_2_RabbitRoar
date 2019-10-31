import UserValidatorF from "../fasade/userValidatorF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { PROFILE_UPDATE } from "../modules/events.js";
import { fileVaildation, textFieldsVaildationProfile } from "../modules/form_validation.js";


class ProfileC {
    constructor() {
        if (!!ProfileC.instance) {
            return ProfileC.instance;
        }

        ProfileC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.changedForms = new Map();

        this.registerHandler("save_button", "click", this._saveTextFields.bind(this));
        this.registerHandler("cancel_button", "click", this._cansel.bind(this));
        this.registerClassHandler(".input-valid", "change", this._changeTextValue.bind(this));
        this.registerClassHandler(".profile__download-img", "change", this._saveImage.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
        this.changedForms.clear();
    }

    _saveTextFields() {
        const result = textFieldsVaildationProfile(this.changedForms);
        if (result.fieldsAreValid) {
            UserValidatorF.changeTextFields(result.changes);
            this.changedForms.clear();
            Bus.emit(PROFILE_UPDATE);
        }
    }

    _cansel() {
        this.changedForms.clear();
        Bus.emit(PROFILE_UPDATE);
    }

    _changeTextValue(event) {
        this.changedForms.set(event.target.id, event.target.value);
    }

    _deleteErrorCssClasses(elem) {
        if (elem.classList.contains("error-annotation")) {
            elem.classList.remove("error-annotation");
        }

        if (elem.classList.contains("error-visible")) {
            elem.classList.remove("error-visible");
        }

        if (elem.classList.contains("file-downloaded")) {
            elem.classList.remove("file-downloaded");
        }
        if (elem.classList.contains("input-error")) {
            elem.classList.remove("input-error");
        }
    }

    _saveImage() {
        fileVaildation().then(function (file) {
            document.getElementById("profile__user-img").src = window.URL.createObjectURL(file)
            let formData = new FormData();
            formData.append("userfile", file);
            UserValidatorF.changeUserAvatar(formData);
        },
            function (err) {
            });
    }
}

export default new ProfileC();