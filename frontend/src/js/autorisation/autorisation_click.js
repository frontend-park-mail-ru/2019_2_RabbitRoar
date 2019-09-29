import {createMainMenu} from '../main_menu/main_menu.js';

export function setAutorisationListeners() {
    document.getElementById('autorisation').addEventListener('click', function (event) {
        const login = document.getElementById('autorisation').textContent;
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