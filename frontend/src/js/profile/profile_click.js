export function setProfileListeners() {
    document.getElementById('save-button').addEventListener('click', function (event) {
        for (let valId of changedForms.keys()) {
            console.log(valId, changedForms.get(valId));
            console.log(changedForms.get(valId));
        }
        // формируем json с измененными данными и отправлем его на сервер
        changedForms.clear()
        console.log("Сохранение");
    });
    const element = document.getElementById('cancel-button').addEventListener('click', function (event) {
        changedForms.clear()
        console.log("Сброс");
    });// Может вернуть null, тогда гг

    let formFields = document.querySelectorAll('.input-valid');
    formFields.forEach(function (form) {
        form.addEventListener("change", function () {
            changedValue(this.value, this.id);
        });
    });
    let tabs = document.querySelectorAll('div.tab')
}

let changedForms = new Map();

const changedValue = (changedVal, valId) => {
    changedForms.set(valId, changedVal);
}