import QuestionsM from "../model/questionsM.js";
import Bus from "../event_bus.js";
import {
    QUESTION_CHANGE,
} from "../modules/events.js";
import {
    QUESTION_PANEL_UPDATE,
    ANSWER_PANEL_UPDATE,
} from "../modules/events.js";


class GameF {
    constructor() {
        this.current = new OfflineGameF();
        this.livingElements = 0;
        Bus.on(QUESTION_CHANGE, this._questionChange);
    }

    setMode(mode = "offline") {
        if (mode === "offline") {
            this.current = new OfflineGameF();
        } else {
            this.current = new OnlineGameF();
        }
    }



    reincarnate() {
        this.livingElements++;
        console.log(`add element: ${this.livingElements}`);
    }

    annihilate() {
        this.livingElements--;
        console.log(`delete element: ${this.livingElements}`);
        if (this.livingElements === 0) {
            this.current.annihilateGame();
        }
    }

    get tabsCInterface() {
        return this.current.tabsCInterface;
    }


    get questionTableEInterface() {
        return this.current.questionTableEInterface;
    }

    get questionTableCInterface() {
        return this.current.questionTableCInterface;
    }

    get gamePanelCInterface() {
        return this.current.gamePanelCInterface;
    }


    _questionChange() {
        Bus.emit(QUESTION_PANEL_UPDATE);
    }
}

// ===================================================

class OfflineGameF {
    constructor() {
        QuestionsM.setMode("offline");
    }

    get tabsCInterface() {
        const iface = {
            setPack(packId = 0) {
                QuestionsM.setPack(packId);
            }
        };
        return iface;
    }


    get questionTableEInterface() {
        const iface = {
            get questionInfo() {
                return QuestionsM.getInfo();
            },
            get lastClickedCells() {
                return QuestionsM.chosedQuestionsId;
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


    annihilateGame() {
        QuestionsM.annihilate();
    }

}

// ===================================================

class OnlineGameF {
    constructor() {
        QuestionsM.setMode("online");
    }
}


export default new GameF();