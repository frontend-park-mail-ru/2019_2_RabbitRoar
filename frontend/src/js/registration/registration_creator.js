import Registration from '../../templates/registration/registration.pug';
import {NavbarCreator} from '../main_menu/creators/navbar_creator.js'

import {setNavbarListeners} from '../main_menu/events/navbar_click.js';
import {setRegistrationListeners} from './registration_click.js';

export function createRegistration() {
    alert(document.cookie);
    application.innerHTML = '';
    application.innerHTML += NavbarCreator();
    application.innerHTML += Registration();

    setNavbarListeners()
    setRegistrationListeners();
    return;
}