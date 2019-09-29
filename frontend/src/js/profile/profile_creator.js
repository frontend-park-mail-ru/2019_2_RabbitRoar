import Navbar from '../../templates/main_menu/navbar.pug';
import Profile from '../../templates/profile/profile.pug';

import {setNavbarListeners} from '../main_menu/events/navbar_click.js';
import {setProfileListeners} from './profile_click.js';

export function createProfile() {
    application.innerHTML = '';
    application.innerHTML += Navbar();
    application.innerHTML += Profile();

    setNavbarListeners()
    setProfileListeners();
}