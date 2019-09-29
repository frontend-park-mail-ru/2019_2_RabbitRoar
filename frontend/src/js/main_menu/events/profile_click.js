export function setProfileListeners() {
    document.getElementById('save-button').addEventListener('click', function (event) {
        for (let valId of changedForms.keys()) {
            alert(valId, changedForms.get(valId));
            alert(changedForms.get(valId));
        }
        // формируем json с измененными данными и отправлем его на сервер
        changedForms.clear()
        alert("Сохранение");
    });
    document.getElementById('cancel-button').addEventListener('click', function (event) {
        changedForms.clear()
        alert("Сброс");
    });

    let formFields = document.querySelectorAll('.input-valid');
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