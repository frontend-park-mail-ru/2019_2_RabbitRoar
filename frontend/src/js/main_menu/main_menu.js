import {setTabListeners} from './events/tab_click.js';
import {setNavbarListeners} from './events/navbar_click.js';

import {RoomCreator} from './creators/room_creator.js'
import {BestCreator} from './creators/best_creator.js'


import Navbar from '../../templates/main_menu/navbar.pug';
import Tabs from '../../templates/main_menu/tabs.pug';



//ID у табов являются ключами мапы!
export const contentCreators = new Map([['rooms', RoomCreator], ['top', BestCreator]])


export function createMainMenu(creatorType = 'top') {
    const creator = contentCreators.get(creatorType)
    application.innerHTML = '';
    application.innerHTML += Navbar();

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container')
    application.appendChild(mainContainer)
    mainContainer.innerHTML += Tabs();

    creator(mainContainer);


    setTabListeners();
    setNavbarListeners();
}