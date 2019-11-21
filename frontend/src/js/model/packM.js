import { } from "../modules/requests.js";
import Bus from "../event_bus.js";
import { PACK_FOR_EDIT_WAS_CHOSEN } from "../modules/events.js";
import { } from "../modules/requests.js";
import { savePack, deletePackById, getMyPackList, getPlayedPackList, getPublicPackList, getPackById } from "../modules/requests.js";

import ContentF from "../fasade/contentF.js";

class PackM {
    constructor() {
        this.packIdForEditing;
        this.downloadList = new Array();
        this.packObj;
       // Bus.on(PACK_FOR_EDIT_WAS_CHOSEN, this._setInfoForPackEditing.bind(this));
    }

    getpackIdForEditing() {
        return this.packIdForEditing;
    }

    getCurrentPackObjForEditing() {
        return this.packObj;
    }

    async savePack(packObj, csrf) {
        await savePack(packObj, csrf);
    }

    async getPackById(id) {
        const currentPack = await getPackById(id);
        return currentPack;
    }

    async setInfoForPackEditing(packId) {
        this.packIdForEditing = packId;
        this.packObj = await ContentF.getPackById(this.packIdForEditing);
    }

    async deletePackById(crsfString, id) {
        await deletePackById(crsfString, id);
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
}
export default new PackM();