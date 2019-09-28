
const cssColors = {
    colorBgDark: "rgb(23, 21, 32)",
    colorBg: "rgba(36, 27, 47, 1)",
    colorBgLight: "rgba(38, 35, 53, 1)",
    colorBorderPrimary: "rgba(54, 249, 246, 1)",
    colorBorderPrimaryLow: "rgba(54, 249, 246, 0.7)",
    colorBorderAlter: "rgba(254, 222, 93, 1)",
    colorAlert: "rgba(211, 97, 53, 1)",
    colorDanger: "#920031",
    colorSuccess: "#72f1b8",
}


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
        });
    });
}
