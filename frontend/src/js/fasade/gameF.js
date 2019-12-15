import QuestionsM from "../model/questionsM.js";
import RoomM from "../model/roomM.js";
import PlayersM from "../model/playersM.js";
import Bus from "../event_bus.js";
import {
    ROUTER_EVENT,
    USERS_PANEL_UPDATE,
    QUESTION_PANEL_UPDATE,
    GAME_PANEL_UPDATE,
    QUESTION_CHANGE,
    PLAYERS_CHANGE,
    CONNECTION,
    ROOM_CHANGE,
    GAME_PANEL_STATE_CHANGE,
    TIMER_INTERRUPTION,
    CRASH_EVENT,
    USER_PANEL_USER_READY,
    USER_PANEL_NEW_USER,
    ONLINE_QUESTION_TABLE_UPDATE,
    WEBSOCKET_CLOSE
} from "../modules/events.js";
import { WAITING, SINGLE_GAME, ONLINE_GAME } from "../paths";
import WebSocketIface from "../modules/webSocketIface.js"


import GamePanelC from "../controller/gamePanelC.js";
import OnlineGamePanelC from "../controller/gamePanelOnlineC.js";
import GamePanelE from "../element/gamePanelE.js";
import OnlineGamePanelE from "../element/gamePanelOnlineE.js";
import QuestionTableC from "../controller/questionsTableC.js"
import QuestionTableE from "../element/questionTableE.js"
import UsersPanelE from "../element/usersPanelE.js"
import UsersGamePanelE from "../element/usersGamePanelE.js"
import ValidatorF from "./userValidatorF.js";
import StaticManager from "../modules/staticManager.js";
import packM from "../model/packM.js";



class GameF {
    constructor() {
        this.clearGameHandler = this._clearGame;

        this.gamePaths = [WAITING, SINGLE_GAME, ONLINE_GAME];

        this.livingElements = 0;
        this.ifaces = new Map;
        this.ifaces.set(GamePanelC, this._gamePanelCInterface);
        this.ifaces.set(GamePanelE, this._gamePanelEInterface);
        this.ifaces.set(OnlineGamePanelC, this._onlineGamePanelCInterface);
        this.ifaces.set(OnlineGamePanelE, this._onlineGamePanelEInterface);
        this.ifaces.set(QuestionTableC, this._questionTableCInterface);
        this.ifaces.set(QuestionTableE, this._questionTableEInterface);
        this.ifaces.set(UsersPanelE, this._usersPanelEInterface);
        this.ifaces.set(UsersGamePanelE, this._usersGamePanelEInterface);

        Bus.on(QUESTION_CHANGE, this._questionChange);
        Bus.on(ROOM_CHANGE, this._roomChange);
        //Bus.on(ONLINE_QUESTION_TABLE_UPDATE, this._updateQuestionTable);
        Bus.on(PLAYERS_CHANGE, this._playersChange);
    }

    // _updateQuestionTable(type) {
    //     if (type === "disable_question") {
    //         console.log("Нужно кинуть ивент элементу");
    //     }
    // }

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
                console.log("Create game, user join");
                this.current = await this._createOnlineGame(options.roomId, null);

            } else if (options.action === "create") {
                console.log("Create game, user create");

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


    _questionChange = (type) => {
        if (QuestionsM.current.questionTable.mode === "default") {
            if (type === "disable_question"){
                Bus.emit();
            }
            Bus.emit(QUESTION_PANEL_UPDATE);
        } else if (QuestionsM.current.questionTable.mode === "selected") {
            Bus.emit(QUESTION_PANEL_UPDATE);
            Bus.emit(GAME_PANEL_STATE_CHANGE, "selected");
        } else if (QuestionsM.current.questionTable.mode === "result") {
            Bus.emit(TIMER_INTERRUPTION);
            Bus.emit(QUESTION_PANEL_UPDATE);
            Bus.emit(GAME_PANEL_UPDATE);    // Только для offline
        } else if (QuestionsM.current.questionTable.mode === "verdict") {
            Bus.emit(QUESTION_PANEL_UPDATE);
            Bus.emit(GAME_PANEL_STATE_CHANGE, "verdict");
        } else if (QuestionsM.current.questionTable.mode === "answer_race") {
            Bus.emit(QUESTION_PANEL_UPDATE);
            Bus.emit(GAME_PANEL_STATE_CHANGE, "answer_race");
        }
    }




    _playersChange = (activeUser) => {
        const playersState = {
            active: activeUser,
            players: PlayersM.current.players
        }

        Bus.emit(USERS_PANEL_UPDATE, playersState);
    }

    // created->done_connection->waiting->closed (success)
    // created->closed (crash)

    _roomChange = (eventType) => {
        console.log(`${RoomM.current.lastState}->${RoomM.current.state}`);

        if (RoomM.current.state === "waiting") {
            if (RoomM.current.lastState === "done_connection") {
                Bus.emit(CONNECTION, "done");
            }
            if (eventType === "player_connected") {
                Bus.emit(USER_PANEL_NEW_USER, RoomM.current.players);
            } else if (eventType === "player_ready") {
                Bus.emit(USER_PANEL_USER_READY, RoomM.current.players);
            } else if (eventType === "start_game") {
                QuestionsM.current.addFields(
                    { name: "themes", value: RoomM.current.startGameData.payload.themes },
                    { name: "userId", value: ValidatorF.userId },
                );
                PlayersM.current.addFields(
                    { name: "userId", value: ValidatorF.userId },
                    { name: "host", value: RoomM.current.host },
                    { name: "players", value: RoomM.current.players }
                );

                Bus.emit(ROUTER_EVENT.ROUTE_TO, ONLINE_GAME);
            }


        } else if (RoomM.current.state === "before_connection") {
            Bus.emit(CONNECTION, "before");
        } else if (RoomM.current.state === "crash_connection") {
            Bus.emit(CRASH_EVENT);
        } else if (RoomM.current.state === "done_connection") {
            Bus.emit(CONNECTION, "data_waiting");
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

    _gamePanelEInterface = () => {
        return this.current.gamePanelEInterface;
    }

    _onlineGamePanelCInterface = () => {
        return this.current.onlineGamePanelCInterface;
    }

    _onlineGamePanelEInterface = () => {
        return this.current.onlineGamePanelEInterface;
    }

    _usersPanelEInterface = () => {
        return this.current.usersPanelEInterface;
    }

    _usersGamePanelEInterface = () => {
        return this.current.usersGamePanelEInterface;
    }

    // shity place
    getPackName = () => {
        const name = this.current.getPackName();
        return name;
    }
    
    // Методы работают только для онлайна
    getRoomName = () => {
        return this.current.getRoomName();
    }

    getPackDescription = () => {
        return this.current.getPackDescription();
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
            clickQuestion(packId, cellId, themeId) {
                QuestionsM.clickQuestion(packId, cellId, themeId);
            }
        };
        return iface;
    };

    get gamePanelEInterface() {
        const iface = {
            getScoreById(userId) {
                return QuestionsM.current.score;
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

        console.log("in online game constructor");
        QuestionsM.CreateNew("online");
        RoomM.CreateNew(roomId, roomOptions);
        PlayersM.CreateNew(roomId, roomOptions);
        
        WebSocketIface.addMessageHandler("answer_given_back", () => Bus.emit(QUESTION_CHANGE));
        WebSocketIface.addMessageHandler("request_respondent", () => Bus.emit(QUESTION_CHANGE));
        WebSocketIface.addMessageHandler("request_answer_from_respondent", () => Bus.emit(QUESTION_CHANGE));
        WebSocketIface.addMessageHandler("verdict_given_back", () => Bus.emit(QUESTION_CHANGE));

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
                let info = QuestionsM.getInfo();

                if (QuestionsM.current.questionTable.mode === "result") {
                    info = Object.assign(info, PlayersM.getAnsweredPlayerInfo());
                    console.log(info);
                }

                if (QuestionsM.current.questionTable.mode === "verdict") {
                    info = Object.assign(info, PlayersM.getVerdictInfo());
                    console.log(info);
                }

                return info;
            },

        };
        return iface;
    };

    get questionTableCInterface() {
        const iface = {
            clickQuestion(packId, cellId, themeId) {
                if (PlayersM.haveAbilityChoose()) {
                    QuestionsM.clickQuestion(packId, cellId, themeId);
                } else {
                    console.log("НОУ юзер не может выбирать вопрос");
                }
            },
            sendVerdict(result) {
                if (result) {
                    WebSocketIface.sentMessage(JSON.stringify({"type": "verdict_correct"}));
                } else {
                    WebSocketIface.sentMessage(JSON.stringify({"type": "verdict_wrong"}));
                }
            }
        };
        return iface;
    };

    get onlineGamePanelCInterface() {
        const iface = {
            sendAnswer(answer) {
                QuestionsM.sendAnswer(answer);
            },
            race() {
                PlayersM.race();
            }
        };
        return iface;
    };

    get onlineGamePanelEInterface() {
        const iface = {
            getScoreById(userId) {
                for (const player of PlayersM.current.players) {
                    if (player.id === userId) {
                        return player.score;
                    }
                }
            }
        };
        return iface;
    };

    get usersPanelEInterface() {
        const iface = {
            getPlayers() {
                const capacity = RoomM.current.roomInfo.playersCapacity;
                const players = new Array;

                for (let i = 0; i < capacity; i++) {
                    players.push({
                        id: i,
                        username: "Empty",
                        avatar: StaticManager.getUserUrl(),
                        score: 0,
                        ready: false
                    });
                }
                return players;
            },

            getRoomInfo() {
                return RoomM.current.roomInfo;
            },
            getHost() {
                return RoomM.current.host;
            },
        };
        return iface;
    }

    get usersGamePanelEInterface() {
        const iface = {
            getPlayers() {
                return PlayersM.current.players;
            },
            getGameInfo() {
                return {};
            },
            getHost() {
                return PlayersM.current.host;
            },
        };
        return iface;
    }

    getRoomName = () => {
        return RoomM.getRoomName();
    }

    getPackName = () => {
        return RoomM.getPackName();
    }

    getPackDescription = () => {
        const packId = RoomM.getPackId();
        //console.log(packM.getPackById(packId));
        return packM.getPackById(packId);
    }
}


export default new GameF();