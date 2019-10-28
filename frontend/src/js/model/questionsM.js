import Bus from "../event_bus.js";
import { QUESTION_CHANGE } from "../modules/events.js";

class QuestionsM {
    constructor() {
        this.questionM = new OfflineQuestionsM();
    }

    async selectQuestion(question) {
        await this.questionM.selectQuestion(question);
    }
}



class OfflineQuestionsM {
    constructor() {
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = undefined;
    }


    async clickQuestion(packId, themeId, cellId) {
        const key = packId.toString() + themeId.toString() + cellId.toString();
        const question = localStorage.getItem(key);
        if (!question) {
            throw new Error("Need fetch request");
        }

        this.questionTable.mode = "selected";
        this.questionTable.selectedQuestion = question;
        bus.emit(QUESTION_CHANGE);
    }


    getInfo() {
        return {
            mode: this.questionTable.mode,
            question: this.questionTable.selectedQuestion,
        };
    }


}

export default new GameM();