import { queryTabContent, getPlayedPackList, getPublicPackList } from "../modules/requests.js";
import Bus from "../event_bus.js";
import { PACK_WORKER_MESSAGE, PACK_WORKER_COMMAND } from "../modules/events.js";
import { savePack, getUserPacks, deletePackById, getMyPackList, getRooms } from "../modules/requests.js";

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

    async savePack(packObj, csrf) {
        await savePack(packObj, csrf);
    }

    async deletePackById(crsfString, id) {
        await deletePackById(crsfString, id);
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

    async updatePackList() {
        this.packList = new Array();

        let publicPacks;
        let playedPacks;
        let myPackList;

        try {
            publicPacks = await getPublicPackList();
        } catch (err) {
            console.log(err);
        }

        try {
            playedPacks = await getPlayedPackList();
        } catch (err) {
            console.log(err);
        }

        try {
            myPackList = await getMyPackList();
        } catch (err) {
            console.log(err);
        }


        if ((!publicPacks) && (!playedPacks) && (!myPackList)) {
            console.log("Error: pack list is empty!");
            return;
        }

        if (!publicPacks) {
            publicPacks = [];
        }
        if (!playedPacks) {
            playedPacks = [];
        }
        if (!myPackList) {
            myPackList = [];
        }

        const uniquePack = new Set([...publicPacks, ...playedPacks, ...myPackList]);
        for (const id of uniquePack) {
            this.packList.push(id);
        }
        console.log(`My packs: ${this.packList}`);




        if (localStorage.getItem("packs_list")) {
            const savedPacks = JSON.parse(localStorage.getItem("packs_list"));
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
            let packId = "";
            for (const ch of localStorage.key(i)) {
                if (ch === "-") {
                    break;
                }
                packId += ch;
            }

            if (isNaN(packId)) {
                continue;
            }

            if (countList[packId] === undefined) {
                countList[packId] = 0;
            }
            countList[packId]++;
        }

        const item = localStorage.getItem("packs_list");
        if (!item) {
            return;
        }
        const savedPacks = JSON.parse(item);

        for (const saveId of savedPacks) {
            if (countList[saveId] === undefined) {
                this.downloadList.push(saveId);
            }
        }

        //console.log(countList)
        for (const packId in countList) {
            if (countList[packId] !== keysForOnePack) {
                this.downloadList.push(packId);
                this._deletePack(packId);
            }
        }
        //console.log(this.downloadList)

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