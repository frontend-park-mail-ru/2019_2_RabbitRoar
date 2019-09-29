export function setNavbarListeners() {
    document.querySelector('.navbar__game-logo').addEventListener('click', function (event) {
        alert("Главная страница");
    });
    document.querySelector('.navbar__user-logo').addEventListener('click', function (event) {
        alert("Редактирование личного кабинета");
    });
    document.querySelector('.navbar__exit').addEventListener('click', function (event) {
        alert("Пользователь вышел");
    });
}
