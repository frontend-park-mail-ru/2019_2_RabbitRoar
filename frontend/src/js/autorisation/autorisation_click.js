import {createMainMenu} from '../main_menu/main_menu.js';
import {ajax} from '../requests/ajax.js';

export function setAutorisationListeners() {
    const element = document.getElementById('autorisation');
    element.addEventListener('click', function (event) {
    
        const username = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        event.preventDefault();

        ajax(
            'POST',
            'http://localhost:3000/user/login',
            {username, password},
            function (status, response) {
                if (status === 200) {
                    createMainMenu();
                } else {
                    const {error} = JSON.parse(response);
                    console.log(error);
                }
            }
        );
    }); 
}