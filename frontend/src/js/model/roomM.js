import { postCreateRoom, postJoinRoom, getCSRF, deleteLeaveRoom } from "../modules/requests.js"
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { ROOM_CHANGE } from "../modules/events.js";

import StaticManager from "../modules/staticManager.js";

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
            (csrf) => { 
                deleteLeaveRoom(csrf.CSRF);
                console.log("Вы успешно покинули игру");
            }
        ).catch(
            (err) => console.log(`Can't leave room ${err}`)
        ).finally(
            () => console.log("Комната уничтожена")
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

        this.UUID;
        this.roomName;
        this.playersCapacity;
        this.playersJoined;
        this.pack;
        this.packName;

        this.playerReadyData;
        this.playerJoinedData;

        this.startGameData;

        WebSocketIface.addMessageHandler("user_connected", this._playerJoinedToRoom);
        WebSocketIface.addMessageHandler("player_ready_back", this._playerReady);
        WebSocketIface.addMessageHandler("start_game", this._startGame);

        WebSocketIface.addOpenHandler(this._doneConnection);
        WebSocketIface.addCloseHandler(this._closeConnection);
    }
    _startGame = (data) => {
        this.startGameData = data;
        Bus.emit(ROOM_CHANGE, "start_game");
    }

    _playerReady = (data) => {
        this.lastState = this.state;
        this.state = "waiting";

        console.log("Player ready: ");
        console.log(data);

        this.playersJoined++;
        this.playerReadyData = data;

        Bus.emit(ROOM_CHANGE, "player_ready");
    }

    _playerJoinedToRoom = (data) => {
        if (!data.payload.host) {
            data.payload.host = {
                id: data.payload.players[0].id
            }
        }
        this.host = data.payload.host;
        this.lastState = this.state;
        this.state = "waiting";

        console.log("Player joined :");
        console.log(data);

        for (const player of data.payload.players) {
            player.avatar = StaticManager.getUserUrl(player.avatar);
        }

        this.playerJoinedData = data;
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
        } else {
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