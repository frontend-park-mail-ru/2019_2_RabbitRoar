import QuestionsM from "../model/questionsM.js";
import RoomM from "../model/roomM.js";
import Bus from "../event_bus.js";
import {
    QUESTION_PANEL_UPDATE,
    QUESTION_CHANGE,
    QUESTION_WAS_CHOSEN,
    TIMER_STOPPED,
    TIMER_INTERRUPTION
} from "../modules/events.js";

import GamePanelC from "../controller/gamePanelC.js"
import QuestionTableC from "../controller/questionsTableC.js"
import QuestionTableE from "../element/questionTableE.js"



class GameF {
    constructor() {
        this.livingElements = 0;
        this.ifaces = new Map;
        this.ifaces.set(GamePanelC, this._gamePanelCInterface.bind(this));
        this.ifaces.set(QuestionTableC, this._questionTableCInterface.bind(this));
        this.ifaces.set(QuestionTableE, this._questionTableEInterface.bind(this));
        Bus.on(QUESTION_CHANGE, this._questionChange);
    }

    gameExist() {
        return (!!this.current);
    }

    getInterface(consumer) {
        return this.ifaces.get(consumer);
    }

    async CreateGame(mode = "offline", clickId = 0, roomOptions = undefined) {
        if (mode === "offline") {
            this.current = await this._createOfflineGame(clickId);
        } else {
            this.current = await this._createOnlineGame(clickId, roomOptions);
        }
    }

    async _createOfflineGame(clickId) {
        return new OfflineGameF(clickId);
    }

    async _createOnlineGame(clickId, roomOptions) {
        const onlineGame = new OnlineGameF(clickId, roomOptions);
        await onlineGame.sendData();
        return onlineGame;
    }


    addElement() {
        this.livingElements++;
    }

    removeElement() {
        this.livingElements--;
        if (this.livingElements === 0) {
            this.current.restart();
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

    _questionTableEInterface() {
        console.log(this.current)
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


    get questionTableEInterface() {
        const iface = {
            questionInfo() {
                return QuestionsM.getInfo();
            },
            lastClickedCells() {
                return QuestionsM.chosedQuestionsId;
            },
            stopTimer() {
                QuestionsM.setDefaultMode();
                QuestionsM.removePointsForQuestion();
                Bus.emit(TIMER_STOPPED);
                Bus.emit(QUESTION_PANEL_UPDATE);
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

    restart() {
        QuestionsM.restart();
    }

    getPackName(){

    }
}

// ===================================================

class OnlineGameF {
    constructor(clickId, roomOptions) {
        console.log(clickId, roomOptions);
        QuestionsM.CreateNew("online", clickId);
        RoomM.CreateNew(clickId, roomOptions);
    }

    async sendData() {
        await RoomM.sendData();
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
            stopTimer() {
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