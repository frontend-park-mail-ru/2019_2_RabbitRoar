import {postCreateRoom, postJoinRoom, getWS} from "../modules/requests.js"
 

class RoomM {
    constructor() {

    }

    CreateNew(clickId, roomOptions = undefined) {
        this.roomOptions = roomOptions;
        if (this.roomOptions !== undefined) {
            this.sendData = this._create.bind(this);
        } else {
            this.sendData = this._join.bind(this);
        }
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



}

export default new RoomM();