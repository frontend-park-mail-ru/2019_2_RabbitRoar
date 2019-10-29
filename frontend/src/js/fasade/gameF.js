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
        this.gameF = new OfflineGameF();
        Bus.on(QUESTION_CHANGE, this._questionChange);
    }


    clickQuestion(packId, cellId) {
        this.gameF.clickQuestion(packId, cellId);
    }

    sendAnswer(answer) {
        this.gameF.sendAnswer(answer);
    }


    _questionChange() {
        Bus.emit(QUESTION_PANEL_UPDATE);
    }

    getQuestionInfo() {
        return this.gameF.getQuestionInfo();       
    }

    getLastClickedCells() {
        return QuestionsM.chosedQuestionsId;
    }

}

// ===================================================

class OfflineGameF {
    constructor() {
        
    }

    clickQuestion(packId, cellId) {
        QuestionsM.clickQuestion(packId, cellId);
    }


    getQuestionInfo() {
        return QuestionsM.getInfo();       
    }

    sendAnswer(answer) {
        QuestionsM.sendAnswer(answer);
    }
}

// ===================================================

class OnlineGameF {
    constructor() {

    }
}


export default new GameF();