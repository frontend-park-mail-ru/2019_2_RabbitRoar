import {createProfile} from '../../profile/profile_creator.js';
import {createRegistration} from '../../registration/registration_creator.js';
import {createAutorisation} from '../../autorisation/autorisation_creator.js';
import {createMainMenu} from '../main_menu.js';
import {NavbarCreator} from '../creators/navbar_creator.js'


export function setNavbarListeners() {
    document.querySelector('.navbar__game-logo').addEventListener('click', function (event) {
        createMainMenu();
    });
    document.querySelector('.navbar__user-logo').addEventListener('click', function (event) {
        createProfile();
    });

    let element = document.getElementById('nav_exit');
    if (element) {
        element.addEventListener('click', function (event) {
            document.cookie = "autorised=false";
            createRegistration();
        });
    }

    element = document.getElementById('nav_registration');
    if (element) {
        element.addEventListener('click', function (event) {
            createRegistration();
        });
    }

    element = document.getElementById('nav_login');
    if (element) {
        element.addEventListener('click', function (event) {
            createAutorisation();
        });
    }

}
