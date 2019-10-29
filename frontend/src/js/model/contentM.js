import { queryTabContent } from "../modules/requests.js";
import Bus from "../event_bus.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "../modules/events.js";

class ContentM {
    constructor() {
        Bus.on(PACK_WORKER_MESSAGE, this._workerHandler.bind(this));
    }

    _workerHandler(msg) {
        console.log("message from worker");
        if (msg.data.type === "pack") {
            console.log("PACK");
            console.log(msg.data.value);
            console.log(msg.data.value.length);
            localStorage.setItem(msg.data.key, msg.data.value)

            // const fromLocal = JSON.parse(localStorage.getItem(msg.data.key));
            // console.log(fromLocal);
        } else if (msg.data.type === "question") {
            console.log("QUESTION");
            console.log(msg.data.value);
            console.log(msg.data.value.length);
            localStorage.setItem(msg.data.key, msg.data.value)

            // const fromLocal = JSON.parse(localStorage.getItem(msg.data.key));
            // console.log(fromLocal);
        }
    }

    async getTabContent(id) {
        if (id === window.id.tabRoom) {
            const mainContent = {
                infoPanel: {
                    src: "https://myandroid.ru/uploads/posts/2019-01/kto-takoj-rikardo-milos-chim-imenem-nazyvajut-obekty-na-google-kartah_1.png"
                },
                contentType: id,
                content: []
            };
            for (let i = 0; i < 20; i++) {
                mainContent.content.push({
                    name: "Название комнаты",
                    maxPlayers: 4,
                    currentPlayers: Math.floor(Math.random() * (4 - 0 + 1)) + 0,
                    roomId: i + 1,
                });
            }


            return mainContent;
        }
        if (id === window.id.tabTop) {
            const mainContent = {
                infoPanel: {
                    src: "https://www.pnglot.com/pngfile/detail/493-4930333_user-icon-my-profile-icon-png.png"
                },
                contentType: id,
                content: []
            };
            for (let i = 0; i < 20; i++) {
                mainContent.content.push({
                    name: `Дувейн_Скола_Жонсон${i}`,
                    userSrc: "https://memepedia.ru/wp-content/uploads/2018/07/ya-eblan-original.jpg",
                    raiting: 1000 + i * 10,
                    rankDescr: "Сверхразум",
                    rankSrc: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/65/65635a2df235b74236755edf1e0b57ec61af53fc_full.jpg"
                });
            }

            return mainContent;
        }
        if (id === window.id.tabPack) {
            const mainContent = {
                text: "Добро пожаловать в Свою Игру!",
                contentType: id,
                content: []
            };
            return mainContent;
        }
    }

}
export default new ContentM();