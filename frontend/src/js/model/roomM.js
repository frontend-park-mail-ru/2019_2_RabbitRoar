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
        ).finally(
            () => console.log("комната уничтожена")
        );
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


        WebSocketIface.addMessageHandler("user_connected", this._userConnectedToRoom);
        WebSocketIface.addMessageHandler("player_ready_back", this._userReadyToPlay);

        WebSocketIface.addOpenHandler(this._doneConnection);
        WebSocketIface.addCloseHandler(this._closeConnection);

        console.log("комната создалась");
    }

    _userReadyToPlay = (data) => {
        const newPlayer = data.players;
        Bus.emit(ROOM_CHANGE, "user_ready");
    }

    _userConnectedToRoom = (data) => {
        console.log("user connected");
        const payloadObj = data.payload;

        this.roomName = payloadObj.room_name;
        this.packName = payloadObj.pack_name;
        this.host = payloadObj.host;
        this.players = payloadObj.palyers;

        console.log(payloadObj);
        // this.playersCap = data.players_cap;
        // this.private = data.private;
        // this.packId = data.pack_id;
        // this.lastState = this.state;
        // this.state = "waiting";
        Bus.emit(ROOM_CHANGE, "user_connected");
    }


    _doneConnection = () => {
        this.lastState = this.state;
        this.state = "done_connection";
        Bus.emit(ROOM_CHANGE);
    }

    _closeConnection = (event) => {
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
            } catch (err) {
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
        } catch (err) {
            console.log(err);
            this.lastState = this.state;
            this.state = "crash_connection";
            return;
        }

        try {
            const csrf = await getCSRF();
            response = await postJoinRoom(this.roomId, csrf.CSRF);
        } catch (err) {
            console.log(err);
            this.lastState = this.state;
            this.state = "crash_connection";
            return;
        }

        this.roomInfo = response;
        this.lastState = this.state;
        this.state = "before_connection";

        WebSocketIface.connect(this.roomId);
    }

}

export default new RoomM();