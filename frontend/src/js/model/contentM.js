import { queryTabContent } from "../modules/requests.js";
import Bus from "../event_bus.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "../modules/events.js";


//PUBLIC:
//async getTabContent(id)
//async updatePackList()
//clearBadPacks()
//getPacksForLoad()

//PRIVATE:
//_workerHandler(msg)



class ContentM {
    constructor() {
        this.downloadList = new Array();
        Bus.on(PACK_WORKER_MESSAGE, this._workerHandler.bind(this));
    }

    _workerHandler(msg) {
        if (msg.data.type === "pack") {
            let savePacks = {};
            if (localStorage.getItem("packs_list")) {
                savePacks = JSON.parse(localStorage.getItem("packs_list"));
                localStorage.removeItem("packs_list");
            }

            savePacks[msg.data.key] = "";
            localStorage.setItem("packs_list", JSON.stringify(savePacks));

            localStorage.setItem(msg.data.key, msg.data.value)
        } else if (msg.data.type === "question") {
            localStorage.setItem(msg.data.key, msg.data.value)
        } else if (msg.data.type === "full") {
            console.log(msg.data.value);
        }
    }

    async updatePackList() {
        //this.packList = await getPackList();
        this.packList = [0, 1];

        if (localStorage.getItem("packs_list")) {
            const savedPacks = JSON.parse(localStorage.getItem("packs_list"));
            console.log(savedPacks);
            for (const savedPackId of savedPacks) {     // Удалит паки которых нет у пользователя в профиле
                if (!this.packList.includes(savedPackId)) {
                    console.log(`delete pack with id: ${savedPackId}`);
                    this._deletePack(savedPackId);
                }
            }
            localStorage.removeItem("packs_list");
        }
        localStorage.setItem("packs_list", JSON.stringify(this.packList));
    }


    doPackValidation() {
        const keysForOnePack = 26;
        const countList = {};

        for (let i = 0; i < localStorage.length; i++) {
            const packId = localStorage.key(i)[0];
            if (isNaN(packId)) {
                continue;
            }

            if (countList[packId] === undefined) {
                countList[packId] = 0;
            }
            countList[packId]++;
        }

        const savedPacks = JSON.parse(localStorage.getItem("packs_list"));

        for (const saveId of savedPacks) {
            if (countList[saveId] === undefined) {
                this.downloadList.push(saveId);
            }
        }


        for (const packId in countList) {
            if (countList[packId] !== keysForOnePack) {
                this.downloadList.push(packId);
                this._deletePack(packId);
            }
        }
    }

    getDownloadList() {
        return this.downloadList;
    }



    _deletePack(packId) {
        const deleteList = new Array;
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i)[0] === packId) {
                deleteList.push(localStorage.key(i));
            }
        }

        for (const deleteKey of deleteList) {
            localStorage.removeItem(deleteKey);
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
                    currentPlayers: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
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

        if (id === window.id.tabOffline) {
            const allId = JSON.parse(localStorage.getItem("packs_list"));
            if (!allId) {
                return;
            }

            const packs = (() => {
                const packs = new Array;
                for (const id in allId) {
                    const pack = localStorage.getItem(id);
                    if (pack) {
                        packs.push(JSON.parse(pack));
                    }
                }
                return packs;
            })();

            const mainContent = {
                infoPanel: {},
                contentType: id,
                content: packs
            };
            return mainContent;
        }
    }

}
export default new ContentM();