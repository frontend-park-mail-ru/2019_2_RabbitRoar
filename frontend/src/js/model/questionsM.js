import Bus from "../event_bus.js";
import { QUESTION_CHANGE } from "../modules/events.js";

class QuestionsM {
    constructor() {
        this.current = new OfflineQuestionsM();
    }

    setMode(mode = "offline") {
        if (mode === "offline") {
            this.current = new OfflineQuestionsM();
        } else {
            this.current = new OnlineQuestionsM();
        }
    }

    setPack(packId = 0) {
        this.current.packId = packId;
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

    annihilate() {
        console.log("game restart");
        if (this.current.mode === "offline") {
            this.current = new OfflineQuestionsM();
        } else {
            this.current = new OnlineQuestionsM();
        }
    }

}

// =============================================

class OfflineQuestionsM {
    constructor() {
        this.mode = "offline";
        this.packId = 0;
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = undefined;
        this.chosedQuestionsId = {};
    }


    clickQuestion(packId, cellId) {
        if (!!this.chosedQuestionsId[cellId]) {
            console.log("Вы уже выбирали вопрос");
            return;
        }

        const key = "" + packId + cellId;
        const question = JSON.parse(localStorage.getItem(key));
        if (!question) {
            console.log("No question in cache");
            return;
        }

        this.questionTable.mode = "selected";
        this.questionTable.selectedQuestion = question;
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