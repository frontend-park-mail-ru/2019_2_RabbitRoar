setTabListeners = () => {
    let tabs = document.querySelectorAll('div.tab')
    if (tabs == SyntaxError) {
        alert("No exist div.tab!")
        return
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function (event) {
            tab.className = 'tab-click';

            let noClickTab = document.querySelectorAll('div.tab , div.tab-click');
            noClickTab.forEach(function(noClick) {
                if (noClick != tab) {
                    noClick.className = "tab";
                }
            });

            createMainMenu();
        });
    });
}
