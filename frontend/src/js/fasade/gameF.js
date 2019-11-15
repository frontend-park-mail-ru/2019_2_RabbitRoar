import QuestionsM from "../model/questionsM.js";
import RoomM from "../model/roomM.js";
import Bus from "../event_bus.js";
import {
    QUESTION_PANEL_UPDATE,
    QUESTION_CHANGE,
    WEBSOCKET_CONNECTION,
    ROOM_CHANGE,
    QUESTION_WAS_CHOSEN,
    TIMER_INTERRUPTION
} from "../modules/events.js";

import GamePanelC from "../controller/gamePanelC.js";
import QuestionTableC from "../controller/questionsTableC.js"
import QuestionTableE from "../element/questionTableE.js"


class GameF {
    constructor() {
        this.livingElements = 0;
        this.ifaces = new Map;
        this.ifaces.set(GamePanelC, this._gamePanelCInterface.bind(this));
        this.ifaces.set(QuestionTableC, this._questionTableCInterface.bind(this));
        this.ifaces.set(QuestionTableE, this._questionTableEInterface.bind(this));
        Bus.on(QUESTION_CHANGE, this._questionChange.bind(this));
        Bus.on(ROOM_CHANGE, this._roomChange.bind(this));
    }

    gameExist() {
        return (!!this.current);
    }

    getInterface(consumer) {
        return this.ifaces.get(consumer);
    }

    //packId = null, roomId = null, roomOptions = null
    async CreateGame(mode = "offline", options) {
        if (mode === "offline") {
            this.current = await this._createOfflineGame(options.packId);
        } else {
            if (options.action === "join") {
                this.current = await this._createOnlineGame(options.roomId, null);
            } else if (options.action === "create") {
                this.current = await this._createOnlineGame(null, options.roomOptions);
            }
        }
    }

    async _createOfflineGame(clickId) {
        return new OfflineGameF(clickId);
    }

    async _createOnlineGame(clickId, roomOptions = undefined) {
        const onlineGame = new OnlineGameF(clickId, roomOptions);
        await onlineGame.connect();
        return onlineGame;
    }


    addElement() {
        this.livingElements++;
    }

    removeElement() {
        this.livingElements--;
        if (this.livingElements < 0) {
            console.log("Warning!");
        }
        if (this.livingElements === 0) {
            this.current.clear();
            this.current = undefined;
        }
    }


    _questionChange() {
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

    _roomChange() {
        if (RoomM.mode === "crash") {
            console.log("F crash");
            this.current.clear();
            this.current = undefined;
            Bus.emit(WEBSOCKET_CONNECTION, false);
        } else if (RoomM.mode === "waiting") {
            Bus.emit(WEBSOCKET_CONNECTION, true);
        }
    }

    _questionTableEInterface() {
        return this.current.questionTableEInterface;
    }

    _questionTableCInterface() {
        return this.current.questionTableCInterface;
    }

    _gamePanelCInterface() {
        return this.current.gamePanelCInterface;
    }

    // shity place
    getPackName() {
        console.log(this.current);
        const name = this.current.getPackName();
        return name;
    }
}

// ===================================================

class OfflineGameF {
    constructor(clickId) {
        QuestionsM.CreateNew("offline", clickId);
    }

    clear() {

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


    getPackName(){

    }
}

// ===================================================

class OnlineGameF {
    constructor(roomId, roomOptions) {
        console.log(roomId, roomOptions);
        QuestionsM.CreateNew("online");
        RoomM.CreateNew(roomId, roomOptions);
    }

    clear() {

    }

    async connect() {
        await RoomM.connect();
    }

    

    addElement() {
        QuestionsM.addElement();
        RoomM.addElement();
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

    getPackName() {
        return RoomM.getRoomName();
    }
}


export default new GameF();