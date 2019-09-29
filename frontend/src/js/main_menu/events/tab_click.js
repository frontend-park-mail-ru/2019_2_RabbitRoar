import {createMainMenu} from '../main_menu.js';

export function setTabListeners() {
    let tabs = document.querySelectorAll('div.tab')
    if (tabs == SyntaxError) {
        alert("No exist div.tab!")
        return
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function (event) {
            const clickId = tab.id;
            createMainMenu(tab.id);

            const clickTab = document.getElementById(clickId)
            clickTab.className = 'tab-click';

            const noClickTab = document.querySelectorAll('div.tab , div.tab-click');
            noClickTab.forEach(function(noClick) {
                if (noClick != clickTab) {
                    noClick.className = "tab";
                }
            });
        });
    });
}
