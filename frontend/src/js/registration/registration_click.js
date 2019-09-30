import {createMainMenu} from '../main_menu/main_menu.js';
import {createProfile} from '../profile/profile_creator.js';
import {ajax} from '../requests/ajax.js';

export function setRegistrationListeners() {
    document.getElementById('registration').addEventListener('click', function (event) {
        const email = document.getElementById('email').value;
        const username = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        event.preventDefault();
<<<<<<< HEAD
        ajax(
            'POST',
            'http://localhost:3000/user/signup',
=======

        ajax(
            'POST',
            'localhost:3000/user/signup',
>>>>>>> 15bceeef014bb5f8971c743eb6814bcc55b3fcaa
            {username, password, email},
            function (status, response) {
                if (status === 201) {
                    document.cookie = "autorised=true";
                    createProfile();
                } else {
                    alert(status);
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            }
        );
<<<<<<< HEAD

        return;

=======
        alert("228");
>>>>>>> 15bceeef014bb5f8971c743eb6814bcc55b3fcaa
    }); 
}