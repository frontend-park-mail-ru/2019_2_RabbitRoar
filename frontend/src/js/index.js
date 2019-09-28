import '../css/style.scss';
import '../js/main_content_creators.js';
import '../js/events.js';

console.log('Hello world!');
'use strict';

const application = document.getElementById('application');

const mainMenuItems = {
	rooms: 'Комнаты',
	top: 'Зал славы',
	packs: 'Игровые наборы',
};


const contentCreators = {
    rooms: roomCreator,
    topCreator: function(parent) {
    },
    packsCreator: function(parent) {
    }
};




function createMainMenu(contentCreator = contentCreators['rooms']) {
    application.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container')
    application.appendChild(mainContainer)

    
    Object.keys(mainMenuItems).forEach(function(key) {
        const containerTab = document.createElement('div');
        containerTab.classList.add('tab')
        containerTab.textContent = mainMenuItems[key]
        mainContainer.append(containerTab)
    });

    const tabContent = document.createElement('div');
    tabContent.classList.add('tab-content')
    mainContainer.append(tabContent)

    contentCreator(tabContent)
    
    setTabListeners()
}


createMainMenu(contentCreators['roomCreator']);
