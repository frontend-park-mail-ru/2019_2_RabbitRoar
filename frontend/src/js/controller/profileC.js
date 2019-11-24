import UserValidatorF from "../fasade/userValidatorF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { PROFILE_UPDATE } from "../modules/events.js";
import { fileVaildation, textFieldsVaildationProfile } from "../modules/form_validation.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";



class ProfileC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.changedForms = new Map();

        this.registerHandler("save_button", "click", this._saveTextFields);
        this.registerHandler("cancel_button", "click", this._cansel);
        this.registerClassHandler(".input-valid", "change", this._changeTextValue);
        this.registerClassHandler(".profile__download-img", "change", this._saveImage);
    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
        this.changedForms.clear();
    }

    _saveTextFields = async () => {
        const result = textFieldsVaildationProfile(this.changedForms);
        if (result.fieldsAreValid) {
            const csrfJson = await UserValidatorF.getCSRF();
            const csrf = csrfJson.CSRF;
            UserValidatorF.changeTextFields(result.changes, csrf);
            this.changedForms.clear();
        }
    }

    _cansel = () => {
        this.changedForms.clear();
        Bus.emit(PROFILE_UPDATE);
    }

    _changeTextValue = (event) => {
        this.changedForms.set(event.target.id, event.target.value);
    }

    _deleteErrorCssClasses = (elem) => {
        if (elem.classList.contains("error-annotation")) {
            elem.classList.remove("error-annotation");
        }

        if (elem.classList.contains("error-visible")) {
            elem.classList.remove("error-visible");
        }

        if (elem.classList.contains("info-message")) {
            elem.classList.remove("info-message");
        }
        if (elem.classList.contains("input-error")) {
            elem.classList.remove("input-error");
        }
    }

    _saveImage = () => {
        fileVaildation().then(async function (file) {
            document.getElementById("profile__user-img").src = window.URL.createObjectURL(file)
            let formData = new FormData();
            formData.append("avatar", file);

            const csrfJson = await UserValidatorF.getCSRF();
            const csrf = csrfJson.CSRF;

            UserValidatorF.changeUserAvatar(formData, csrf);
        },
            function (err) {
            });
    }
}

export default new ProfileC();