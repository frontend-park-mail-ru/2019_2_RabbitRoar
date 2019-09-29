import {createProfile} from '../../profile/profile_creator.js';
import {createMainMenu} from '../main_menu.js';

export function setNavbarListeners() {
    document.querySelector('.navbar__game-logo').addEventListener('click', function (event) {
        createMainMenu();
    });
    document.querySelector('.navbar__user-logo').addEventListener('click', function (event) {
        createProfile();
    });
    document.querySelector('.navbar__exit').addEventListener('click', function (event) {
        alert("Пользователь вышел");
    });
}
