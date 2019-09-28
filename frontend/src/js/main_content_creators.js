
roomCreator = function roomCreate(parent) {
    const infoLine = document.createElement('div');
    infoLine.classList.add('rooms-panel');
    parent.append(infoLine);


    const name = document.createElement('div');
    name.classList.add('panel-elem');
    name.classList.add('elem-justify-start');
    name.textContent = 'Название:'
    infoLine.append(name);

    const amount = document.createElement('div');
    amount.classList.add('panel-elem');
    amount.textContent = 'Количество:'
    infoLine.append(amount);

    const imageTaker = document.createElement('div');
    imageTaker.classList.add('panel-elem');

    const image = document.createElement('img');
    image.classList.add('room-join-img')
    image.src = 'https://myandroid.ru/uploads/posts/2019-01/kto-takoj-rikardo-milos-chim-imenem-nazyvajut-obekty-na-google-kartah_1.png'
    image.alt = 'No img'

    imageTaker.append(image)
    infoLine.append(imageTaker);

    //Запросить все комнаты
    //Цикл формирования страницы
};