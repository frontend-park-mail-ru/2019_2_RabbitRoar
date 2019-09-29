import {setTabListeners} from './events/tab_click.js';

import {RoomCreator} from './creators/room_creator.js'
import {BestCreator} from './creators/best_creator.js'


import Tabs from '../../templates/main_menu/tabs.pug';


const mainMenuItems = {
	rooms: 'Комнаты',
	top: 'Зал славы',
	packs: 'Игровые наборы',
};

//ID у табов являются ключами мапы!
export const contentCreators = new Map([['rooms', RoomCreator], ['top', BestCreator]])


export function createMainMenu(creatorType = 'top') {
    const creator = contentCreators.get(creatorType)
    application.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container')
    application.appendChild(mainContainer)
    mainContainer.innerHTML += Tabs();

    creator(mainContainer);


    setTabListeners()
}