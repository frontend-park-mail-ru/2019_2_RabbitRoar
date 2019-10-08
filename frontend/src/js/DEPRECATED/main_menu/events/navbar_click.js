import { createProfile } from '../../profile/profile_creator.js';
import { createRegistration } from '../../registration/registration_creator.js';
import { createAutorisation } from '../../autorisation/autorisation_creator.js';
import { createMainMenu } from '../main_menu.js';
import { getCookie, setCookie } from "../../cookie/cookie.js";

import { ajax } from '../../requests/ajax.js';

export function setNavbarListeners() {
    let element = document.querySelector('.navbar__game-logo');
    if (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            createMainMenu();
        });
    }

    element = document.querySelector('.navbar__user-logo')
    if (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            if (getCookie("id") == "") {
                createRegistration();
            } else {
                createProfile();
            }
        });
    };

    element = document.getElementById('nav_exit');
    if (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();

            const id = getCookie("id");
            ajax(
                'DELETE',
                'http://frontend.photocouple.space:3000/user/logout',
                { id },
                function (status, response) {
                    if (status === 200) {
                        createRegistration();
                    } else {
                        const { error } = JSON.parse(response);
                        console.log(error);
                    }
                }
            );
        });
    }

    element = document.getElementById('nav_registration');
    if (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            createRegistration();
        });
    }

    element = document.getElementById('nav_login');
    if (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            createAutorisation();
        });
    }

}