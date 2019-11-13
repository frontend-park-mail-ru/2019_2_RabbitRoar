import { postCreateRoom, postJoinRoom, getWS } from "../modules/requests.js"
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { ROOM_CHANGE } from "../modules/events.js";

class RoomM {
    constructor(packName) {
        WebSocketIface.addMessageHandler("room_created", this._roomCreated.bind(this));
        WebSocketIface.addMessageHandler("room_to_delete", this._roomToDeleted.bind(this));

        WebSocketIface.addErrorHandler(this._crashConnection.bind(this));
        WebSocketIface.addOpenHandler(this._doneConnection.bind(this));
        WebSocketIface.addCloseHandler(this._closeConnection.bind(this));
    }

    _roomCreated() {

    }

    _roomToDeleted() {

    }

    _crashConnection(error) {
        // this.lastState = this.state;
        // this.state = "crashed";
        // Bus.emit(ROOM_CHANGE);
    }

    _doneConnection() {
        this.lastState = this.state;
        this.state = "waiting";
        Bus.emit(ROOM_CHANGE);
    }

    _closeConnection(event) {
        this.lastState = this.state;
        this.state = "closed";
        this.closeCode = event.code;
        Bus.emit(ROOM_CHANGE);
    }


    CreateNew(roomId, roomOptions) {
        this.state = "inited";
        this.roomOptions = roomOptions;
        this.roomId = roomId;

        console.log("комната создалась");
        console.log(this.roomId);
    }

    async connect() {
        if (this.roomOptions) {
            const response = await postCreateRoom(this.roomOptions);
            this.roomId = response.id;
        }

        WebSocketIface.connect(this.roomId);
    }

    async _join() {
        console.log("ROOM JOIN");
        //await postJoinRoom(this.roomId);
        //await getWS();
        WebSocketIface.connect();
    }

    async _create() {
        console.log("ROOM CREATED");
        //
        //await getWS();
        //WebSocketIface.connect();
    }

    getRoomName() {
        return this.packName;
    }

}

export default new RoomM();