import Bus from "../event_bus.js";

import { PACK_WORKER_MESSAGE } from "../modules/events.js";
import { getRooms, getUserPacks, getTop, getAllPacksForOnline } from "../modules/requests.js";
import StaticManager from "../modules/staticManager.js";

class ContentM {
    constructor() {
        Bus.on(PACK_WORKER_MESSAGE, this._workerHandler);
    }

    _workerHandler = (msg) => {
        if (msg.data.type === "pack") {
            localStorage.setItem(msg.data.key, msg.data.value)
        } else if (msg.data.type === "question") {
            localStorage.setItem(msg.data.key, msg.data.value)
        } else if (msg.data.type === "full") {
            const toBack = JSON.parse(msg.data.value);
            console.log(toBack);
        }
    }

    

    getUserPacks = async () => {
        const packs = await getUserPacks();
        return packs;
    }


    getAllPacksForOnline = async () => {
        const packs = await getAllPacksForOnline();
        return packs;
    }

    getTabContent = async (id, pageNumber) => {
        if (id === window.id.tabRoom) {
            const mainContent = {
                infoPanel: {},
                contentType: id,
                content: []
            };

            let rooms = [];
            try {
                rooms = await getRooms(pageNumber);
                if (!rooms) {
                    throw new Error("Can't get room list for unautorised user");
                }
            } catch (err) {
                throw (err);
            }

            for (const room of rooms) {
                mainContent.content.push(room);
            }
            return mainContent;
        }

        if (id === window.id.tabTop) {
            const mainContent = {
                infoPanel: {},
                contentType: id,
                content: []
            };

            let topList = [];
            try {
                topList = await getTop(pageNumber);
                if (!topList) {
                    throw new Error("Can't get top list for unautorised user");
                }
            } catch (err) {
                throw (err);
            }

            for (const user of topList) {
                user.rank = StaticManager.getRank(user.rating);
                user.avatar_url = StaticManager.getUserUrl(user.avatar_url);
                mainContent.content.push(user);
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

        // // empty content
        // if (id === window.id.tabAboutGame) {
        //     const mainContent = {
        //         contentType: id,
        //     };
        //     return mainContent;
        // }

        if (id === window.id.tabOffline) {
            const allId = JSON.parse(localStorage.getItem("packs_list"));
            if (!allId) {
                return {
                    contentType: id,
                    content: {}

                };
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
                contentType: id,
                content: packs
            };
            return mainContent;
        }
    }

}
export default new ContentM();