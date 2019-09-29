import {createMainMenu} from '../main_menu/main_menu.js';

export function setRegistrationListeners() {
    document.getElementById('registration').addEventListener('click', function (event) {
        const email = document.getElementById('registration').textContent;
        if (email == '') {
            return
        }

        const login = document.getElementById('login').textContent;
        if (login == '') {
            return
        }

        const password = document.getElementById('password').textContent;
        if (password == '') {
            return
        }

        document.cookie = "autorised=true";
        createMainMenu();
        // //Отправляем на сервер логин с паролем, получаем НОВОГО пользователя
    }); 
}