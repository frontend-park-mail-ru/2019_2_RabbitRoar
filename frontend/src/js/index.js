import '../css/style.scss';
import '../js/main_content_creators.js';
import '../js/events.js';

import roomsTemplate from '../templates/tabs/rooms_content.pug';
import tabs from '../templates/tabs/tabs.pug';
import paginat from '../templates/tabs/paginator.pug';


const application = document.getElementById('application');

const mainMenuItems = {
	rooms: 'Комнаты',
	top: 'Зал славы',
	packs: 'Игровые наборы',
};



const contentCreators = {
    roomCreator:{
        info:   roomsTemplate,
        pushContent(container) {getRooms(this, container);},
        paginator: paginat
    },
};




function createMainMenu(creator = contentCreators.roomCreator) {
    application.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container')
    application.appendChild(mainContainer)
    mainContainer.innerHTML += tabs();


    //templateContent = GetRooms()

    let templateContent = [];
    templateContent.push({
        name:   'Топовая комната',
        amount: '4/5',
    });
    templateContent.push({
        name:   'Топовая комната',
        amount: '4/5',
    });
    templateContent.push({
        name:   'Топовая комната',
        amount: '4/5',
    });
    templateContent.push({
        name:   'Топовая комната',
        amount: '4/5',
    });
    
    mainContainer.insertAdjacentHTML('beforeend', roomsTemplate({
        templateContent
    }));

    setTabListeners()
}



createMainMenu();
