import {setTabListeners} from './events/tab_click.js';
import {setNavbarListeners} from './events/navbar_click.js';

import {RoomCreator} from './creators/room_creator.js'
import {BestCreator} from './creators/best_creator.js'
import {NavbarCreator} from './creators/navbar_creator.js'

import {getCookie} from "../cookie/cookie.js";


import Tabs from '../../templates/main_menu/tabs.pug';

import {createRegistration} from '../registration/registration_creator.js';


//ID у табов являются ключами мапы!
export const contentCreators = new Map([['rooms', RoomCreator], ['top', BestCreator]])


export function createMainMenu(creatorType = 'top') {
    if (getCookie("id") == "") {
        createRegistration();
        return;
    }
    const creator = contentCreators.get(creatorType)
    application.innerHTML = '';
    application.innerHTML += NavbarCreator();

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container')
    application.appendChild(mainContainer)
    mainContainer.innerHTML += Tabs();

    creator(mainContainer);


    setTabListeners();
    setNavbarListeners();
    return;
}