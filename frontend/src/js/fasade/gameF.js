import GameM from "../model/questionsM.js";
import Bus from "../event_bus.js";
import {
    QUESTION_CHANGE,
} from "../modules/events.js";
import { 
    QUESTION_PANEL_UPDATE,
    TIME_LINE_UPDATE,
} from "../modules/events.js";

class GameF {
    constructor() {
        this.gameF = new OfflineGameF();

        Bus.on(QUESTION_CHANGE, _questionChange);
    }

    clickQuestion(packId, themeId, cellId) {
        this.gameF.clickQuestion(packId, themeId, cellId);
    }


    _questionChange() {
        Bus.emit(QUESTION_PANEL_UPDATE);
    }

    getQuestionInfo() {
        return QuestionsM.getInfo();       
    }

}


class OfflineGameF {
    constructor() {

    }
}

class OnlineGameF {
    constructor() {

    }
}


export default new GameF();