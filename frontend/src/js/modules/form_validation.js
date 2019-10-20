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
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,12}$/;
    return re.test(String(password));
};

const _deleteCssClassesErrorField = (elem) => {
    if (elem.classList.contains("error-annotation")) {
        elem.classList.remove("error-annotation");
    }
    if (elem.classList.contains("error-visible")) {
        elem.classList.remove("error-visible");
    }
    // the class using in profile editing
    if (elem.classList.contains("file-downloaded")) {
        elem.classList.remove("file-downloaded");
    }

};

// delete classOne, add classTwo
const _replaceTwoCssClasses = (elem, classOne, classTwo) => {
    if (elem.classList.contains(classOne)) {
        elem.classList.remove(classOne);
    }
    if (!elem.classList.contains(classTwo)) {
        elem.classList.add(classTwo);
    }
};

const _fieldValidation = (value, valueInputElement, errorElement, validFunction, emptyFieldError, unvalidValueError) => {
    let fieldIsOk = false;
    if (!value) {
        _replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        _replaceTwoCssClasses(valueInputElement, "input-valid", "input-error");
        errorElement.innerHTML = emptyFieldError;
        fieldIsOk = true;
    } else {
        if (!validFunction(value)) {
            _replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
            _replaceTwoCssClasses(valueInputElement, "input-valid", "input-error");
            errorElement.innerHTML = unvalidValueError;
            fieldIsOk = true;
        } else {
            _replaceTwoCssClasses(errorElement, "error-visible", "error-annotation");
            _replaceTwoCssClasses(valueInputElement, "input-error", "input-valid");
        }
    }
    return fieldIsOk;
};

export function registrationValidation(errorPasswordElement, errorUsernameElement, errorEmailElement) {
    let registrationError = _fieldValidation(document.getElementById("username").value, document.getElementById("username"),
        errorUsernameElement, _usernameIsValid, "Введите логин.", "Логин должен содержать минимум 3 символа.");

    registrationError = _fieldValidation(document.getElementById("password").value, document.getElementById("password"),
        errorPasswordElement, _passwordIsValid, "Введите пароль.", "Пароль должен содержать от 5 до 12 символов, одну цифру и одну букву.");

    registrationError = _fieldValidation(document.getElementById("email").value, document.getElementById("email"),
        errorEmailElement, _emailIsValid, "Введите email.", "Недопустимый email.");

    if (registrationError) {
        return false;
    }
    return true;
}