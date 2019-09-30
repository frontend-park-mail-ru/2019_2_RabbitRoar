export function setProfileListeners() {
    document.getElementById('save-button').addEventListener('click', function (event) {
        // for (let valId of changedForms.keys()) {
        //     alert(valId, changedForms.get(valId));
        //     alert(changedForms.get(valId));
        // }
        ajax(
            'PUT',
            'http://localhost:3000/user',
            JSON.stringify(mapToObj(changedForms)),
            function (status, response) {
                if (status === 200) {
                    createMainMenu();
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            }
        );
        // формируем json с измененными данными и отправлем его на сервер
        changedForms.clear()
        alert("Сохранение");
    });
    const element = document.getElementById('cancel-button').addEventListener('click', function (event) {
        changedForms.clear()
        alert("Сброс");
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

function mapToObj(inputMap) {
    let obj = {};

    inputMap.forEach(function(value, key){
        obj[key] = value
    });

    return obj;
}