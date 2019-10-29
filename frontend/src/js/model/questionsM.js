import Bus from "../event_bus.js";
import { QUESTION_CHANGE } from "../modules/events.js";

class QuestionsM {
    constructor() {
        this.current = new OfflineQuestionsM();
    }

    clickQuestion(packId, themeId, cellId) {
        this.current.clickQuestion(packId, themeId, cellId);
    }

    getInfo() {
        return this.current.getInfo();
    }

    sendAnswer(answer) {
        return this.current.sendAnswer(answer);
    }

    get chosedQuestionsId() {
        return this.current.chosedQuestionsId;
    }


}

// =============================================

class OfflineQuestionsM {
    constructor() {
        this.packId = 0;
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = undefined;
        this.chosedQuestionsId = {};
    }


    clickQuestion(packId, cellId) {
        const key = "" + packId + cellId;

        const question = JSON.parse(localStorage.getItem(key));
        if (!question) {
            console.log("No question in cache");
            return;
        }

        this.questionTable.mode = "selected";
        this.questionTable.selectedQuestion = question;


        if (!!this.chosedQuestionsId[cellId]) {
            console.log("Вы уже выбирали вопрос");
            return;
        }
        this.chosedQuestionsId[cellId] = true;

        
        Bus.emit(QUESTION_CHANGE);
    }


    sendAnswer(answer) {
        if (this.questionTable.mode !== "selected") {
            return console.log("Select question");
        }
        const trueAnswer = this.questionTable.selectedQuestion.answer;
        if (trueAnswer === answer) {
            this.questionTable.mode = "default";
            this.questionTable.selectedQuestion = undefined;
            console.log("True answer");
            Bus.emit(QUESTION_CHANGE);
        } else {
            return console.log("Wrong answer");
        }
    }


    getInfo() {
        return {
            packId: this.packId,
            mode: this.questionTable.mode,
            question: this.questionTable.selectedQuestion,
        };
    }


}

export default new QuestionsM();