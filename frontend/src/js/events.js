
const cssColors = {
    colorBgDark: "rgb(23, 21, 32)",
    colorBg: "rgba(36, 27, 47, 1)",
    colorBgLight: "rgba(38, 35, 53, 1)",
    colorBorderPrimary: "rgba(54, 249, 246, 1)",
    colorBorderPrimaryLow: "rgba(54, 249, 246, 0.7)",
    colorBorderAlter: "rgba(254, 222, 93, 1)",
    colorAlert: "rgba(211, 97, 53, 1)",
    colorDanger: "#920031",
    colorSuccess: "#72f1b8",
}


setTabListeners = () => {
    let tabs = document.querySelectorAll('div.tab')
    if (tabs == SyntaxError) {
        alert("No exist div.tab!")
        return
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            tab.className = 'tab-click';

            let noClickTab = document.querySelectorAll('div.tab , div.tab-click');
            noClickTab.forEach(function (noClick) {
                if (noClick != tab) {
                    noClick.className = "tab";
                }
            });
        });
    });
}

setNavbarListeners = () => {
    document.querySelector('.navbar__game-logo').addEventListener('click', function (event) {
        alert("Главная страница");
    });
    document.querySelector('.navbar__user-logo').addEventListener('click', function (event) {
        alert("Редактирование личного кабинета");
    });
    document.querySelector('.navbar__exit').addEventListener('click', function (event) {
        alert("Пользователь вышел");
    });
}

setProfileListeners = () => {
    document.querySelector('.profile__save-button').addEventListener('click', function (event) {
        for (let valId of changedForms.keys()) {
            alert(valId, changedForms.get(valId));
            alert(changedForms.get(valId));
        }
        // формируем json с измененными данными и отправлем его на сервер
        changedForms.clear()
        alert("Сохранение");
    });
    document.querySelector('.profile__cancel-button').addEventListener('click', function (event) {
        changedForms.clear()
        alert("Сброс");
    });

    let formFields = document.querySelectorAll('.profile__form-text');
    formFields.forEach(function (form) {
        form.addEventListener("change", function () {
            changedValue(this.value, this.id);
        });
    });
    let tabs = document.querySelectorAll('div.tab')
}

let changedForms = new Map();

changedValue = (changedVal, valId) => {
    changedForms.set(valId, changedVal);
}