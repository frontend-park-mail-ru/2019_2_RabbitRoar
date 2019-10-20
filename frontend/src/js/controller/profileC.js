import UserValidatorF from "../fasade/userValidatorF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { PROFILE_UPDATE } from "../modules/events.js";
import { emailIsValid, usernameIsValid, passwordsAreEqual, passwordIsValid } from "../modules/form_validation.js";

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
        if (this.changedForms.size == 0) {
            const errorMain = document.getElementById("error_main");
            this._deleteErrorCssClasses(errorMain);
            errorMain.classList.add("error-visible");
            errorMain.innerHTML = "Нет изменений для сохранения.";
            return;
        }
        const changes = {};

        const passwordWasEntered = this.changedForms.has("password");
        const passwordConfirmationWasEntered = this.changedForms.has("password-confirmation");

        if (passwordWasEntered && passwordConfirmationWasEntered) {
            const errorPasswordElement = document.getElementById("error_password");
            if (passwordsAreEqual(this.changedForms.get("password"), this.changedForms.get("password-confirmation"))) {
                if (passwordIsValid(password)) {
                    changes["password"] = this.changedForms.get("password");
                } else {
                    this._deleteErrorCssClasses(errorPasswordElement);
                    errorPasswordElement.classList.add("error-visible");
                    errorPasswordElement.innerHTML = "Недопустимый пароль. Введите минимум 5 символов.";
                    return;
                }
            } else {
                this._deleteErrorCssClasses(errorPasswordElement);
                errorPasswordElement.classList.add("error-visible");
                errorPasswordElement.innerHTML = "Пароли не совпадают.";
                return;
            }
        } else if (passwordWasEntered || passwordConfirmationWasEntered) {
            this._deleteErrorCssClasses(errorPasswordElement);
            errorPasswordElement.classList.add("error-visible");
            errorPasswordElement.innerHTML = "Для смены пароля заполните два поля.";
            return;
        }
        this.changedForms.delete("password");
        this.changedForms.delete("password-confirmation");


        if (this.changedForms.has("username")) {
            const username = this.changedForms.get("username");
            if (!usernameIsValid(username)) {
                alert("ne verniy username");

                const errorUsernameElement = document.getElementById("error_username");
                this._deleteErrorCssClasses(errorUsernameElement);
                errorUsernameElement.classList.add("error-visible");
                errorUsernameElement.innerHTML = "Недопустимый username.";
                document.getElementById("username").classList.add("input-error");
                return;
            }
        }

        if (this.changedForms.has("email")) {
            const email = this.changedForms.get("email");
            if (!emailIsValid(email)) {
                const errorEmailElement = document.getElementById("error_email");
                this._deleteErrorCssClasses(errorEmailElement);
                errorEmailElement.classList.add("error-visible");
                errorEmailElement.innerHTML = "Недопустимый email.";
                return;
            }
        }

        UserValidatorF.changeTextFields(changes);
        this.changedForms.clear();
        Bus.emit(PROFILE_UPDATE);
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
        let formData = new FormData();
        const input = document.querySelector(".profile__download-img");
        if (this._checkFileSize(input.files[0]) === false) {
            return;
        }
        const errorFileElement = document.getElementById("error_top");
        if (this._checkFileType(input.files[0]) === false) {
            this._deleteErrorCssClasses(errorFileElement);
            errorFileElement.classList.add("error-visible");
            errorFileElement.innerHTML = "Файл недопустимого расширения и загружен не будет.";
        } else {
            this._deleteErrorCssClasses(errorFileElement);
            errorFileElement.classList.add("file-downloaded");
            errorFileElement.innerHTML = "Файл загружен";
            formData.append("userfile", input.files[0]);
            UserValidatorF.changeUserAvatar(formData);
        }
    }

    _checkFileSize(file) {
        if (file.size > 2000000) {
            const errorFileElement = document.getElementById("error_top");
            this._deleteErrorCssClasses(errorFileElement);
            errorFileElement.classList.add("error-visible");
            errorFileElement.innerHTML = "Размер файла не должен привышать 2МБ";
            return false;
        }
        return true;
    }

    _checkFileType(blob) {
        const fileReader = new FileReader();
        let type;
        fileReader.onloadend = (e) => {
            const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                // png
                case "89504e47":
                    type = "png";
                    break;

                // jpeg
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    type = "jpeg";
                    break;
                default:
                    type = "wrong_type";
                    break;
            }
        };
        fileReader.readAsArrayBuffer(blob);
        if (type == "wrong_type") {
            return false;
        }
        return true;
    }
}

export default new ProfileC();