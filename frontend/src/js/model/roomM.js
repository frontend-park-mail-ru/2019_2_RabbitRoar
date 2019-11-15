import { postCreateRoom, getJoinRoom } from "../modules/requests.js"
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { ROOM_CHANGE } from "../modules/events.js";

// "created" - Игра создана как объект в памяти
// "before_connection" - Отправили join запрос и получили инфо о комнате
// "done_connection" - Удалось установить соединение по вебсоккету
// "waiting" - Ожидание игроков
// "game" - Процесс игры
// "closed" - Вебсоккет закрылся


class RoomM {
    constructor() {
        this.current = undefined;
    }

    get state() {
        return this.current.state;
    }

    CreateNew(roomId, roomOptions) {
        this.current = new RealRoomM(roomId, roomOptions);
    }

    clear() {
        WebSocketIface.disconnect();
        this.current = undefined;
        console.log("комната уничтожена");
    }

    async connect() {
        await this.current.connect();
    }

    getRoomName() {
        return this.current.roomId;
    }
}

class RealRoomM {
    constructor(roomId, roomOptions) {
        this.state = "created";
        this.roomOptions = roomOptions;
        this.roomId = roomId;

        this.createHandler = this._roomCreated.bind(this);

        WebSocketIface.addMessageHandler("room_created", this.createHandler);

        WebSocketIface.addOpenHandler(this._doneConnection.bind(this));
        WebSocketIface.addCloseHandler(this._closeConnection.bind(this));

        console.log("комната создалась");
    }


    _roomCreated(data) {
        console.log("Room init data recieve");
        this.roomName = data.room_name;
        this.playersCap = data.players_cap;
        this.private = data.private;
        this.packId = data.pack_id;
        this.players = data.players;

        this.lastState = this.state;
        this.state = "waiting";
        Bus.emit(ROOM_CHANGE);
    }


    _doneConnection() {
        this.lastState = this.state;
        this.state = "done_connection";
        Bus.emit(ROOM_CHANGE);
    }

    _closeConnection(event) {
        this.lastState = this.state;
        this.state = "closed";
        this.closeCode = event.code;
        Bus.emit(ROOM_CHANGE);
    }


    async connect() {
        if (this.roomOptions) {
            try{
                const response = await postCreateRoom(this.roomOptions);
            } catch(err) {
                console.log(err);
                throw(err);
            }

            this.roomId = response.id;
        }

        try {
            const response = await getJoinRoom(this.roomId);
        } catch(err) {
            console.log(err);
            throw(err);
        }

        this.roomName = response.room_name;
        this.playersCap = response.players_cap;
        this.private = response.private;
        this.packId = response.pack_id;

        this.lastState = this.state;
        this.state = "before_connection";

        WebSocketIface.connect(this.roomId);
        Bus.emit(ROOM_CHANGE);
    }

}

export default new RoomM();