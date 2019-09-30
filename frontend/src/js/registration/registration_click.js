//import {createMainMenu} from '../main_menu/main_menu.js';
import {createProfile} from '../profile/profile_creator.js';
import {ajax} from '../requests/ajax.js';

export function setRegistrationListeners() {
    document.getElementById('registration').addEventListener('click', function (event) {
        const email = document.getElementById('email').value;
        const username = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        event.preventDefault();
        ajax(
            'POST',
            'http://localhost:3000/user/signup',
            {username, password, email},
            function (status, response) {
                if (status === 201) {
                    createProfile();
                } else {
                    const {error} = JSON.parse(response);
                    console.log(error);
                }
            }
        );
        return;

    }); 
}