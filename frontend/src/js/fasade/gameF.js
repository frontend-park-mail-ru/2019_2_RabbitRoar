import QuestionsM from "../model/questionsM.js";
import RoomM from "../model/roomM.js";
import Bus from "../event_bus.js";
import {
    ROUTER_EVENT,
    QUESTION_PANEL_UPDATE,
    QUESTION_CHANGE,
    WEBSOCKET_CONNECTION,
    WEBSOCKET_CLOSE,
    ROOM_CHANGE,
    QUESTION_WAS_CHOSEN,
    TIMER_INTERRUPTION,
    USERS_PANEL_UPDATE,
    CRASH_EVENT,
    OFFLINE_GAME_END
} from "../modules/events.js";
import { WAITING, SINGLE_GAME, ONLINE_GAME } from "../paths";

import GamePanelC from "../controller/gamePanelC.js";
import QuestionTableC from "../controller/questionsTableC.js"
import QuestionTableE from "../element/questionTableE.js"
import UsersPanelE from "../element/usersPanelE.js"



class GameF {
    constructor() {
        this.clearGameHandler = this._clearGame;

        this.gamePaths = [WAITING, SINGLE_GAME, ONLINE_GAME];

        this.livingElements = 0;
        this.ifaces = new Map;
        this.ifaces.set(GamePanelC, this._gamePanelCInterface);
        this.ifaces.set(QuestionTableC, this._questionTableCInterface);
        this.ifaces.set(QuestionTableE, this._questionTableEInterface);
        this.ifaces.set(UsersPanelE, this._usersPanelEInterface);

        Bus.on(QUESTION_CHANGE, this._questionChange);
        Bus.on(ROOM_CHANGE, this._roomChange);
    }

    gameExist = () => {
        return (!!this.current);
    }

    getInterface = (consumer) => {
        return this.ifaces.get(consumer);
    }

    CreateGame = async (mode = "offline", options) => {
        if (mode === "offline") {
            Bus.on(ROUTER_EVENT.ROUTE_TO, this.clearGameHandler);
            this.current = await this._createOfflineGame(options.packId);
        } else {
            if (options.action === "join") {
                this.current = await this._createOnlineGame(options.roomId, null);
            } else if (options.action === "create") {
                this.current = await this._createOnlineGame(null, options.roomOptions);
            }

            Bus.on(ROUTER_EVENT.ROUTE_TO, this.clearGameHandler);
            this._roomChange();
        }
    }

    _createOfflineGame = async (clickId) => {
        return new OfflineGameF(clickId);
    }

    _createOnlineGame = async (clickId, roomOptions = undefined) => {
        const onlineGame = new OnlineGameF(clickId, roomOptions);
        await onlineGame.connect();
        return onlineGame;
    }



    _clearGame = (path) => {
        if (this.gamePaths.includes(path)) {
            return;
        }

        console.log("Game clearing");
        this.current.clear();
        this.current = undefined;
        Bus.off(ROUTER_EVENT.ROUTE_TO, this.clearGameHandler);
    }


    _questionChange = () => {
        if (QuestionsM.current.questionTable.mode === "default") {
            Bus.emit(QUESTION_PANEL_UPDATE);
        } else if (QuestionsM.current.questionTable.mode === "selected") {
            Bus.emit(QUESTION_PANEL_UPDATE);
            Bus.emit(QUESTION_WAS_CHOSEN);
        } else if (QuestionsM.current.questionTable.mode === "result") {
            Bus.emit(TIMER_INTERRUPTION);
            Bus.emit(QUESTION_PANEL_UPDATE);
        }
    }

    // created->done_connection->waiting->closed (success)
    // created->closed (crash)

    _roomChange = () => {
        console.log(`${RoomM.current.lastState}->${RoomM.current.state}`);
        if (RoomM.current.state === "waiting") {
            Bus.emit(USERS_PANEL_UPDATE);
        } else if (RoomM.current.state === "before_connection") {
            Bus.emit(USERS_PANEL_UPDATE);
        } else if (RoomM.current.state === "crash_connection") {
            Bus.emit(CRASH_EVENT);
        } else if (RoomM.current.state === "done_connection") {
            Bus.emit(WEBSOCKET_CONNECTION, true);
        } else if (RoomM.current.state === "closed") {
            const closeCode = RoomM.current.closeCode;
            const lastState = RoomM.current.lastState;

            Bus.emit(WEBSOCKET_CLOSE, {
                code: closeCode,
                lastState: lastState,
            });
        }
    }

    _questionTableEInterface = () => {
        return this.current.questionTableEInterface;
    }

    _questionTableCInterface = () => {
        return this.current.questionTableCInterface;
    }

    _gamePanelCInterface = () => {
        return this.current.gamePanelCInterface;
    }

    _usersPanelEInterface = () => {
        return this.current.usersPanelEInterface;
    }

    // shity place
    getPackName = () => {
        console.log(this.current);
        const name = this.current.getPackName();
        return name;
    }
}


class OfflineGameF {
    constructor(clickId) {
        QuestionsM.CreateNew("offline", clickId);
    }

    clear = () => {
        QuestionsM.clear();
    }


    get questionTableEInterface() {
        const iface = {
            questionInfo() {
                return QuestionsM.getInfo();
            },
            sendAnswer(answer = "") {
                answer = "";
                QuestionsM.sendAnswer(answer);
            }
        };
        return iface;
    };

    get questionTableCInterface() {
        const iface = {
            clickQuestion(packId, cellId) {
                QuestionsM.clickQuestion(packId, cellId);
            }
        };
        return iface;
    };

    get gamePanelCInterface() {
        const iface = {
            sendAnswer(answer) {
                QuestionsM.sendAnswer(answer);
            }
        };
        return iface;
    };
}


class OnlineGameF {
    constructor(roomId, roomOptions) {
        console.log(roomId, roomOptions);
        QuestionsM.CreateNew("online");
        RoomM.CreateNew(roomId, roomOptions);
    }

    clear = () => {
        QuestionsM.clear();
        RoomM.clear();
    }

    connect = async () => {
        await RoomM.connect();
    }


    get questionTableEInterface() {
        const iface = {
            questionInfo() {
            },
            lastClickedCells() {
            },
        };
        return iface;
    };

    get questionTableCInterface() {
        const iface = {
            clickQuestion(packId, cellId) {
            }
        };
        return iface;
    };

    get gamePanelCInterface() {
        const iface = {
            sendAnswer(answer) {
            }
        };
        return iface;
    };

    get usersPanelEInterface() {
        const iface = {
            getRoomState() {
                return RoomM.state;
            },

            getPlayersWaiting() {
                const playersInfo = new Array;
                for (const player of RoomM.players) {
                    playersInfo.push({
                        url: player.url,
                        name: player.name,
                        uuid: player.uuid
                    });
                }
            },

            getRoomInfo() {
                const roomInfo = {};
                RoomInfo.roomName = RoomM.current.room_name;
                RoomInfo.playersCap = RoomM.current.players_cap;
                RoomInfo.private = RoomM.current.private;
                RoomInfo.packId = RoomM.current.pack_id;
                return roomInfo;
            },

            getPlayersGaming() {

            }
        };
        return iface;
    }


    getPackName = () => {
        return RoomM.getRoomName();
    }
}


export default new GameF();