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
        this.lastState;
        this.roomOptions = roomOptions;
        this.roomId = roomId;

        // this.curentUsersAmount = 0;
        // this.curentReadyUsersAmount = 0;

        this.UUID;
        this.roomName;
        this.playersCapacity;
        this.playersJoined;
        this.pack;
        this.packName;

        this.lastNewPlayerData;

        WebSocketIface.addMessageHandler("user_connected", this._playerJoinedToRoom);
        WebSocketIface.addMessageHandler("player_ready_back", this._playerReady);

        WebSocketIface.addOpenHandler(this._doneConnection);
        WebSocketIface.addCloseHandler(this._closeConnection);

        console.log("комната создалась");
    }

    _playerReady = (data) => {


        console.log("Player ready: ");
        console.log(data);

        this.playersJoined++;
        if (this.playersJoined === this.playersCapacity) {
            alert("start game");
        }
        this.playerJoinedData = data;
        Bus.emit(ROOM_CHANGE, "player_ready");
    }

    _playerJoinedToRoom = (data) => {
        this.lastState = this.state;
        this.state = "waiting";
        
        console.log("Player joined :");
        console.log(data);

        this.playerJoinedData
        Bus.emit(ROOM_CHANGE, "player_connected");
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
            this.roomId = response.UUID;
            console.log("ROOM ID from create:", this.roomId);
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

        this.UUID = response.UUID;
        this.roomName = response.roomName;
        this.playersCapacity = response.playersCapacity;
        this.playersJoined = parseInt(response.playersJoined);
        this.pack = response.pack;
        this.packName = response.packName;

        this.lastState = this.state;
        this.state = "before_connection";

        WebSocketIface.connect(this.roomId);
    }

}

export default new RoomM();