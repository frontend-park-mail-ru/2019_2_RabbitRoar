// войти по логину
AjaxModule.doPost({
    url: '/user/login',
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

// выйти
AjaxModule.doGet({
    url: '/user/logout',
    body: {username, password},
    callback(status, responseText) {
        if (status === 200) {
            // МЫ ВЫШЛИ
            // Создаем страницу для выхода
            return;
        }

        const {error} = JSON.parse(responseText);
        alert(error);
    }
});

// Регистрация
AjaxModule.doPost({
    url: '/user/signup',
    body: {username, password, email},
    callback(status, responseText) {
        if (status === 200)
            // Регистрация успешна
            // Создаем профиль
            return;
        }

        const {error} = JSON.parse(responseText);
        alert(error);
    }
});

// обновить профиль
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
