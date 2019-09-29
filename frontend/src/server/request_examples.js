// войти по логину
ajax(
    'POST',
    '/user/login',
    {username, password},
    function (status, response) {
        if (status === 200) {
            // СОЗДАЕМ ПРОФИЛЬ
        } else {
            const {error} = JSON.parse(response);
            alert(error);
        }
    }
)

// Выйти
ajax(
    'GET',
    '/user/logout',
    {username, password},
    function (status, response) {
        if (status === 200) {
            // СОЗДАЕМ ПРОФИЛЬ
        } else {
            const {error} = JSON.parse(response);
            alert(error);
        }
    }
)
// Регистрация
ajax(
    'POST',
    '/user/signup',
    {username, password, email},
    function (status, response) {
        if (status === 200) {
            // СОЗДАЕМ ПРОФИЛЬ
        } else {
            const {error} = JSON.parse(response);
            alert(error);
        }
    }
)


// обновить профиль
ajax(
    'POST',
    '/user',
    {username, password},
    function (status, response) {
        if (status === 200) {
            // СОЗДАЕМ ПРОФИЛЬ
        } else {
            const {error} = JSON.parse(response);
            alert(error);
        }
    }
)

AjaxModule.doPut({
    url: '/user',
    body: {username, password},
    callback(status, responseText) {
        if (status === 200) {
            // СОЗДАЕМ ПРОФИЛЬ
            return;
        }

        const {error} = JSON.parse(responseText);
        alert(error);
    }
});
