import BestTemplate from '../../../templates/main_menu/best_content.pug';


export function BestCreator(container) {
    //templateContent = GetBestList()

    let templateContent = [];
    templateContent.push({
        src: 'https://memepedia.ru/wp-content/uploads/2018/07/ya-eblan-original.jpg',
        name: 'Дувейн Скола Жонсан',
        rate: {
            value: 1488,
            description: 'Сверхразум',
            src: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/65/65635a2df235b74236755edf1e0b57ec61af53fc_full.jpg'
        }
    });
    templateContent.push({
        src: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bufo_bufo_03-clean.jpg',
        name: 'Jaba',
        rate: {
            value: 100,
            description: 'Хлеб',
            src: 'http://zhivie-zlaki.nethouse.ru/static/img/0000/0005/0228/50228823.2cujbjburo.W665.jpg'
        }
    });
    templateContent.push({
        src: 'https://memepedia.ru/wp-content/uploads/2018/07/ya-eblan-original.jpg',
        name: 'Дувейн Скола Жонсан',
        rate: {
            value: 1488,
            description: 'Сверхразум',
            src: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/65/65635a2df235b74236755edf1e0b57ec61af53fc_full.jpg'
        }
    });
    templateContent.push({
        src: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bufo_bufo_03-clean.jpg',
        name: 'Jaba',
        rate: {
            value: 100,
            description: 'Хлеб',
            src: 'http://zhivie-zlaki.nethouse.ru/static/img/0000/0005/0228/50228823.2cujbjburo.W665.jpg'
        }
    });    templateContent.push({
        src: 'https://memepedia.ru/wp-content/uploads/2018/07/ya-eblan-original.jpg',
        name: 'Дувейн Скола Жонсан',
        rate: {
            value: 1488,
            description: 'Сверхразум',
            src: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/65/65635a2df235b74236755edf1e0b57ec61af53fc_full.jpg'
        }
    });
    templateContent.push({
        src: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bufo_bufo_03-clean.jpg',
        name: 'Jaba',
        rate: {
            value: 100,
            description: 'Хлеб',
            src: 'http://zhivie-zlaki.nethouse.ru/static/img/0000/0005/0228/50228823.2cujbjburo.W665.jpg'
        }
    });
    templateContent.push({
        src: 'https://memepedia.ru/wp-content/uploads/2018/07/ya-eblan-original.jpg',
        name: 'Дувейн Скола Жонсан',
        rate: {
            value: 1488,
            description: 'Сверхразум',
            src: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/65/65635a2df235b74236755edf1e0b57ec61af53fc_full.jpg'
        }
    });
    templateContent.push({
        src: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bufo_bufo_03-clean.jpg',
        name: 'Jaba',
        rate: {
            value: 100,
            description: 'Хлеб',
            src: 'http://zhivie-zlaki.nethouse.ru/static/img/0000/0005/0228/50228823.2cujbjburo.W665.jpg'
        }
    });
    templateContent.push({
        src: 'https://memepedia.ru/wp-content/uploads/2018/07/ya-eblan-original.jpg',
        name: 'Дувейн Скола Жонсан',
        rate: {
            value: 1488,
            description: 'Сверхразум',
            src: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/65/65635a2df235b74236755edf1e0b57ec61af53fc_full.jpg'
        }
    });
    templateContent.push({
        src: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bufo_bufo_03-clean.jpg',
        name: 'Jaba',
        rate: {
            value: 100,
            description: 'Хлеб',
            src: 'http://zhivie-zlaki.nethouse.ru/static/img/0000/0005/0228/50228823.2cujbjburo.W665.jpg'
        }
    });


    container.insertAdjacentHTML('beforeend', BestTemplate({
        templateContent
    }));
}