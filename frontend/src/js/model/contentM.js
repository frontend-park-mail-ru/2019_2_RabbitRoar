import { queryTabContent, getPlayedPackList, getPublicPackList } from "../modules/requests.js";
import Bus from "../event_bus.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "../modules/events.js";
import { getRooms, getUserPacks } from "../modules/requests.js";

import ContentF from "../fasade/contentF.js";


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
            localStorage.setItem(msg.data.key, msg.data.value)
        } else if (msg.data.type === "question") {
            localStorage.setItem(msg.data.key, msg.data.value)
        } else if (msg.data.type === "full") {
            const toBack = JSON.parse(msg.data.value);
            console.log(toBack);
        }
    }


    async getUserPacks() {
        const packs = await getUserPacks();
        return packs;
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

            let rooms = [];
            try {
                rooms = await getRooms();
                if (!rooms) {
                    throw new Error("Can't get room list for unautorised user");
                }
            } catch (err) {
                throw (err);
            }

            if (rooms) {
                for (const room of rooms) {
                    mainContent.content.push(room);
                }
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
            const packs = await getUserPacks();
            const mainContent = {
                contentType: id,
                content: packs
            };
            return mainContent;
        }

        // empty content
        if (id === window.id.tabAboutGame) {
            const mainContent = {
                contentType: id,
            };
            return mainContent;
        }

        if (id === window.id.tabOffline) {
            const allId = JSON.parse(localStorage.getItem("packs_list"));
            if (!allId) {
                return {
                    infoPanel: {},
                    contentType: id,
                    content: {}

                };;
            }

            const packs = (() => {
                const packs = new Array;
                for (const id of allId) {
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