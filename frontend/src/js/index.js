import '../css/style.scss';
import '../js/main_content_creators.js';
import '../js/events.js';

import tabs from '../templates/tabs/tabs.pug';



const application = document.getElementById('application');

const mainMenuItems = {
	rooms: 'Комнаты',
	top: 'Зал славы',
	packs: 'Игровые наборы',
};

const tabNames = ['rooms', 'top', 'packs'];
const contentCreators = {
    rooms: roomCreator,
    topCreator: function(parent) {
    },
    packsCreator: function(parent) {
    }
};




function createMainMenu(contentType = tabNames[0]) {
    application.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container')
    application.appendChild(mainContainer)

    mainContainer.innerHTML += tabs();

    contentCreators[contentType](mainContainer);
    alert("1")

    setTabListeners()
}


createMainMenu();
