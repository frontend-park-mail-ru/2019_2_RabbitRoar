import QuestionsM from "../model/questionsM.js";
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

    getInterface(consumer) {
        return this.ifaces.get(consumer);
    }

    CreateGame(mode = "offline", packId = 0) {
        if (mode === "offline") {
            this.current = new OfflineGameF(packId);
        } else {
            this.current = new OnlineGameF(packId);
        }
    }

    reincarnate() {
        this.livingElements++;
    }

    annihilate() {
        this.livingElements--;
        if (this.livingElements === 0) {
            this.current.annihilateGame();
        }
    }


    _questionChange() {
        if (QuestionsM.current.questionTable.mode === "default") {
            Bus.emit(TIMER_INTERRUPTION);
            Bus.emit(QUESTION_PANEL_UPDATE);
        } else {
            Bus.emit(QUESTION_PANEL_UPDATE);
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
}

// ===================================================

class OfflineGameF {
    constructor(packId = 0) {
        QuestionsM.CreateNew("offline", packId);
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
        };
        return iface;
    };

    get questionTableCInterface() {
        const iface = {
            clickQuestion(packId, cellId) {
                Bus.emit(QUESTION_WAS_CHOSEN);
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

    annihilateGame() {
        QuestionsM.annihilate();
    }

}

// ===================================================

class OnlineGameF {
    constructor(packId = 0) {
        QuestionsM.CreateNew("online", packId);
    }
}


export default new GameF();