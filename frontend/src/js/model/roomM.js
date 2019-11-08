import {postCreateRoom, postJoinRoom, getWS} from "../modules/requests.js"
 

class RoomM {
    constructor(packName) {
    }

    CreateNew(clickId, roomOptions = undefined) {
        this.roomOptions = roomOptions;
        this.packName = clickId;
        if (this.roomOptions !== undefined) {
            this.sendData = this._create.bind(this);
        } else {
            this.sendData = this._join.bind(this);
        }
        console.log("комната создалась");
        console.log(this.packName);
    }

    async _join() {
        console.log("ROOM JOIN");
        //await postJoinRoom(this.roomId);
        //await getWS();
    }

    async _create() {
        console.log("ROOM CREATED");
        //await postCreateRoom(this.roomOptions);
        //await getWS();
    }

    getRoomName() {
        return this.packName;
    }

}

export default new RoomM();