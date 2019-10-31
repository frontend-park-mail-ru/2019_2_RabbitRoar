import { replaceTwoCssClasses } from "./css_operations";

const _emailIsValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const _usernameIsValid = (username) => {
    const re = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;
    return re.test(String(username));
};

const _passwordsAreEqual = (password1, password2) => {
    return password1 === password2;
};

const _passwordIsValid = (password) => {
    // at least one letter and one number, 3 symbols minimum
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,24}$/;
    return re.test(String(password));
};

const _fieldValidation = (value, valueInputElement, errorElement, validFunction, emptyFieldError, unvalidValueError) => {
    let error = false;
    if (!value) {
        replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        replaceTwoCssClasses(valueInputElement, "input-valid", "input-error");
        errorElement.innerHTML = emptyFieldError;
        error = true;
    } else {
        if (!validFunction(value)) {
            replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
            replaceTwoCssClasses(valueInputElement, "input-valid", "input-error");
            errorElement.innerHTML = unvalidValueError;
            error = true;
        } else {
            replaceTwoCssClasses(errorElement, "error-visible", "error-annotation");
            replaceTwoCssClasses(valueInputElement, "input-error", "input-valid");
        }
    }
    return error;
};

export const registrationValidation = () => {
    const errorPasswordElement = document.getElementById("error_password");
    const errorUsernameElement = document.getElementById("error_username");
    const errorEmailElement = document.getElementById("error_email");

    let registrationError = _fieldValidation(document.getElementById("username").value, document.getElementById("username"),
        errorUsernameElement, _usernameIsValid, "Введите логин.", "Логин должен содержать минимум 3 символа.");
    //alert(registrationError);

    registrationError = _fieldValidation(document.getElementById("password").value, document.getElementById("password"),
        errorPasswordElement, _passwordIsValid, "Введите пароль.", "Пароль должен содержать от 5 до 24 символов, одну цифру и одну букву.");
    //alert(registrationError);

    registrationError = _fieldValidation(document.getElementById("email").value, document.getElementById("email"),
        errorEmailElement, _emailIsValid, "Введите email.", "Недопустимый email.");
    //alert(registrationError);

    if (registrationError) {
        return true;
    }
    return false;
};

const _drawFileError = (errorText) => {
    const errorFileElement = document.getElementById("error_top");
    _deleteCssClassesFileInput(errorFileElement);
    errorFileElement.classList.add("error-visible");
    errorFileElement.innerHTML = "Размер файла не должен привышать 2МБ";
}

export const fileVaildation = () => {
    return new Promise(function (resolve, reject) {
        const input = document.querySelector(".profile__download-img");
        const errorFileElement = document.getElementById("error_top");

        if (!_checkFileSize(input.files[0])) {
            _drawFileError("Размер файла не должен привышать 2МБ");
            reject(Error("Неверный размер"));
        } else {
            type().then(function (result) {
                _deleteCssClassesFileInput(errorFileElement);
                errorFileElement.classList.add("file-downloaded");
                errorFileElement.innerHTML = "Аватарка обновлена";
                resolve(input.files[0]);
            },
                function (err) {
                    _drawFileError("Файл недопустимого расширения и загружен не будет.");
                    reject(Error("Неверный тип"));
                });
        }
    });
};
export const type = () => {
    return new Promise(function (resolve, reject) {
        const input = document.querySelector(".profile__download-img");
        const blob = input.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            let type;
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
            if (type === "wrong_type") {
                reject("wrong type");
            } else {
                resolve("ok");
            }
        };
        fileReader.readAsArrayBuffer(blob);
    });
}

const _checkFileSize = (file) => {
    if (file.size > 2000000) {
        return false;
    }
    return true;
};

const _deleteCssClassesFileInput = (elem) => {
    if (elem.classList.contains("error-annotation")) {
        elem.classList.remove("error-annotation");
    }
    if (elem.classList.contains("error-visible")) {
        elem.classList.remove("error-visible");
    }
    if (elem.classList.contains("file-downloaded")) {
        elem.classList.remove("file-downloaded");
    }
};

const _drawPasswordError = (errorPasswordElement) => {
    replaceTwoCssClasses(errorPasswordElement, "error-annotation", "error-visible");
    replaceTwoCssClasses(document.getElementById("password"), "input-valid", "input-error");
    replaceTwoCssClasses(document.getElementById("password-confirmation"), "input-valid", "input-error");
};

export const textFieldsVaildationProfile = (changedForms) => {
    if (changedForms.size == 0) {
        const errorMain = document.getElementById("error_empty_fields");
        _deleteCssClassesFileInput(errorMain);
        errorMain.classList.add("error-visible");

        errorMain.innerHTML = "Нет изменений для сохранения.";
        return { fieldsAreValid: false, changes: {} };
    }

    const changes = {};
    const passwordWasEntered = changedForms.has("password");
    const passwordConfirmationWasEntered = changedForms.has("password-confirmation");
    let error = false;

    const errorPasswordElement = document.getElementById("error_password");
    if (passwordWasEntered && passwordConfirmationWasEntered) {
        if (_passwordsAreEqual(changedForms.get("password"), changedForms.get("password-confirmation"))) {
            if (_passwordIsValid(changedForms.get("password"))) {
                changes["password"] = changedForms.get("password");
                replaceTwoCssClasses(errorPasswordElement, "error-visible", "error-annotation");
                replaceTwoCssClasses(document.getElementById("password"), "input-error", "input-valid");
                replaceTwoCssClasses(document.getElementById("password-confirmation"), "input-error", "input-valid");
            } else {
                _drawPasswordError(errorPasswordElement);
                errorPasswordElement.innerHTML = "Пароль должен содержать от 5 до 12 символов, одну цифру и одну букву.";
                error = true;
            }
        } else {
            _drawPasswordError(errorPasswordElement);
            errorPasswordElement.innerHTML = "Пароли не совпадают.";
            error = true;
        }
    } else if (passwordWasEntered || passwordConfirmationWasEntered) {
        _drawPasswordError(errorPasswordElement);
        errorPasswordElement.innerHTML = "Для смены пароля заполните два поля.";
        error = true;
    }

    const errorUsernameElement = document.getElementById("error_username");
    if (changedForms.has("username")) {
        const username = changedForms.get("username");
        if (!_usernameIsValid(username)) {
            replaceTwoCssClasses(errorUsernameElement, "error-annotation", "error-visible");
            replaceTwoCssClasses(document.getElementById("username"), "input-valid", "input-error");
            errorUsernameElement.innerHTML = "Логин должен содержать минимум 3 символа.";
            error = true;
        } else {
            changes["username"] = changedForms.get("username");
            replaceTwoCssClasses(errorUsernameElement, "error-visible", "error-annotation");
            replaceTwoCssClasses(document.getElementById("username"), "input-error", "input-valid");
        }
    }

    const errorEmailElement = document.getElementById("error_email");
    if (changedForms.has("email")) {
        const email = changedForms.get("email");
        if (!_emailIsValid(email)) {
            replaceTwoCssClasses(errorEmailElement, "error-annotation", "error-visible");
            replaceTwoCssClasses(document.getElementById("email"), "input-valid", "input-error");
            errorEmailElement.innerHTML = "Недопустимый email.";
            error = true;
        } else {
            changes["email"] = changedForms.get("email");
            replaceTwoCssClasses(errorEmailElement, "error-visible", "error-annotation");
            replaceTwoCssClasses(document.getElementById("email"), "input-error", "input-valid");
        }
    }

    if (error) {
        return { fieldsAreValid: false, changes: {} };
    }
    return { fieldsAreValid: true, changes: changes };
};

export const autorizationVaildation = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const errorPasswordElement = document.getElementById("error_password");
    const errorUsernameElement = document.getElementById("error_username");

    let error = false;

    if (!username) {
        replaceTwoCssClasses(errorUsernameElement, "error-annotation", "error-visible");
        replaceTwoCssClasses(document.getElementById("username"), "input-valid", "input-error");
        errorUsernameElement.innerHTML = "Введите логин.";
        error = true;
    } else {
        replaceTwoCssClasses(errorUsernameElement, "error-visible", "error-annotation");
        replaceTwoCssClasses(document.getElementById("username"), "input-error", "input-valid");
    }

    if (!password) {
        replaceTwoCssClasses(errorPasswordElement, "error-annotation", "error-visible");
        replaceTwoCssClasses(document.getElementById("password"), "input-valid", "input-error");
        errorPasswordElement.innerHTML = "Введите пароль.";
        error = true;
    } else {
        replaceTwoCssClasses(errorPasswordElement, "error-visible", "error-annotation");
        replaceTwoCssClasses(document.getElementById("password"), "input-error", "input-valid");
    }
    return error;
};