import {createMainMenu} from '../main_menu/main_menu.js';
import {ajax} from '../requests/ajax.js';

export function setAutorisationListeners() {
    const element = document.getElementById('autorisation');
    element.addEventListener('click', function (event) {
    
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        event.preventDefault();


        alert("begin");
        ajax(
            'POST',
            'http://localhost:3000/user/login',
            {login, password},
            function (status, response) {
                alert("Пришло ебать");
                if (status === 200) {
                    document.cookie = "autorised=true";
                    createMainMenu();
                    alert("успех");
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            }
        );
        alert("end");

    }); 
}