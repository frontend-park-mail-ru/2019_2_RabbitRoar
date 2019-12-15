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

    getPackName = () => {
        return this.current.packName;
    }


    getPackId = () => {
        return this.current.pack;
    }

    getHostId = () => {
        if (this.current.host) {
            return this.current.host;
        } else {
            return this.current.players[0];
        }
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


        this.players = {};
        this.host = {};

        this.startGameData;

        WebSocketIface.addMessageHandler("user_connected", this._playerJoinedToRoom);
        WebSocketIface.addMessageHandler("player_ready_back", this._playerReady);
        WebSocketIface.addMessageHandler("start_game", this._startGame);

        WebSocketIface.addOpenHandler(this._doneConnection);
        WebSocketIface.addCloseHandler(this._closeConnection);
    }
    _startGame = (data) => {
        this.startGameData = data;
        this.lastState = this.state;
        this.state = "game";
        Bus.emit(ROOM_CHANGE, "start_game");
    }

    _playerReady = (data) => {
        this.lastState = this.state;
        this.state = "waiting";

        this.playersJoined++;

        for (const player of data.payload.players) {
            player.avatar = StaticManager.getUserUrl(player.avatar);
        }
        
        this.players = data.payload.players;

        Bus.emit(ROOM_CHANGE, "player_ready");
    }

    _playerJoinedToRoom = (data) => {
        if (!data.payload.host) {
            data.payload.host = data.payload.players[0]
        }

        this.host = data.payload.host;
        this.lastState = this.state;
        this.state = "waiting";

        for (const player of data.payload.players) {
            player.avatar = StaticManager.getUserUrl(player.avatar);
        }

        this.players = data.payload.players;
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

        try {
            const csrf = await getCSRF();
            await deleteLeaveRoom(csrf.CSRF);
        } catch (err) {
            console.log(err);
            this.lastState = this.state;
            this.state = "crash_connection";
            return;
        }

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
                response = await postJoinRoom(this.roomId, csrf.CSRF);
            } catch (err) {
                console.log(err);
                this.lastState = this.state;
                this.state = "crash_connection";
                return;
            }
        }

        console.log("ROOM OPTION", this.roomOptions);
        console.log("RESPONSE ", response);
        this.roomInfo = response;

        this.UUID = response.UUID;
        this.roomName = response.name;
        this.playersCapacity = response.playersCapacity;
        this.playersJoined = parseInt(response.playersJoined);
        this.pack = response.pack;
        this.packName = response.packName;

        // this.packDescription = getPackById();
        this.lastState = this.state;
        this.state = "before_connection";

        WebSocketIface.connect(this.roomId);
        console.log("ROOM OPTION", this.roomOptions);
    }

}

export default new RoomM();