import UserValidatorF from '../fasade/userValidatorF.js'
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'
import Bus from '../event_bus.js'
import { PROFILE_UPDATE } from '../modules/events.js'

class ProfileC {
    constructor() {
        if (!!ProfileC.instance) {
            return ProfileC.instance;
        }

        ProfileC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.changedForms = new Map();

        this.registerHandler('save_button', 'click', this._saveTextFields.bind(this));
        this.registerHandler('cancel_button', 'click', this._cansel.bind(this));
        this.registerClassHandler('.input-valid', 'change', this._changeTextValue.bind(this));
        this.registerClassHandler('.profile__download-img', 'change', this._saveImage.bind(this));
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
            alert("Нет изменений для сохранения");
            return;
        }
        const changes = {};
        this.changedForms.forEach(function (value, key) {
            changes[key] = value;
        });
        UserValidatorF.changeTextFields(changes);
        this.changedForms.clear();
        Bus.emit(PROFILE_UPDATE);
    }

    _cansel() {
        this.changedForms.clear()
        Bus.emit(PROFILE_UPDATE);
    }

    _changeTextValue(event) {
        this.changedForms.set(event.target.id, event.target.value);
    }

    _deleteErrorCssClasses(elem) {
        if (elem.classList.contains('error-annotation')) {
            elem.classList.remove('error-annotation');
        }

        if (elem.classList.contains('error-visible')) {
            elem.classList.remove('error-visible');
        }

        if (elem.classList.contains('file-downloaded')) {
            elem.classList.remove('file-downloaded');
        }
    }

    _saveImage() {
        let formData = new FormData();
        const input = document.querySelector('.profile__download-img');
        if (this._checkFileSize(input.files[0]) === false) {
            return;
        }
        if (this._checkFileType(input.files[0]) === false) {
            this._deleteErrorCssClasses(document.getElementById("error_file"));
            document.getElementById("error_file").classList.add('error-visible');
            document.getElementById("error_file").innerHTML = "Файл недопустимого расширения и загружен не будет.";
        } else {
            this._deleteErrorCssClasses(document.getElementById("error_file"));
            document.getElementById("error_file").classList.add('file-downloaded');
            document.getElementById("error_file").innerHTML = "Файл загружен";
            formData.append("userfile", input.files[0]);
            UserValidatorF.changeUserAvatar(formData);
        }
    }

    _checkFileSize(file) {
        if (file.size > 2000000) {
            this._deleteErrorCssClasses(document.getElementById("error_file"));
            document.getElementById("error_file").classList.add('error-visible');
            document.getElementById("error_file").innerHTML = "Размер файла не должен привышать 2МБ";
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