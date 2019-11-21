import { postCreateRoom, postJoinRoom, getCSRF, deleteLeaveRoom } from "../modules/requests.js"
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { ROOM_CHANGE } from "../modules/events.js";

// "created" - Игра создана как объект в памяти
// "before_connection" - Отправили join запрос и получили инфо о комнате
// "crash_connection" - Сервер не ответил по https
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

// WebSocketIface.disconnect() если соккет был открыт,
// произойдет вызов this.current._closeConnection()
    clear() {
        WebSocketIface.disconnect();
        this.current = undefined;
        getCSRF().then(
            (csrf) => deleteLeaveRoom(csrf.CSRF)
        ).catch(
            (err) => console.log(`Can't leave room ${err}`)
        );
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
        let response;
        if (this.roomOptions) {
            console.log("POST CREATE");
            try {
                const csrf = await getCSRF();
                response = await postCreateRoom(this.roomOptions, csrf.CSRF);
            } catch(err) {
                console.log(err);
                this.lastState = this.state;
                this.state = "crash_connection";
                return;
            }
            this.roomId = response.id;
        }

        try {
            const csrf = await getCSRF();
            await deleteLeaveRoom(csrf.CSRF);
        } catch(err) {
            console.log(err);
            this.lastState = this.state;
            this.state = "crash_connection";
            return;
        }

        try {
            const csrf = await getCSRF();
            response = await postJoinRoom(this.roomId, csrf.CSRF);
        } catch(err) {
            console.log(err);
            this.lastState = this.state;
            this.state = "crash_connection";
            return;
        }

        this.roomName = response.room_name;
        this.playersCap = response.players_cap;
        this.private = response.private;
        this.packId = response.pack_id;

        this.lastState = this.state;
        this.state = "before_connection";

        WebSocketIface.connect(this.roomId);
    }

}

export default new RoomM();