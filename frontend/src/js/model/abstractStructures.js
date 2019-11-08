// Передается в шаблон TabsT.pug
// Формируется на беке, запрашивается в contentM.queryTabContent
Rooms = {
    infoPanel: {
        src: "url картинки 'присоединиться'"
    },

    contentType: "тип контента, пока что id элемента в верстке",
    content: [
        {
            name: "Название комнаты",
            maxPlayers: "Максимум игроков",
            currentPlayers: "Текущее количество",
            roomId: "Идентификатор комнаты"
        }
    ]
}


Top = {
    infoPanel: {
        src: "url картинки 'Профиль'"
    },

    contentType: "тип контента, пока что id элемента в верстке",
    content: [
        {
            name: "Имя игрока",
            userSrc: "Урл к аве",
            raiting: "Рейтинг",
            rankDescr: "Описание звания",
            rankSrc: "Урл к картинке звания"
        }
    ]
}

