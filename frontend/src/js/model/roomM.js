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
// "game_ended" - Процесс игры
// "closed" - Вебсоккет закрылся


class RoomM {
    constructor() {
        this.current = undefined;
    }

    get state() {
        return this.current.state;
    }

    CreateNew(roomId, roomOptions, reconnect) {
        this.current = new RealRoomM(roomId, roomOptions, reconnect);
    }

    // WebSocketIface.disconnect() если соккет был открыт,
    // произойдет вызов this.current._closeConnection()
    clear(route=()=>{}) {
        WebSocketIface.disconnect();
        this.current = undefined;
        getCSRF().then(
            (csrf) => {
                deleteLeaveRoom(csrf.CSRF).finally(() => {
                    localStorage.removeItem("last_game_UUID");
                    localStorage.removeItem("last_game_roomInfo");
                    localStorage.removeItem("last_game_roomName");
                    localStorage.removeItem("last_game_playersCapacity");
                    localStorage.removeItem("last_game_playersJoined");
                    localStorage.removeItem("last_game_pack");
                    localStorage.removeItem("last_game_packName");
        
                    localStorage.removeItem("last_game_host");
                    localStorage.removeItem("last_game_players");
        
                    localStorage.removeItem("last_game_lastState");
                    localStorage.removeItem("last_game_state");
                    localStorage.removeItem("last_game_startGameData");
                    route();
                });
            }
        )
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
    constructor(roomId, roomOptions, reconnect) {
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


        if (!reconnect) {
            WebSocketIface.addMessageHandler("user_connected", this._playerJoinedToRoom);
            WebSocketIface.addOpenHandler(this._doneConnection);
            WebSocketIface.addMessageHandler("player_ready_back", this._playerReady);
            WebSocketIface.addMessageHandler("start_game", this._startGame);
        }
        WebSocketIface.addMessageHandler("game_ended", this._endGame);
        WebSocketIface.addCloseHandler(this._closeConnection);
    }


    _endGame = (data) => {
        this.lastState = this.state;
        this.state = "game_ended";
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);
        Bus.emit(ROOM_CHANGE);
    }


    _startGame = (data) => {
        this.startGameData = data;
        this.lastState = this.state;
        this.state = "game";

        localStorage.setItem("last_game_startGameData", JSON.stringify(data));
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);
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

        localStorage.setItem("last_game_players", JSON.stringify(data.payload.players));
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);

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

        localStorage.setItem("last_game_host", JSON.stringify(data.payload.host));
        localStorage.setItem("last_game_players", JSON.stringify(data.payload.players));
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);

        this.players = data.payload.players;
        Bus.emit(ROOM_CHANGE, "player_connected");
    }


    _doneConnection = () => {
        this.lastState = this.state;
        this.state = "done_connection";
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);
        Bus.emit(ROOM_CHANGE);
    }

    _closeConnection = (event) => {
        this.lastState = this.state;
        this.state = "closed";
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);
        this.closeCode = event.code;
        Bus.emit(ROOM_CHANGE);
    }


    async connect() {
        let response;

        if (localStorage.getItem("last_game_UUID")) {
            try {
                const csrf = await getCSRF();
                await deleteLeaveRoom(csrf.CSRF);
                localStorage.removeItem("last_game_UUID");
                localStorage.removeItem("last_game_roomInfo");
                localStorage.removeItem("last_game_roomName");
                localStorage.removeItem("last_game_playersCapacity");
                localStorage.removeItem("last_game_playersJoined");
                localStorage.removeItem("last_game_pack");
                localStorage.removeItem("last_game_packName");
    
                localStorage.removeItem("last_game_host");
                localStorage.removeItem("last_game_players");
    
                localStorage.removeItem("last_game_lastState");
                localStorage.removeItem("last_game_state");
                localStorage.removeItem("last_game_startGameData");
            } catch (err) {
                this.lastState = this.state;
                this.state = "crash_connection";
                localStorage.setItem("last_game_lastState", this.lastState);
                localStorage.setItem("last_game_state", this.state);
                return;
            }
        }

        if (this.roomOptions) {
            try {
                const csrf = await getCSRF();
                response = await postCreateRoom(this.roomOptions, csrf.CSRF);
            } catch (err) {
                this.lastState = this.state;
                this.state = "crash_connection";
                localStorage.setItem("last_game_lastState", this.lastState);
                localStorage.setItem("last_game_state", this.state);
                return;
            }
            this.roomId = response.UUID;
        } else {
            try {
                const csrf = await getCSRF();
                if (this.roomId === null) {
                }
                response = await postJoinRoom(this.roomId, csrf.CSRF);
            } catch (err) {
                this.lastState = this.state;
                this.state = "crash_connection";
                localStorage.setItem("last_game_lastState", this.lastState);
                localStorage.setItem("last_game_state", this.state);
                return;
            }
        }
        localStorage.setItem("last_game_UUID", response.UUID);
        localStorage.setItem("last_game_roomInfo", JSON.stringify(response));
        localStorage.setItem("last_game_roomName", response.name);
        localStorage.setItem("last_game_playersCapacity", response.playersCapacity);
        localStorage.setItem("last_game_playersJoined", response.playersJoined);
        localStorage.setItem("last_game_pack", response.pack);
        localStorage.setItem("last_game_packName", response.packName);

        this.roomInfo = response;
        this.UUID = response.UUID;
        this.roomName = response.name;
        this.playersCapacity = response.playersCapacity;
        this.playersJoined = parseInt(response.playersJoined);
        this.pack = response.pack;
        this.packName = response.packName;

        this.lastState = this.state;
        this.state = "before_connection";
        localStorage.setItem("last_game_lastState", this.lastState);
        localStorage.setItem("last_game_state", this.state);
        WebSocketIface.connect(this.roomId);
    }

    recover = () => {
        this.roomInfo = JSON.parse(localStorage.getItem("last_game_roomInfo"));
        this.UUID = localStorage.getItem("last_game_UUID");
        this.roomName = localStorage.getItem("last_game_roomName");
        this.playersCapacity = localStorage.getItem("last_game_playersCapacity");
        this.playersJoined = localStorage.getItem("last_game_playersJoined");
        this.pack = localStorage.getItem("last_game_pack");
        this.packName = localStorage.getItem("last_game_packName");

        this.host = JSON.parse(localStorage.getItem("last_game_host"));
        this.players = JSON.parse(localStorage.getItem("last_game_players"));

        this.lastState = localStorage.getItem("last_game_lastState");
        this.state = "game";
        this.startGameData = JSON.parse(localStorage.getItem("last_game_startGameData"));


        WebSocketIface.connect(this.roomId);
    }

}

export default new RoomM();