import Autorisation from '../../templates/autorisation/autorisation.pug';
import {NavbarCreator} from '../main_menu/creators/navbar_creator.js'

import {setNavbarListeners} from '../main_menu/events/navbar_click.js';
import {setAutorisationListeners} from './autorisation_click.js';

export function createAutorisation() {
    application.innerHTML = '';
    application.innerHTML += NavbarCreator();
    application.innerHTML += Autorisation();

    setNavbarListeners()
    setAutorisationListeners();
}